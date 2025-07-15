import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Save,
  Loader2,
  ExternalLink,
  Upload,
} from "lucide-react";
import type { ContentItem } from "./types";

interface ContentEditorProps {
  content: ContentItem;
  isEditing: boolean;
  saving?: boolean;
  siteUrl?: string;
  uploadMediaFile?: (
    file: File,
  ) => Promise<{
    success: boolean;
    url?: string;
    message?: string;
  }>;
  isGitHubConnected?: boolean;
  onSave: (updatedContent: Partial<ContentItem>) => void;
}

// Simple markdown renderer for preview
const renderMarkdown = (markdown: string): string => {
  return (
    markdown
      // Headers
      .replace(/^### (.*$)/gim, "<h3>$1</h3>")
      .replace(/^## (.*$)/gim, "<h2>$1</h2>")
      .replace(/^# (.*$)/gim, "<h1>$1</h1>")
      // Bold
      .replace(/\*\*(.*)\*\*/gim, "<strong>$1</strong>")
      // Italic
      .replace(/\*(.*)\*/gim, "<em>$1</em>")
      // Links
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/gim,
        '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">$1</a>',
      )
      // Line breaks
      .replace(/\n\n/gim, "</p><p>")
      // Lists
      .replace(/^\- (.*$)/gim, "<li>$1</li>")
      .replace(/(<li>.*<\/li>)/s, "<ul>$1</ul>")
      // Code blocks
      .replace(
        /```([^`]+)```/gim,
        '<pre class="bg-gray-100 p-4 rounded"><code>$1</code></pre>',
      )
      // Inline code
      .replace(
        /`([^`]+)`/gim,
        '<code class="bg-gray-100 px-1 rounded">$1</code>',
      )
      // Wrap in paragraphs
      .replace(/^(?!<[h|u|p|l])/gim, "<p>")
      .replace(/(?<![>])$/gim, "</p>")
  );
};

export function ContentEditor({
  content,
  isEditing,
  saving = false,
  siteUrl,
  uploadMediaFile,
  isGitHubConnected,
  onSave,
}: ContentEditorProps) {
  const [title, setTitle] = useState(content.title);
  const [contentText, setContentText] = useState(
    content.content,
  );
  const [excerpt, setExcerpt] = useState(content.excerpt);
  const [status, setStatus] = useState(content.status);
  const [type, setType] = useState(content.type);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleSave = () => {
    onSave({
      title,
      content: contentText,
      excerpt,
      status,
      type,
    });
  };

  const handleImageUpload = async (file: File) => {
    if (!uploadMediaFile) return;

    setUploadingImage(true);
    try {
      const result = await uploadMediaFile(file);
      if (result.success && result.url) {
        // Insert markdown image syntax at current cursor position
        const imageMarkdown = `\n![${file.name}](${result.url})\n`;
        setContentText((prev) => prev + imageMarkdown);
      }
    } catch (error) {
      console.error("Failed to upload image:", error);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      handleImageUpload(file);
    }
  };

  const getPageUrl = () => {
    if (!siteUrl) return "";
    if (type === "page") {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      return `${siteUrl}/${slug}`;
    }
    return `${siteUrl}/posts/${content.id}`;
  };

  if (isEditing) {
    return (
      <div className="w-full max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">
            Edit Content
          </h2>
          <Button
            onClick={handleSave}
            disabled={saving}
            size="lg"
          >
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-4">
            <div>
              <label className="block mb-3 font-medium">
                Title
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter title..."
                disabled={saving}
                className="text-lg h-12"
              />
            </div>

            <div>
              <label className="block mb-3 font-medium">
                Content
              </label>
              <Textarea
                value={contentText}
                onChange={(e) => setContentText(e.target.value)}
                placeholder="Write your content here using Markdown formatting..."
                className="min-h-[600px] resize-none font-mono"
                disabled={saving}
              />
              <div className="mt-2 text-sm text-muted-foreground space-y-1">
                <div>
                  <strong>Markdown Formatting:</strong>
                </div>
                <div>
                  • <code>**bold**</code> and{" "}
                  <code>*italic*</code>
                </div>
                <div>
                  • <code># Header</code> and{" "}
                  <code>## Subheader</code>
                </div>
                <div>
                  • <code>[link text](url)</code>
                </div>
                <div>
                  • <code>- List item</code>
                </div>
                <div>
                  • <code>`inline code`</code>
                </div>
                <div>
                  • Images: <code>![alt text](image-url)</code>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Publishing
                  {status === "published" && (
                    <Badge
                      variant="default"
                      className="text-xs"
                    >
                      Live
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block mb-3 font-medium">
                    Status
                  </label>
                  <Select
                    value={status}
                    onValueChange={(
                      value: "published" | "draft",
                    ) => setStatus(value)}
                    disabled={saving}
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">
                        Draft
                      </SelectItem>
                      <SelectItem value="published">
                        Published
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block mb-3 font-medium">
                    Type
                  </label>
                  <Select
                    value={type}
                    onValueChange={(value: "post" | "page") =>
                      setType(value)
                    }
                    disabled={saving}
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="post">
                        Blog Post
                      </SelectItem>
                      <SelectItem value="page">
                        Static Page
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block mb-3 font-medium">
                    Excerpt
                  </label>
                  <Textarea
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Brief description for previews..."
                    rows={4}
                    disabled={saving}
                  />
                </div>

                {type === "page" && siteUrl && (
                  <div>
                    <label className="block mb-3 font-medium">
                      Page URL
                    </label>
                    <div className="p-3 bg-muted rounded border text-sm">
                      {getPageUrl()}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 w-full"
                      onClick={() =>
                        window.open(getPageUrl(), "_blank")
                      }
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Preview Page
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Media</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage || !uploadMediaFile}
                >
                  {uploadingImage ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="mr-2 h-4 w-4" />
                  )}
                  {uploadingImage
                    ? "Uploading..."
                    : "Add Image"}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <div className="text-xs text-muted-foreground space-y-1">
                  {isGitHubConnected ? (
                    <>
                      <div>
                        • Images uploaded to GitHub repository
                      </div>
                      <div>
                        • Automatically inserted as Markdown
                      </div>
                      <div>• Supports JPG, PNG, GIF, WebP</div>
                    </>
                  ) : (
                    <div>
                      Enable GitHub integration to upload images
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Metadata</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Created:</span>
                  <span>{content.createdAt}</span>
                </div>
                <div className="flex justify-between">
                  <span>Updated:</span>
                  <span>{content.updatedAt}</span>
                </div>
                <div className="flex justify-between">
                  <span>ID:</span>
                  <span className="font-mono text-xs">
                    {content.id}
                  </span>
                </div>
                {content.filename && (
                  <div className="flex justify-between">
                    <span>File:</span>
                    <span className="font-mono text-xs">
                      {content.filename}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      <article className="space-y-8">
        <header className="pb-8 border-b space-y-4">
          <div className="flex items-center gap-3">
            <Badge
              variant={
                content.status === "published"
                  ? "default"
                  : "secondary"
              }
              className="text-sm"
            >
              {content.status}
            </Badge>
            <Badge variant="outline" className="text-sm">
              {content.type}
            </Badge>
            {content.type === "page" && siteUrl && (
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  window.open(getPageUrl(), "_blank")
                }
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                View Live
              </Button>
            )}
          </div>
          <h1 className="text-4xl font-bold leading-tight">
            {content.title}
          </h1>
          {content.excerpt && (
            <p className="text-xl text-muted-foreground leading-relaxed">
              {content.excerpt}
            </p>
          )}
          <div className="text-sm text-muted-foreground">
            Last updated: {content.updatedAt}
          </div>
        </header>

        <div
          className="prose prose-lg max-w-none leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: renderMarkdown(content.content),
          }}
        />
      </article>
    </div>
  );
}