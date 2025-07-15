import { Octokit } from "@octokit/rest";

export const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

if (!process.env.GITHUB_TOKEN) {
  console.warn("GitHub token not found in environment variables.");
}

export const isGitHubEnabled = Boolean(process.env.GITHUB_TOKEN);
export const CONTENT_PATH = process.env.CONTENT_PATH || "content";