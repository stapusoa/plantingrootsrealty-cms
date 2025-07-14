import { GITHUB_TOKEN } from './env';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';
import { authConfig } from './auth_config';
import './styles/globals.css';

// Safe check for Auth0 configuration
const hasValidAuth0Config = (): boolean => {
  try {
    return Boolean(
      authConfig.domain && 
      authConfig.domain !== 'your-auth0-domain.auth0.com' &&
      authConfig.clientId && 
      authConfig.clientId !== 'your-client-id'
    );
  } catch (error) {
    console.warn('Error checking Auth0 configuration:', error);
    return false;
  }
};

// Demo mode component for when Auth0 is not configured
function DemoApp() {
  return (
    <div className="h-screen w-full">
      <div className="bg-yellow-50 border-b border-yellow-200 p-2 text-center text-sm">
        <span className="text-yellow-800">
          Demo Mode - Add Auth0 environment variables (VITE_AUTH0_DOMAIN, VITE_AUTH0_CLIENT_ID) for full authentication
        </span>
      </div>
      <div className="h-[calc(100vh-2.5rem)]">
        <App />
      </div>
    </div>
  );
}

// Safe Auth0Provider wrapper
function AuthenticatedApp() {
  try {
    return (
      <Auth0Provider
        domain={authConfig.domain}
        clientId={authConfig.clientId}
        authorizationParams={{
          redirect_uri: typeof window !== 'undefined' ? window.location.origin : '',
          audience: authConfig.audience,
        }}
      >
        <App />
      </Auth0Provider>
    );
  } catch (error) {
    console.error('Error initializing Auth0Provider:', error);
    return <DemoApp />;
  }
}

// Get the root element safely
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

console.log('Auth config:', authConfig);
console.log('GitHub token:', GITHUB_TOKEN ? '✅ exists' : '❌ missing');

// Render the appropriate app based on configuration
ReactDOM.createRoot(rootElement).render(
  hasValidAuth0Config() ? <AuthenticatedApp /> : <DemoApp />
);