import React from 'react';
import { Loader2 } from 'lucide-react';

export function AuthLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
        <p>Loading authentication...</p>
      </div>
    </div>
  );
}