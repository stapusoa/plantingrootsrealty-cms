import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { 
  FileText, 
  Image, 
  Settings, 
  Plus, 
  Search,
  Grid,
  Github,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import type { ContentItem } from '../pages/types';

export type SectionType = 'media' | 'posts' | 'pages' | 'settings';

interface CMSSidebarProps {
  activeSection: SectionType;
  setActiveSection: React.Dispatch<React.SetStateAction<SectionType>>;
  contents: ContentItem[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedContent: ContentItem | null;
  loading: boolean;
  isGitHubConnected: boolean;
  onSelectContent: (content: ContentItem) => void;
  onCreateContent: () => void;
  onSetViewMode: (mode: 'list') => void;
  onRefresh: () => void;
  siteUrl: string;
}

export function CMSSidebar({
  activeSection,
  setActiveSection,
  contents,
  searchTerm,
  setSearchTerm,
  selectedContent,
  loading,
  isGitHubConnected,
  onSelectContent,
  onCreateContent,
  onSetViewMode,
  onRefresh,
  siteUrl
}: CMSSidebarProps) {
  const filteredContents = contents.filter(content => 
    content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    content.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentSectionContents = filteredContents.filter(content => 
    activeSection === 'posts' ? content.type === 'post' : 
    activeSection === 'pages' ? content.type === 'page' : 
    false
  );

  const getPageUrl = (content: ContentItem) => {
    if (content.type === 'page') {
      const slug = content.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      return `${siteUrl}/${slug}`;
    }
    return `${siteUrl}/posts/${content.id}`;
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">CMS Editor</h2>
          <div className="flex items-center gap-2">
            {isGitHubConnected ? (
              <Github className="h-4 w-4 text-green-600" />
            ) : (
              <Github className="h-4 w-4 text-muted-foreground" />
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
        <nav className="flex flex-col gap-2 h-full">
          <Button
            variant={activeSection === 'posts' ? 'default' : 'ghost'}
            className="w-full justify-start h-10"
            onClick={() => setActiveSection('posts')}
          >
            <FileText className="mr-2 h-4 w-4" />
            Posts
            <Badge variant="secondary" className="ml-auto text-xs">
              {contents.filter(c => c.type === 'post').length}
            </Badge>
          </Button>
          <Button
            variant={activeSection === 'pages' ? 'default' : 'ghost'}
            className="w-full justify-start h-10"
            onClick={() => setActiveSection('pages')}
          >
            <FileText className="mr-2 h-4 w-4" />
            Pages
            <Badge variant="secondary" className="ml-auto text-xs">
              {contents.filter(c => c.type === 'page').length}
            </Badge>
          </Button>
          <Button
            variant={activeSection === 'media' ? 'default' : 'ghost'}
            className="w-full justify-start h-10"
            onClick={() => setActiveSection('media')}
          >
            <Image className="mr-2 h-4 w-4" />
            Media
          </Button>
          <Button
            variant={activeSection === 'settings' ? 'default' : 'ghost'}
            className="w-full justify-start h-10"
            onClick={() => setActiveSection('settings')}
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </nav>
      </div>

      {(activeSection === 'posts' || activeSection === 'pages') && !loading && (
        <div className="flex flex-col gap-4 h-full">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
            <Button size="sm" onClick={() => onSetViewMode('list')} variant="outline">
              <Grid className="h-4 w-4" />
            </Button>
            <Button size="sm" onClick={onCreateContent}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-col gap-2 h-full overflow-y-auto">
            {currentSectionContents.map(content => (
              <Card 
                key={content.id} 
                className={`cursor-pointer transition-all hover:shadow-sm ${
                  selectedContent?.id === content.id ? 'ring-2 ring-primary shadow-sm' : ''
                }`}
                onClick={() => onSelectContent(content)}
              >
                <CardContent className="p-3">
                  <div className="space-y-2">
                    <div>
                      <h4 className="font-medium leading-snug text-sm">{content.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{content.excerpt}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant={content.status === 'published' ? 'default' : 'secondary'} className="text-xs h-5">
                          {content.status}
                        </Badge>
                        {content.type === 'page' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-5 w-5 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(getPageUrl(content), '_blank');
                            }}
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">{content.updatedAt}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {currentSectionContents.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <div className="text-sm">
                  {searchTerm ? 'No content matches your search.' : `No ${activeSection} found.`}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}