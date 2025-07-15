import { useState, useEffect } from 'react';
import { Sidebar, SidebarContent, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Image,
  Settings,
  Plus,
  Edit,
  Trash2,
  Eye,
  Menu,
  Search,
  Grid,
  List,
  Loader2,
  RefreshCw,
  AlertCircle,
  Github,
  Wifi,
  WifiOff
} from 'lucide-react';
import type { ContentItem } from './types';
import { ContentEditor } from './ContentEditor';
import { Dashboard } from './Dashboard';
import { useContent } from '../hooks/useContent';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function CMSEditor() {
  const [activeSection, setActiveSection] = useState('posts');
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'preview'>('preview');
  const [saving, setSaving] = useState(false);

  const {
    contents,
    loading,
    error,
    loadContent,
    saveContent,
    deleteContent,
    createContent,
    isGitHubConnected
  } = useContent();

  const filteredContents = contents.filter(content =>
    content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    content.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentSectionContents = filteredContents.filter(content =>
    activeSection === 'posts' ? content.type === 'post' :
      activeSection === 'pages' ? content.type === 'page' :
        false
  );

  // Auto-select first content when switching sections
  useEffect(() => {
    if ((activeSection === 'posts' || activeSection === 'pages') && currentSectionContents.length > 0) {
      if (!selectedContent || !currentSectionContents.find(c => c.id === selectedContent.id)) {
        setSelectedContent(currentSectionContents[0]);
        setIsEditing(false);
        setViewMode('preview');
      }
    } else if (activeSection === 'media' || activeSection === 'settings') {
      setSelectedContent(null);
      setIsEditing(false);
    }
  }, [activeSection, currentSectionContents]);

  const handleSave = async (updatedContent: Partial<ContentItem>) => {
    if (!selectedContent) return;

    setSaving(true);
    try {
      const updated = {
        ...selectedContent,
        ...updatedContent,
        updatedAt: new Date().toISOString().split('T')[0]
      };

      const success = await saveContent(updated);
      if (success) {
        setSelectedContent(updated);
        setIsEditing(false);
      } else {
        console.error('Failed to save content');
      }
    } catch (err) {
      console.error('Error saving content:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const contentToDelete = contents.find(c => c.id === id);
    if (!contentToDelete) return;

    try {
      const success = await deleteContent(contentToDelete);
      if (success && selectedContent?.id === id) {
        const remaining = currentSectionContents.filter(c => c.id !== id);
        setSelectedContent(remaining.length > 0 ? remaining[0] : null);
      }
    } catch (err) {
      console.error('Error deleting content:', err);
    }
  };

  const handleCreate = () => {
    const newContent = createContent(activeSection === 'pages' ? 'page' : 'post');
    setSelectedContent(newContent);
    setIsEditing(true);
    setViewMode('preview');
  };

  const handleSelectContent = (content: ContentItem) => {
    setSelectedContent(content);
    setViewMode('preview');
  };

  const handleEditContent = (content: ContentItem) => {
    setSelectedContent(content);
    setIsEditing(true);
    setViewMode('preview');
  };

  const renderMainContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <h2>Loading content...</h2>
          <p className="text-muted-foreground">
            {isGitHubConnected ? 'Fetching content from GitHub repository' : 'Loading sample content'}
          </p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center gap-4">
          <Alert className="max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
          <Button onClick={loadContent} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
      );
    }

    if (activeSection === 'media') {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center gap-4">
          <Image className="h-16 w-16 text-muted-foreground" />
          <h2>Media Management</h2>
          <p className="text-muted-foreground max-w-md">
            Upload and manage your images, videos, and other media files. This feature will be available soon.
          </p>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Upload Media
          </Button>
        </div>
      );
    }

    if (activeSection === 'settings') {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center gap-4">
          <Settings className="h-16 w-16 text-muted-foreground" />
          <h2>CMS Settings</h2>
          <p className="text-muted-foreground max-w-md">
            Configure your CMS settings, user permissions, and site preferences.
          </p>
          <div className="flex flex-col h-full gap-4 max-w-md">
            <div className="flex items-center gap-2 p-3 border rounded-lg">
              {isGitHubConnected ? (
                <>
                  <Github className="h-4 w-4 text-green-600" />
                  <Wifi className="h-4 w-4 text-green-600" />
                  <span className="text-sm">GitHub Connected</span>
                </>
              ) : (
                <>
                  <Github className="h-4 w-4 text-muted-foreground" />
                  <WifiOff className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">GitHub Not Connected</span>
                </>
              )}
            </div>
            {!isGitHubConnected && (
              <p className="text-xs text-muted-foreground">
                Add VITE_GITHUB_TOKEN to your environment variables to enable GitHub integration.
              </p>
            )}
          </div>
        </div>
      );
    }

    if (viewMode === 'list') {
      return (
        <Dashboard
          contents={currentSectionContents}
          activeSection={activeSection}
          searchTerm={searchTerm}
          onSelectContent={handleSelectContent}
          onEditContent={handleEditContent}
          onDeleteContent={handleDelete}
          onCreateContent={handleCreate}
          onSwitchToPreview={() => setViewMode('preview')}
        />
      );
    }

    if (selectedContent) {
      return (
        <ContentEditor
          content={selectedContent}
          isEditing={isEditing}
          onSave={handleSave}
          saving={saving}
        />
      );
    }

    return (
      <div className="flex flex-col items-center justify-center h-full text-center gap-4">
        <FileText className="h-16 w-16 text-muted-foreground" />
        <h2>No content selected</h2>
        <p className="text-muted-foreground max-w-md">
          {currentSectionContents.length > 0
            ? 'Select a content item from the sidebar to view or edit it'
            : `Create your first ${activeSection.slice(0, -1)} to get started`
          }
        </p>
        <div className="flex items-center gap-2">
          {currentSectionContents.length > 0 && (
            <Button variant="outline" onClick={() => setViewMode('list')}>
              <Grid className="mr-2 h-4 w-4" />
              View All
            </Button>
          )}
          <Button onClick={() => {
            handleCreate();
            setViewMode('preview');
          }}>
            <Plus className="mr-2 h-4 w-4" />
            Create New
          </Button>
        </div>
      </div>
    );
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background flex-col">
        {/* Status banner for demo mode */}
        {!isGitHubConnected && (
          <div className="bg-blue-50 dark:bg-blue-950/20 border-b border-blue-200 dark:border-blue-800 p-2 text-center text-sm">
            <span className="text-blue-800 dark:text-blue-200">
              🚀 Demo Mode - Content is stored locally. Add VITE_GITHUB_TOKEN environment variable to enable GitHub integration.
            </span>
          </div>
        )}

        <div className="flex flex-1 min-h-0">
          <Sidebar className="w-64 border-r">
            <SidebarContent className="p-4">
              <div className="flex flex-col h-full gap-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2>CMS Editor</h2>
                    <div className="flex items-center gap-2">
                      {isGitHubConnected ? (
                        <Github className="h-4 w-4 text-green-600" />
                      ) : (
                        <Github className="h-4 w-4 text-muted-foreground" />
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={loadContent}
                        disabled={loading}
                      >
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                      </Button>
                    </div>
                  </div>
                  <nav className="flex flex-col h-full gap-2">
                    <Button
                      variant={activeSection === 'posts' ? 'default' : 'ghost'}
                      className="w-full justify-start"
                      onClick={() => setActiveSection('posts')}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Posts
                      <Badge variant="secondary" className="ml-auto">
                        {contents.filter(c => c.type === 'post').length}
                      </Badge>
                    </Button>
                    <Button
                      variant={activeSection === 'pages' ? 'default' : 'ghost'}
                      className="w-full justify-start"
                      onClick={() => setActiveSection('pages')}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Pages
                      <Badge variant="secondary" className="ml-auto">
                        {contents.filter(c => c.type === 'page').length}
                      </Badge>
                    </Button>
                    <Button
                      variant={activeSection === 'media' ? 'default' : 'ghost'}
                      className="w-full justify-start"
                      onClick={() => setActiveSection('media')}
                    >
                      <Image className="mr-2 h-4 w-4" />
                      Media
                    </Button>
                    <Button
                      variant={activeSection === 'settings' ? 'default' : 'ghost'}
                      className="w-full justify-start"
                      onClick={() => setActiveSection('settings')}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Button>
                  </nav>
                </div>

                {!isGitHubConnected && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      Demo mode - Add VITE_GITHUB_TOKEN for GitHub integration
                    </AlertDescription>
                  </Alert>
                )}

                {(activeSection === 'posts' || activeSection === 'pages') && !loading && (
                  <div className="flex flex-col h-full gap-4">
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="Search content..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-9"
                        />
                      </div>
                      <Button size="sm" onClick={() => setViewMode('list')} variant="outline">
                        <Grid className="h-4 w-4" />
                      </Button>
                      <Button size="sm" onClick={() => {
                        handleCreate();
                        setViewMode('preview');
                      }}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex flex-col h-full gap-2 max-h-96">
                      {currentSectionContents.map(content => (
                        <Card
                          key={content.id}
                          className={`cursor-pointer transition-colors ${selectedContent?.id === content.id ? 'ring-2 ring-primary' : ''
                            }`}
                          onClick={() => handleSelectContent(content)}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <h4 className="truncate">{content.title}</h4>
                                <p className="text-sm text-muted-foreground truncate">{content.excerpt}</p>
                                <div className="flex items-center gap-2 mt-2">
                                  <Badge variant={content.status === 'published' ? 'default' : 'secondary'}>
                                    {content.status}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">{content.updatedAt}</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}

                      {currentSectionContents.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          {searchTerm ? 'No content matches your search.' : `No ${activeSection} found.`}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </SidebarContent>
          </Sidebar>

          <div className="flex-1 flex flex-col min-w-0">
            <header className="border-b p-4 flex items-center gap-4 flex-shrink-0">
              <SidebarTrigger className="md:hidden">
                <Menu className="h-4 w-4" />
              </SidebarTrigger>
              <h1 className="flex-1 truncate">Content Management System</h1>
              {selectedContent && (
                <div className="flex items-center gap-2">
                  {viewMode === 'preview' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setViewMode('list')}
                      >
                        <List className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(!isEditing)}
                      >
                        {isEditing ? <Eye className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                        {isEditing ? 'Preview' : 'Edit'}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(selectedContent.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              )}
            </header>

            <main className="flex-1 p-6 overflow-auto min-h-0">
              {renderMainContent()}
            </main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}