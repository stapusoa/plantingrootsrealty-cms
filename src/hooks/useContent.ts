import { useState, useEffect } from 'react';
import type { ContentItem } from '../pages/types';
import { octokit } from '../../api/github'; // backend-only token, secure
import { REPO_OWNER, REPO_NAME, BRANCH, CONTENT_PATH } from '../env';
import matter from 'gray-matter';

const isGitHubEnabled = true;

const getContentFiles = async (folder: 'posts' | 'pages') => {
  const fullPath = `${CONTENT_PATH}/${folder}`;
  try {
    const { data } = await octokit.rest.repos.getContent({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: fullPath,
      ref: BRANCH,
    });

    if (Array.isArray(data)) {
      return data
        .filter(file => file.name.endsWith('.md') && file.type === 'file')
        .map(file => ({
          name: file.name,
          path: file.path,
          sha: file.sha || '',
          content: '',
          download_url: file.download_url || '',
        }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching content files:', error);
    return [];
  }
};

const getFileContent = async (path: string): Promise<string> => {
  try {
    const { data } = await octokit.rest.repos.getContent({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path,
      ref: BRANCH,
    });

    if ('content' in data && typeof data.content === 'string') {
      return Buffer.from(data.content, 'base64').toString('utf-8');
    }
    return '';
  } catch (error) {
    console.error('Error fetching file content:', error);
    return '';
  }
};

const parseMarkdownFile = (rawContent: string, filename: string) => {
  try {
    const { data, content } = matter(rawContent);
    return {
      id: filename.replace('.md', ''),
      title: data.title || 'Untitled',
      type: data.type || 'post',
      status: data.status || 'published',
      content: content.trim(),
      excerpt: data.excerpt || content.slice(0, 150) + '...',
      createdAt: data.date || new Date().toISOString().split('T')[0],
      updatedAt: data.updated || data.date || new Date().toISOString().split('T')[0],
      filename,
      sha: '', // to be set after fetch
    };
  } catch (error) {
    console.error('Error parsing markdown file:', error);
    return {
      id: filename.replace('.md', ''),
      title: 'Untitled',
      type: 'post',
      status: 'published',
      content: '',
      excerpt: '',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      filename,
      sha: '',
    };
  }
};

const createMarkdownContent = (contentItem: ContentItem): string => {
  const frontmatter = {
    title: contentItem.title,
    type: contentItem.type,
    status: contentItem.status,
    excerpt: contentItem.excerpt,
    date: contentItem.createdAt,
    updated: contentItem.updatedAt,
  };
  return matter.stringify(contentItem.content, frontmatter);
};

const createOrUpdateFile = async (
  path: string,
  content: string,
  message: string,
  sha?: string
): Promise<boolean> => {
  try {
    await octokit.rest.repos.createOrUpdateFileContents({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path,
      message,
      content: Buffer.from(content).toString('base64'),
      sha,
      branch: BRANCH,
    });
    return true;
  } catch (error) {
    console.error('Error creating/updating file:', error);
    return false;
  }
};

const deleteFile = async (
  path: string,
  sha: string,
  message: string
): Promise<boolean> => {
  try {
    await octokit.rest.repos.deleteFile({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path,
      message,
      sha,
      branch: BRANCH,
    });
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

// Media upload calls your backend API; no token exposure on frontend!
const uploadMediaFile = async (file: File): Promise<{ success: boolean; url?: string; message?: string }> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/media/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Upload failed: ${errorText}`);
    }

    const data = await response.json();
    return { success: true, url: data.url };
  } catch (error: any) {
    console.error('Media upload error:', error);
    return { success: false, message: error.message };
  }
};

export function useContent() {
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadContent = async () => {
    setLoading(true);
    setError(null);
    try {
      const [postFiles, pageFiles] = await Promise.all([
        getContentFiles('posts'),
        getContentFiles('pages'),
      ]);

      const allFiles = [...postFiles, ...pageFiles];

      const contentPromises = allFiles.map(async (file) => {
        const rawContent = await getFileContent(file.path);
        const parsed = parseMarkdownFile(rawContent, file.name);
        return { ...parsed, sha: file.sha };
      });

      const loaded = await Promise.all(contentPromises);
      setContents(loaded);
    } catch (err) {
      setError('Failed to load content');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const saveContent = async (contentItem: ContentItem): Promise<boolean> => {
    try {
      const markdownContent = createMarkdownContent(contentItem);
      const folder = contentItem.type === 'post' ? 'posts' : 'pages';
      const filename = contentItem.filename || `${contentItem.id}.md`;
      const path = `${CONTENT_PATH}/${folder}/${filename}`;
      const message = contentItem.sha
        ? `Update ${contentItem.type}: ${contentItem.title}`
        : `Create ${contentItem.type}: ${contentItem.title}`;

      const success = await createOrUpdateFile(path, markdownContent, message, contentItem.sha);
      if (success) {
        await loadContent();
      }
      return success;
    } catch (err) {
      console.error('Error saving content:', err);
      return false;
    }
  };

  const deleteContent = async (contentItem: ContentItem): Promise<boolean> => {
    if (!contentItem.sha || !contentItem.filename) {
      console.error('Missing SHA or filename for deletion');
      return false;
    }
    try {
      const folder = contentItem.type === 'post' ? 'posts' : 'pages';
      const path = `${CONTENT_PATH}/${folder}/${contentItem.filename}`;
      const message = `Delete ${contentItem.type}: ${contentItem.title}`;

      const success = await deleteFile(path, contentItem.sha, message);
      if (success) {
        setContents(prev => prev.filter(c => c.id !== contentItem.id));
      }
      return success;
    } catch (err) {
      console.error('Error deleting content:', err);
      return false;
    }
  };

  const createContent = (type: 'post' | 'page'): ContentItem => {
    const timestamp = Date.now().toString();
    const date = new Date().toISOString().split('T')[0];
    const newContent: ContentItem = {
      id: timestamp,
      title: `New ${type === 'post' ? 'Post' : 'Page'}`,
      type,
      status: 'draft',
      content: `# New ${type === 'post' ? 'Post' : 'Page'}\n\nStart writing your content here...`,
      excerpt: `A new ${type} draft.`,
      createdAt: date,
      updatedAt: date,
      filename: `${timestamp}.md`,
      sha: '',
    };
    setContents(prev => [newContent, ...prev]);
    return newContent;
  };

  useEffect(() => {
    loadContent();
  }, []);

  return {
    contents,
    loading,
    error,
    loadContent,
    saveContent,
    deleteContent,
    createContent,
    uploadMediaFile,
    isGitHubConnected: isGitHubEnabled,
  };
}