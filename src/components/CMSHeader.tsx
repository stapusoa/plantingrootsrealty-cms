import React from 'react';
import { Button } from './ui/button';
import { SidebarTrigger } from './ui/sidebar';
import { 
  Menu,
  List,
  Edit,
  Eye,
  Trash2,
  Send,
  Loader2
} from 'lucide-react';
import type { ContentItem } from '../pages/types';

interface CMSHeaderProps {
  selectedContent: ContentItem | null;
  viewMode: 'list' | 'preview';
  isEditing: boolean;
  publishing: boolean;
  isGitHubConnected: boolean;
  onSetViewMode: (mode: 'list') => void;
  onToggleEdit: () => void;
  onPublish: () => void;
  onDelete: () => void;
}

export function CMSHeader({
  selectedContent,
  viewMode,
  isEditing,
  publishing,
  isGitHubConnected,
  onSetViewMode,
  onToggleEdit,
  onPublish,
  onDelete
}: CMSHeaderProps) {
  return (
    <header className="border-b px-6 py-3 flex items-center gap-4 flex-shrink-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <SidebarTrigger className="md:hidden">
        <Menu className="h-4 w-4" />
      </SidebarTrigger>
      <h1 className="flex-1 font-semibold">Content Management System</h1>
      {selectedContent && (
        <div className="flex items-center gap-2">
          {viewMode === 'preview' && (
            <>
              {selectedContent.status === 'draft' && isGitHubConnected && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={onPublish}
                  disabled={publishing}
                >
                  {publishing ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="mr-2 h-4 w-4" />
                  )}
                  {publishing ? 'Publishing...' : 'Publish'}
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSetViewMode('list')}
              >
                <List className="mr-2 h-4 w-4" />
                List View
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onToggleEdit}
              >
                {isEditing ? <Eye className="mr-2 h-4 w-4" /> : <Edit className="mr-2 h-4 w-4" />}
                {isEditing ? 'Preview' : 'Edit'}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={onDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      )}
    </header>
  );
}