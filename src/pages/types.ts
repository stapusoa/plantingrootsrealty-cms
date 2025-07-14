export interface ContentItem {
  id: string;
  title: string;
  type: 'post' | 'page';
  status: 'draft' | 'published';
  content: string;
  excerpt: string;
  createdAt: string;
  updatedAt: string;
  filename?: string;
  sha?: string;
}

export interface GitHubFile {
  name: string;
  path: string;
  sha: string;
  content: string;
  download_url: string;
}

export interface AuthConfig {
  domain: string;
  clientId: string;
  audience?: string;
}

export interface EnvConfig {
  GITHUB_TOKEN: string;
  REPO_OWNER: string;
  REPO_NAME: string;
  CONTENT_PATH: string;
  BRANCH: string;
}

// Gray-matter types
export interface GrayMatterFile {
  data: Record<string, any>;
  content: string;
}

export interface GrayMatter {
  (content: string): GrayMatterFile;
  stringify(content: string, data: Record<string, any>): string;
}