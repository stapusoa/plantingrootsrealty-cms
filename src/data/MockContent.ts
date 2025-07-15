import type { ContentItem } from '../pages/types';

export const mockContent: ContentItem[] = [
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