import { useAuth0 } from '@auth0/auth0-react';
import { CMSEditor } from './pages/CMSEditor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, LogIn, User } from 'lucide-react';
import { authConfig } from './auth_config';

// Check if Auth0 is configured
const isAuthConfigured = (): boolean => {
  return Boolean(
    authConfig.domain && 
    authConfig.domain !== 'your-auth0-domain.auth0.com' &&
    authConfig.clientId && 
    authConfig.clientId !== 'your-client-id'
  );
};

export default function App() {
  // Check if Auth0 is configured
  const authConfigured = isAuthConfigured();
  
  // If Auth0 is not configured, render CMS without authentication
  if (!authConfigured) {
    return <CMSEditor />;
  }

  // Use Auth0 hook only when properly configured
  const { 
    isLoading, 
    isAuthenticated, 
    error, 
    loginWithRedirect, 
    logout,
    user 
  } = useAuth0();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p>Loading authentication...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-destructive">Authentication Error</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              {error.message}
            </p>
            <Button 
              onClick={() => loginWithRedirect()}
              className="w-full"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-muted">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <User className="h-6 w-6" />
              CMS Authentication
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-muted-foreground">
              Please sign in to access the Content Management System
            </p>
            <Button 
              onClick={() => loginWithRedirect()}
              className="w-full"
              size="lg"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen w-full">
      <CMSEditor />
      
      {/* User menu in top-right corner */}
      <div className="fixed top-4 right-4 z-50">
        <div className="flex items-center gap-2">
          {user && (
            <div className="text-sm text-muted-foreground">
              Welcome, {user.name || user.email}
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}