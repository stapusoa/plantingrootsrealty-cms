export const authConfig = {
  domain: process.env.VITE_AUTH0_DOMAIN || '',
  clientId: process.env.VITE_AUTH0_CLIENT_ID || '',
  audience: process.env.VITE_AUTH0_AUDIENCE || '', // optional
  appOrigin: process.env.VITE_APP_ORIGIN || '',     // optional
  apiOrigin: process.env.VITE_API_ORIGIN || '',     // optional
};