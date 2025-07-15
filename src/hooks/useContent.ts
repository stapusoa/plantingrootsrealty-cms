import { useState, useEffect } from 'react';
import type { ContentItem } from '../pages/types';
import { octokit } from '../../api/github'; // This should be a backend-only module
import { REPO_OWNER, REPO_NAME, BRANCH } from '../env'; // No GITHUB_TOKEN here
import matter from 'gray-matter';

const isGitHubEnabled = true;

// GitHub API functions
const getContentFiles = async (folder: 'posts' | 'pages') => {
  try {
    const { data } = await octokit.rest.repos.getContent({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: `content/${folder}`,
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
      return atob(data.content);
    }
    return '';
  } catch (error) {
    console.error('Error fetching file content:', error);
    return '';
  }
};

const createFile = async (path: string, content: string, message: string): Promise<boolean> => {
  try {
    await octokit.rest.repos.createOrUpdateFileContents({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path,
      message,
      content: btoa(content),
      branch: BRANCH,
    });
    return true;
  } catch (error) {
    console.error('Error creating file:', error);
    return false;
  }
};

const updateFile = async (path: string, content: string, sha: string, message: string): Promise<boolean> => {
  try {
    await octokit.rest.repos.createOrUpdateFileContents({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path,
      message,
      content: btoa(content),
      sha,
      branch: BRANCH,
    });
    return true;
  } catch (error) {
    console.error('Error updating file:', error);
    return false;
  }
};

const deleteFile = async (path: string, sha: string, message: string): Promise<boolean> => {
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

const parseMarkdownFile = (rawContent: string, filename: string) => {
  try {
    const { data, content } = matter(rawContent);
    const id = filename.replace('.md', '');
    
    return {
      id,
      title: data.title || 'Untitled',
      type: data.type || 'post',
      status: data.status || 'published',
      content: content.trim(),
      excerpt: data.excerpt || content.slice(0, 150) + '...',
      createdAt: data.date || new Date().toISOString().split('T')[0],
      updatedAt: data.updated || data.date || new Date().toISOString().split('T')[0],
      filename,
      sha: '',
    };
  } catch (error) {
    console.error('Error parsing markdown file:', error);
    const id = filename.replace('.md', '');
    return {
      id,
      title: 'Untitled',
      type: 'post' as const,
      status: 'published' as const,
      content: rawContent,
      excerpt: rawContent.slice(0, 150) + '...',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      filename,
      sha: '',
    };
  }
};

const createMarkdownContent = (contentItem: any): string => {
  try {
    const frontmatter = {
      title: contentItem.title,
      type: contentItem.type,
      status: contentItem.status,
      excerpt: contentItem.excerpt,
      date: contentItem.createdAt,
      updated: contentItem.updatedAt,
    };

    return matter.stringify(contentItem.content, frontmatter);
  } catch (error) {
    console.error('Error creating markdown content:', error);
    // Fallback to basic markdown format
    return `---
title: ${contentItem.title}
type: ${contentItem.type}
status: ${contentItem.status}
date: ${contentItem.createdAt}
---

${contentItem.content}`;
  }
};

// Mock data for when GitHub is not available
const mockContent: ContentItem[] = [
  {
    id: '1',
    title: 'Welcome to your CMS',
    type: 'post',
    status: 'published',
    content: `# Welcome to your Content Management System

This is your new CMS powered by React, GitHub, and Auth0. Here's what you can do:

## Features
- **Content Management**: Create, edit, and delete posts and pages
- **GitHub Integration**: All content is stored in your GitHub repository as markdown files
- **Real-time Preview**: See your content as you write it
- **Auth0 Authentication**: Secure access to your CMS

## Getting Started
1. Set up your environment variables:
   - \`VITE_GITHUB_TOKEN\` - Your GitHub personal access token
   - \`VITE_AUTH0_DOMAIN\` - Your Auth0 domain
   - \`VITE_AUTH0_CLIENT_ID\` - Your Auth0 client ID

2. Start creating content using the sidebar navigation

3. Your content will be automatically saved to your GitHub repository

## Demo Mode
You're currently viewing demo content. Connect your GitHub repository to start managing real content.`,
    excerpt: 'Learn how to use your new CMS and set up GitHub integration.',
    createdAt: '2025-01-14',
    updatedAt: '2025-01-14',
    filename: 'welcome.md',
  },
  {
    id: '2',
    title: 'Getting Started Guide',
    type: 'page',
    status: 'published',
    content: `# Getting Started with Your CMS

## Environment Setup

### Required Environment Variables
Create a \`.env\` file in your project root with:

\`\`\`
VITE_GITHUB_TOKEN=your_github_token_here
VITE_AUTH0_DOMAIN=your-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your_client_id_here
\`\`\`

### GitHub Token Setup
1. Go to GitHub Settings > Developer settings > Personal access tokens
2. Generate a new token with \`repo\` permissions
3. Add the token to your \`.env\` file

### Auth0 Setup
1. Create an Auth0 application
2. Set the callback URL to \`http://localhost:3000\`
3. Add your domain and client ID to the \`.env\` file

## Content Management

### Creating Content
- Use the "+" button in the sidebar to create new posts or pages
- Content is written in Markdown format
- Use the editor to write and preview your content

### Publishing
- Content can be saved as "draft" or "published"
- Published content will be visible in your final site
- All content is stored in your GitHub repository

## Features

### Sidebar Navigation
- **Posts**: Blog posts and articles
- **Pages**: Static pages like About, Contact, etc.
- **Media**: File management (coming soon)
- **Settings**: CMS configuration

### Editor Features
- Real-time preview
- Markdown support
- Metadata management
- Publishing controls`,
    excerpt: 'Complete guide to setting up and using your CMS.',
    createdAt: '2025-01-14',
    updatedAt: '2025-01-14',
    filename: 'getting-started.md',
  },
  {
    id: '3',
    title: 'Sample Blog Post',
    type: 'post',
    status: 'draft',
    content: `# This is a Sample Blog Post

This is a sample blog post to demonstrate how your CMS works. You can edit this content or delete it once you're ready to create your own posts.

## Features Demonstrated

### Markdown Support
You can use all standard Markdown formatting:
- **Bold text**
- *Italic text*
- [Links](https://example.com)
- Lists and more

### Content Management
- Edit content in the sidebar
- Switch between preview and edit modes
- Save drafts or publish immediately
- Delete content when no longer needed

### GitHub Integration
When connected to GitHub, all your content changes will be:
- Automatically saved to your repository
- Version controlled with Git
- Backed up in the cloud
- Accessible from anywhere

## Next Steps
1. Connect your GitHub repository
2. Set up Auth0 authentication
3. Start creating your own content
4. Customize the CMS to fit your needs

Happy writing!`,
    excerpt: 'A sample blog post showing the CMS features and capabilities.',
    createdAt: '2025-01-14',
    updatedAt: '2025-01-14',
    filename: 'sample-blog-post.md',
  },
  {
    id: '4',
    title: 'About Page',
    type: 'page',
    status: 'published',
    content: `# About This CMS

This Content Management System was built with modern web technologies to provide a seamless content creation experience.

## Technology Stack
- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS v4
- **Authentication**: Auth0
- **Storage**: GitHub API
- **Content Format**: Markdown with frontmatter

## Key Features
- **Git-based**: All content stored in GitHub
- **Real-time editing**: See changes as you type
- **Responsive design**: Works on desktop and mobile
- **Secure**: Auth0 authentication
- **Version control**: Full Git history of changes

## Content Format
All content is stored as Markdown files with YAML frontmatter:

\`\`\`yaml
---
title: Your Post Title
type: post
status: published
date: 2025-01-14
---

Your content here...
\`\`\`

## Get Started
Ready to start creating? Click the "+" button in the sidebar to create your first post or page.`,
    excerpt: 'Learn about the technology and features powering this CMS.',
    createdAt: '2025-01-14',
    updatedAt: '2025-01-14',
    filename: 'about.md',
  },
];

export function useContent() {
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadContent = async () => {
    setLoading(true);
    setError(null);
    
    if (!isGitHubEnabled) {
      // Use mock data when GitHub is not connected
      setTimeout(() => {
        setContents(mockContent);
        setLoading(false);
      }, 800); // Simulate loading time
      return;
    }

    try {
      // Load both posts and pages
      const [postFiles, pageFiles] = await Promise.all([
        getContentFiles('posts'),
        getContentFiles('pages'),
      ]);

      const allFiles = [...postFiles, ...pageFiles];
      
      if (allFiles.length === 0) {
        // No content found, use mock data as starting point
        setContents(mockContent);
        setLoading(false);
        return;
      }

      // Load content for each file
      const contentPromises = allFiles.map(async (file) => {
        const rawContent = await getFileContent(file.path);
        const parsedContent = parseMarkdownFile(rawContent, file.name);
        return {
          ...parsedContent,
          sha: file.sha,
        };
      });

      const loadedContent = await Promise.all(contentPromises);
      setContents(loadedContent);
    } catch (err) {
      setError('Failed to load content from GitHub');
      console.error('Error loading content:', err);
      // Fallback to mock data on error
      setContents(mockContent);
    } finally {
      setLoading(false);
    }
  };

  const saveContent = async (contentItem: ContentItem): Promise<boolean> => {
    if (!isGitHubEnabled) {
      // Simulate save for mock data
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      const updated = { ...contentItem, updatedAt: new Date().toISOString().split('T')[0] };
      setContents(prev => {
        const existing = prev.find(c => c.id === contentItem.id);
        if (existing) {
          return prev.map(c => c.id === contentItem.id ? updated : c);
        } else {
          return [updated, ...prev];
        }
      });
      return true;
    }

    try {
      const markdownContent = createMarkdownContent(contentItem);
      const folder = contentItem.type === 'post' ? 'posts' : 'pages';
      const filename = contentItem.filename || `${contentItem.id}.md`;
      const path = `content/${folder}/${filename}`;

      let success = false;
      
      if (contentItem.sha) {
        // Update existing file
        success = await updateFile(
          path,
          markdownContent,
          contentItem.sha,
          `Update ${contentItem.type}: ${contentItem.title}`
        );
      } else {
        // Create new file
        success = await createFile(
          path,
          markdownContent,
          `Create ${contentItem.type}: ${contentItem.title}`
        );
      }

      if (success) {
        // Reload content to get updated data
        await loadContent();
      }

      return success;
    } catch (err) {
      console.error('Error saving content:', err);
      return false;
    }
  };

  const deleteContent = async (contentItem: ContentItem): Promise<boolean> => {
    if (!isGitHubEnabled) {
      // Simulate delete for mock data
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      setContents(prev => prev.filter(c => c.id !== contentItem.id));
      return true;
    }

    if (!contentItem.sha || !contentItem.filename) {
      return false;
    }

    try {
      const folder = contentItem.type === 'post' ? 'posts' : 'pages';
      const path = `content/${folder}/${contentItem.filename}`;
      
      const success = await deleteFile(
        path,
        contentItem.sha,
        `Delete ${contentItem.type}: ${contentItem.title}`
      );

      if (success) {
        // Remove from local state
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
    
    return {
      id: timestamp,
      title: `New ${type === 'post' ? 'Post' : 'Page'}`,
      type,
      status: 'draft',
      content: `# New ${type === 'post' ? 'Post' : 'Page'}

Start writing your content here...

${type === 'post' ? 
  'This is a blog post. You can write about anything you want and publish it to your site.' : 
  'This is a page. Pages are typically used for static content like About, Contact, or other important information.'}`,
      excerpt: `A new ${type} ready for your content.`,
      createdAt: date,
      updatedAt: date,
      filename: `${timestamp}.md`,
    };
  };

  useEffect(() => {
    loadContent();
  }, []);

  return {
    contents,
    loading,
    error: isGitHubEnabled ? error : null, // Don't show error when using mock data
    loadContent,
    saveContent,
    deleteContent,
    createContent,
    isGitHubConnected: isGitHubEnabled,
  };
}