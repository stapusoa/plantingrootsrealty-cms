import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { 
  Upload, 
  Image as ImageIcon, 
  X, 
  Copy, 
  Check,
  AlertCircle,
  FileImage,
  Loader2,
  Github,
  ExternalLink
} from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { useContent } from '../hooks/useContent';

interface MediaFile {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploaded: string;
  githubUrl?: string;
  isUploaded?: boolean;
}

interface MediaUploadProps {
  onInsertImage?: (url: string, alt: string) => void;
  uploadMediaFile: (file: File) => Promise<{ success: boolean; url?: string; message?: string }>;
}

export function MediaUpload({ onInsertImage, uploadMediaFile }: MediaUploadProps) {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isGitHubConnected = true; 

  const handleFileSelect = async (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    setUploading(true);
    setUploadErrors([]);
    const newFiles: MediaFile[] = [];
    const errors: string[] = [];

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        
        if (!file.type.startsWith('image/')) {
          errors.push(`${file.name}: Only image files are supported`);
          continue;
        }

        if (file.size > 10 * 1024 * 1024) {
          errors.push(`${file.name}: File size exceeds 10MB limit`);
          continue;
        }

        const localUrl = URL.createObjectURL(file);
        
        const mediaFile: MediaFile = {
          id: Date.now().toString() + i,
          name: file.name,
          url: localUrl,
          size: file.size,
          type: file.type,
          uploaded: new Date().toISOString().split('T')[0],
          isUploaded: false,
        };

        newFiles.push(mediaFile);

        if (isGitHubConnected) {
          try {
            const uploadResult = await uploadMediaFile(file);
            if (uploadResult.success && uploadResult.url) {
              mediaFile.githubUrl = uploadResult.url;
              mediaFile.isUploaded = true;
            } else {
              errors.push(`${file.name}: ${uploadResult.message || 'Upload failed'}`);
            }
          } catch {
            errors.push(`${file.name}: Upload failed`);
          }
        }
      }

      setFiles(prev => [...newFiles, ...prev]);
      setUploadErrors(errors);
    } catch (error) {
      console.error('Error processing files:', error);
      setUploadErrors(['Failed to process files']);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleCopyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  const handleDeleteFile = (id: string) => {
    setFiles(prev => {
      const fileToDelete = prev.find(f => f.id === id);
      if (fileToDelete) {
        URL.revokeObjectURL(fileToDelete.url);
      }
      return prev.filter(f => f.id !== id);
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Images
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragOver 
                ? 'border-primary bg-primary/5' 
                : 'border-muted-foreground/25 hover:border-muted-foreground/50'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div className="space-y-4">
              <ImageIcon className={`h-12 w-12 mx-auto ${dragOver ? 'text-primary' : 'text-muted-foreground'}`} />
              <div>
                <p className="text-lg font-medium">
                  {dragOver ? 'Drop images here' : 'Drag & drop images here'}
                </p>
                <p className="text-sm text-muted-foreground">
                  or click to browse files
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="mr-2 h-4 w-4" />
                )}
                Choose Files
              </Button>
              <div className="text-xs text-muted-foreground">
                Supports: JPG, PNG, GIF, WebP (Max 10MB each)
              </div>
            </div>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files)}
          />
        </CardContent>
      </Card>

      {/* Upload Status Alert */}
      {isGitHubConnected ? (
        <Alert>
          <Github className="h-4 w-4" />
          <AlertDescription>
            <strong>GitHub Integration Active:</strong> Images are uploaded to{' '}
            <code className="text-xs bg-muted px-1 rounded">stapusoa/plantingrootsrealty-cms</code> repository 
            in the <code className="text-xs bg-muted px-1 rounded">assets/images/</code> folder on the{' '}
            <code className="text-xs bg-muted px-1 rounded">home</code> branch.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Demo Mode:</strong> Images are stored locally in browser memory and will be lost on refresh. 
            Add <code className="text-xs bg-muted px-1 rounded">VITE_GITHUB_TOKEN</code> to enable GitHub storage.
          </AlertDescription>
        </Alert>
      )}

      {/* Upload Errors */}
      {uploadErrors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              <div className="font-medium">Upload Errors:</div>
              {uploadErrors.map((error, index) => (
                <div key={index} className="text-sm">{error}</div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Uploaded Files */}
      {files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileImage className="h-5 w-5" />
              Uploaded Files ({files.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {files.map((file) => (
                <div key={file.id} className="border rounded-lg overflow-hidden">
                  <div className="aspect-video bg-muted relative">
                    <img
                      src={file.url}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 h-6 w-6 p-0"
                      onClick={() => handleDeleteFile(file.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="p-3 space-y-2">
                    <div>
                      <div className="font-medium text-sm truncate" title={file.name}>
                        {file.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)} • {file.uploaded}
                      </div>
                      {file.isUploaded && (
                        <div className="flex items-center gap-1 mt-1">
                          <Github className="h-3 w-3 text-green-600" />
                          <span className="text-xs text-green-600">Uploaded to GitHub</span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 h-8 text-xs"
                        onClick={() => handleCopyUrl(file.githubUrl || file.url)}
                      >
                        {copiedUrl === (file.githubUrl || file.url) ? (
                          <Check className="mr-1 h-3 w-3" />
                        ) : (
                          <Copy className="mr-1 h-3 w-3" />
                        )}
                        {copiedUrl === (file.githubUrl || file.url) ? 'Copied!' : 'Copy URL'}
                      </Button>
                      {file.githubUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 px-2"
                          onClick={() => window.open(file.githubUrl, '_blank')}
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      )}
                      {onInsertImage && (
                        <Button
                          variant="default"
                          size="sm"
                          className="h-8 text-xs"
                          onClick={() => onInsertImage(file.githubUrl || file.url, file.name)}
                        >
                          Insert
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {files.length === 0 && !uploading && (
        <div className="text-center py-8 text-muted-foreground">
          <ImageIcon className="h-12 w-12 mx-auto mb-4" />
          <p>No images uploaded yet</p>
          <p className="text-sm">Upload some images to get started</p>
        </div>
      )}
    </div>
  );
}