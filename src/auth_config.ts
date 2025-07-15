export const authConfig = {
  domain: import.meta.env.VITE_AUTH0_DOMAIN,
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
  audience: import.meta.env.VITE_AUTH0_AUDIENCE,
  appOrigin: import.meta.env.VITE_APP_ORIGIN,
  apiOrigin: import.meta.env.VITE_API_ORIGIN,
};