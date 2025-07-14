import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, Loader2 } from 'lucide-react';
import type { ContentItem } from './types';

interface ContentEditorProps {
  content: ContentItem;
  isEditing: boolean;
  saving?: boolean;
  onSave: (updatedContent: Partial<ContentItem>) => void;
}

export function ContentEditor({ content, isEditing, saving = false, onSave }: ContentEditorProps) {
  const [title, setTitle] = useState(content.title);
  const [contentText, setContentText] = useState(content.content);
  const [excerpt, setExcerpt] = useState(content.excerpt);
  const [status, setStatus] = useState(content.status);
  const [type, setType] = useState(content.type);

  const handleSave = () => {
    onSave({
      title,
      content: contentText,
      excerpt,
      status,
      type
    });
  };

  if (isEditing) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h2>Edit Content</h2>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-4">
            <div>
              <label className="block mb-2">Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter title..."
                disabled={saving}
              />
            </div>

            <div>
              <label className="block mb-2">Content</label>
              <Textarea
                value={contentText}
                onChange={(e) => setContentText(e.target.value)}
                placeholder="Write your content here..."
                className="min-h-[500px] resize-none"
                disabled={saving}
              />
            </div>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Publishing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block mb-2">Status</label>
                  <Select 
                    value={status} 
                    onValueChange={(value: 'published' | 'draft') => setStatus(value)}
                    disabled={saving}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block mb-2">Type</label>
                  <Select 
                    value={type} 
                    onValueChange={(value: 'post' | 'page') => setType(value)}
                    disabled={saving}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="post">Post</SelectItem>
                      <SelectItem value="page">Page</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block mb-2">Excerpt</label>
                  <Textarea
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Brief description..."
                    rows={3}
                    disabled={saving}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Metadata</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <div>Created: {content.createdAt}</div>
                <div>Updated: {content.updatedAt}</div>
                <div>ID: {content.id}</div>
                {content.filename && <div>File: {content.filename}</div>}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <article className="prose prose-gray max-w-none">
        <header className="mb-8 pb-6 border-b">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant={content.status === 'published' ? 'default' : 'secondary'}>
              {content.status}
            </Badge>
            <Badge variant="outline">{content.type}</Badge>
          </div>
          <h1 className="mb-4">{content.title}</h1>
          {content.excerpt && (
            <p className="text-muted-foreground italic text-lg">{content.excerpt}</p>
          )}
          <div className="text-sm text-muted-foreground mt-4">
            Last updated: {content.updatedAt}
          </div>
        </header>
        
        <div className="whitespace-pre-wrap leading-relaxed">
          {content.content}
        </div>
      </article>
    </div>
  );
}