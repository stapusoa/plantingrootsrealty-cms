import { Octokit } from "@octokit/rest";
import { GITHUB_TOKEN } from "../src/env";

// Initialize Octokit with authentication if token is available
export const octokit = new Octokit({
  auth: GITHUB_TOKEN || undefined,
});

// Add warning if no token is provided
if (!GITHUB_TOKEN) {
  console.warn('GitHub token not provided. Create a VITE_GITHUB_TOKEN environment variable for GitHub integration.');
}

// Export GitHub connection status
export const isGitHubEnabled = Boolean(GITHUB_TOKEN);

// Optional: function to fetch GitHub content from your API route
export async function fetchGitHubContent() {
  try {
    const res = await fetch('/api/github');
    if (!res.ok) {
      throw new Error(`GitHub API error: ${res.statusText}`);
    }
    const data = await res.json();
    console.log('GitHub content:', data);
    return data;
  } catch (error) {
    console.error('Failed to fetch GitHub content:', error);
    return null;
  }
}