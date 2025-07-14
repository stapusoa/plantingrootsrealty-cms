// apps/cms/src/lib/github.ts

import { REPO_OWNER, REPO_NAME, CONTENT_PATH, BRANCH } from "@/env";

export async function fetchGitHubContentFromApi() {
  try {
    const query = new URLSearchParams({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: CONTENT_PATH,
      ref: BRANCH,
    }).toString();

    const response = await fetch(`/api/github?${query}`);

    if (!response.ok) {
      throw new Error(`GitHub API failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (err) {
    console.error("Failed to fetch GitHub content from API:", err);
    return null;
  }
}