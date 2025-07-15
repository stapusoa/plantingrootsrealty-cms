import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Plus, Edit, Trash2, Eye } from 'lucide-react';
import type { ContentItem } from './types';

interface DashboardProps {
  contents: ContentItem[];
  activeSection: string;
  searchTerm: string;
  onSelectContent: (content: ContentItem) => void;
  onEditContent: (content: ContentItem) => void;
  onDeleteContent: (id: string) => void;
  onCreateContent: () => void;
  onSwitchToPreview: () => void;
}

export function Dashboard({
  contents,
  activeSection,
  searchTerm,
  onSelectContent,
  onEditContent,
  onDeleteContent,
  onCreateContent,
  onSwitchToPreview
}: DashboardProps) {
  if (contents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FileText className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="mb-2">No {activeSection} found</h3>
        <p className="text-muted-foreground mb-4">
          {searchTerm ? 'No content matches your search.' : `Create your first ${activeSection.slice(0, -1)} to get started.`}
        </p>
        {!searchTerm && (
          <Button onClick={onCreateContent}>
            <Plus className="mr-2 h-4 w-4" />
            Create {activeSection.slice(0, -1)}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2>{activeSection === 'posts' ? 'All Posts' : 'All Pages'}</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onSwitchToPreview}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button size="sm" onClick={onCreateContent}>
            <Plus className="mr-2 h-4 w-4" />
            Create New
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contents.map(content => (
          <Card 
            key={content.id} 
            className="cursor-pointer transition-all hover:shadow-md"
            onClick={() => onSelectContent(content)}
          >
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="line-clamp-2">{content.title}</h3>
                  <Badge variant={content.status === 'published' ? 'default' : 'secondary'}>
                    {content.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-3">{content.excerpt}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{content.updatedAt}</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditContent(content);
                      }}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteContent(content.id);
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}