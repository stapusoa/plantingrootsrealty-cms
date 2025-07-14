export const GITHUB_TOKEN = process.env.VITE_GITHUB_TOKEN || '';
export const REPO_OWNER = "stapusoa";
export const REPO_NAME = "plantingrootsrealty-cms";
export const CONTENT_PATH = "content/pages";
export const BRANCH = "home"; // or 'main'

// Log environment status for debugging
if (typeof console !== 'undefined') {
  const hasToken = Boolean(GITHUB_TOKEN);
  console.log(`GitHub integration: ${hasToken ? 'enabled' : 'disabled (no token)'}`);
}