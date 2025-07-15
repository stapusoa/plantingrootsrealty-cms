import React from 'react';
import { Button } from './ui/button';
import { User } from '@auth0/auth0-react';

interface UserMenuProps {
  user: User | undefined;
  onLogout: () => void;
}

export function UserMenu({ user, onLogout }: UserMenuProps) {
  return (
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
          onClick={onLogout}
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
}