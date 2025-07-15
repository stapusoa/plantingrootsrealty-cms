import React, { useState, useEffect } from 'react';
import { Sidebar, SidebarContent, SidebarProvider } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  FileText,
  Settings,
  Loader2,
  RefreshCw,
  AlertCircle,
  Github,
  Wifi,
  WifiOff,
  Plus
} from 'lucide-react';
import type { ContentItem } from './types';
import { ContentEditor } from './ContentEditor';
import { Dashboard } from './Dashboard';
import { MediaUpload } from '@/components/MediaUpload';
import { CMSSidebar } from '@/components/CMSSidebar';
import { CMSHeader } from '@/components/CMSHeader';
import { useContent } from '../hooks/useContent';
import type { SectionType } from '@/components/CMSSidebar';

const SITE_URL = 'https://plantingrootsrealty.com';

export function CMSEditor() {
  const [activeSection, setActiveSection] = useState<SectionType>('posts');
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'preview'>('preview');
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const {
    contents,
    loading,
    error,
    loadContent,
    saveContent,
    deleteContent,
    createContent,
    uploadMediaFile,
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

  useEffect(() => {
    if ((activeSection === 'posts' || activeSection === 'pages') && currentSectionContents.length) {
      if (!selectedContent || !currentSectionContents.some(c => c.id === selectedContent.id)) {
        setSelectedContent(currentSectionContents[0]);
        setIsEditing(false);
        setViewMode('preview');
      }
    } else if (activeSection === 'media' || activeSection === 'settings') {
      setSelectedContent(null);
      setIsEditing(false);
    }
  }, [activeSection, currentSectionContents, selectedContent]);

  const handleSave = async (updatedContent: Partial<ContentItem>) => {
    if (!selectedContent) return;
    setSaving(true);
    try {
      const updated: ContentItem = {
        ...selectedContent,
        ...updatedContent,
        updatedAt: new Date().toISOString().split('T')[0],
      };
      const success = await saveContent(updated);
      if (success) {
        setSelectedContent(updated);
        setIsEditing(false);
      } else {
        console.error('Failed to save content');
      }
    } catch (e) {
      console.error('Error saving content:', e);
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!selectedContent) return;
    setPublishing(true);
    try {
      const updatedContent: ContentItem = {
        ...selectedContent,
        status: 'published',
        updatedAt: new Date().toISOString().split('T')[0],
      };
      const success = await saveContent(updatedContent);
      if (success) {
        setSelectedContent(updatedContent);
      } else {
        console.error('Failed to publish content');
      }
    } catch (e) {
      console.error('Error publishing content:', e);
    } finally {
      setPublishing(false);
    }
  };

  const handleDelete = async (id?: string) => {
    const contentToDelete = id ? contents.find(c => c.id === id) : selectedContent;
    if (!contentToDelete) return;
    try {
      const success = await deleteContent(contentToDelete);
      if (success && selectedContent?.id === contentToDelete.id) {
        const remaining = currentSectionContents.filter(c => c.id !== contentToDelete.id);
        setSelectedContent(remaining.length ? remaining[0] : null);
      }
    } catch (e) {
      console.error('Error deleting content:', e);
    }
  };

   const handleCreate = () => {
    console.log('Create button clicked');
    const type = activeSection === 'pages' ? 'page' : 'post';
    const newContent = createContent(type);
    console.log('New content created:', newContent);
    setSelectedContent(newContent);
    setIsEditing(true);
    setViewMode('preview');
  };

  const handleSelectContent = (content: ContentItem) => {
    setSelectedContent(content);
    setViewMode('preview');
    setIsEditing(false);
  };

  const handleEditContent = (content: ContentItem) => {
    setSelectedContent(content);
    setIsEditing(true);
    setViewMode('preview');
  };

  const renderMainContent = () => {
    if (loading) return (
      <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin" />
        <h2>Loading content...</h2>
        <p className="text-muted-foreground">
          {isGitHubConnected ? 'Fetching content from GitHub repository' : 'Loading sample content'}
        </p>
      </div>
    );

    if (error) return (
      <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={loadContent} variant="outline" className="mx-auto flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Retry
        </Button>
      </div>
    );

    if (activeSection === 'media') return <MediaUpload uploadMediaFile={uploadMediaFile} />;

    if (activeSection === 'settings') {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
          <Settings className="h-16 w-16 text-muted-foreground" />
          <div className="space-y-4">
            <h2>CMS Settings</h2>
            <p className="text-muted-foreground max-w-md">
              Configure your CMS settings, GitHub integration, and site preferences.
            </p>
          </div>
          <div className="space-y-4 max-w-md w-full">
            <div className="flex items-center gap-3 p-4 border rounded-lg">
              {isGitHubConnected ? (
                <>
                  <Github className="h-5 w-5 text-green-600" />
                  <Wifi className="h-5 w-5 text-green-600" />
                  <div className="flex-1 text-left">
                    <div className="font-medium">GitHub Connected</div>
                    <div className="text-sm text-muted-foreground">Repository integration active</div>
                  </div>
                </>
              ) : (
                <>
                  <Github className="h-5 w-5 text-muted-foreground" />
                  <WifiOff className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1 text-left">
                    <div className="font-medium text-muted-foreground">GitHub Not Connected</div>
                    <div className="text-sm text-muted-foreground">Running in demo mode</div>
                  </div>
                </>
              )}
            </div>
            {!isGitHubConnected && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  Add VITE_GITHUB_TOKEN to your environment variables to enable GitHub integration and persistent storage.
                </AlertDescription>
              </Alert>
            )}
            <div className="p-4 border rounded-lg">
              <div className="font-medium mb-2">Site Configuration</div>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>Site URL: {SITE_URL}</div>
                <div>Content Format: Markdown</div>
                <div>Storage: {isGitHubConnected ? 'GitHub Repository' : 'Local Demo'}</div>
              </div>
            </div>
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
          siteUrl={SITE_URL}
          uploadMediaFile={uploadMediaFile}
          isGitHubConnected={isGitHubConnected}
        />
      );
    }

    return (
      <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
        <FileText className="h-16 w-16 text-muted-foreground" />
        <div className="space-y-4">
          <h2>No content selected</h2>
          <p className="text-muted-foreground max-w-md">
            {currentSectionContents.length > 0
              ? 'Select a content item from the sidebar to view or edit it'
              : `Create your first ${activeSection.slice(0, -1)} to get started`
            }
          </p>
        </div>
        <div className="flex items-center gap-3">
          {currentSectionContents.length > 0 && (
            <Button variant="outline" onClick={() => setViewMode('list')}>
              <RefreshCw className="mr-2 h-4 w-4" />
              View All
            </Button>
          )}
          <Button onClick={handleCreate} size="lg">
            <Plus className="mr-2 h-4 w-4" />
            Create {activeSection === 'pages' ? 'Page' : 'Post'}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <SidebarProvider>
      <div className="flex w-full h-screen bg-background" key={activeSection}>
        {!isGitHubConnected && (
          <div className="fixed top-0 left-0 right-0 bg-blue-50 dark:bg-blue-950/20 border-b border-blue-200 dark:border-blue-800 px-4 py-2 text-center z-40">
            <span className="text-sm text-blue-800 dark:text-blue-200">
              🚀 Demo Mode - Content is stored locally. Add VITE_GITHUB_TOKEN environment variable to enable GitHub integration.
            </span>
          </div>
        )}

        <div className={`flex w-full ${!isGitHubConnected ? 'pt-10' : ''}`}>
          <Sidebar className="w-72 border-r flex-shrink-0">
            <SidebarContent className="p-4">
              <CMSSidebar
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                contents={contents}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedContent={selectedContent}
                loading={loading}
                isGitHubConnected={isGitHubConnected}
                onSelectContent={handleSelectContent}
                onCreateContent={handleCreate}
                onSetViewMode={setViewMode}
                onRefresh={loadContent}
                siteUrl={SITE_URL}
              />
            </SidebarContent>
          </Sidebar>

          <div className="flex-1 flex flex-col min-w-0">
            <CMSHeader
              selectedContent={selectedContent}
              viewMode={viewMode}
              isEditing={isEditing}
              publishing={publishing}
              isGitHubConnected={isGitHubConnected}
              onSetViewMode={() => setViewMode('list')}
              onToggleEdit={() => setIsEditing(!isEditing)}
              onPublish={handlePublish}
              onDelete={() => selectedContent && handleDelete(selectedContent.id)}
            />

            <main className="flex-1 p-4 overflow-auto">
              {renderMainContent()}
            </main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}