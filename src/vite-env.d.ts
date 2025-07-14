/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GITHUB_TOKEN: string;
  readonly VITE_AUTH0_DOMAIN?: string;
  readonly VITE_AUTH0_CLIENT_ID?: string;
  // add other env variables you use here as readonly properties
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}