
'use client';

import { useState, useCallback, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import {
  UploadCloud,
  File as FileIcon,
  X,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type FileStatus = 'pending' | 'uploading' | 'success' | 'error';

interface UploadedFile {
  id: string;
  file: File;
  category: string | null;
  status: FileStatus;
  progress: number;
  error?: string;
}

const DOCUMENT_TYPES = [
  'Permit Application Form',
  'Site Plan / Plot Plan',
  'Architectural Drawings',
  'Structural Calculations',
  'Electrical Plan',
  'Plumbing & Gas Plan',
  'Mechanical (HVAC) Plan',
  'Energy Calculations',
  'Notice of Commencement',
  'Other',
];

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export function FileUploadManager() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const handleFiles = useCallback((newFiles: FileList | null) => {
    if (!newFiles) return;

    const filesToAdd: UploadedFile[] = Array.from(newFiles).map((file) => ({
      id: `${file.name}-${file.lastModified}`,
      file,
      category: null,
      status: 'pending',
      progress: 0,
    }));

    setFiles((prevFiles) => [...prevFiles, ...filesToAdd]);
  }, []);

  const handleCategoryChange = (fileId: string, category: string) => {
    setFiles((prevFiles) =>
      prevFiles.map((f) =>
        f.id === fileId ? { ...f, category, status: f.status === 'pending' ? 'pending' : f.status } : f
      )
    );
  };

  const handleRemoveFile = (fileId: string) => {
    setFiles((prevFiles) => prevFiles.filter((f) => f.id !== fileId));
  };

  const onDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const canSubmit = useMemo(() => {
    if (files.length === 0) return false;
    return files.every((f) => f.category !== null);
  }, [files]);

  const handleSubmit = async () => {
    setFiles(files.map(f => ({ ...f, status: 'uploading', progress: 0 })));

    for (const file of files) {
      try {
        // Simulate upload
        for (let p = 0; p <= 100; p += 10) {
          await new Promise(res => setTimeout(res, 50));
          setFiles(prev => prev.map(f => f.id === file.id ? { ...f, progress: p } : f));
        }
        setFiles(prev => prev.map(f => f.id === file.id ? { ...f, status: 'success' } : f));
      } catch (e) {
        setFiles(prev => prev.map(f => f.id === file.id ? { ...f, status: 'error', error: 'Upload failed' } : f));
      }
    }
    toast({ title: 'Package Submitted', description: `${files.length} files uploaded successfully.`});
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDragOver={onDragOver}
          onDrop={onDrop}
          className={cn(
            'border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200',
            isDragging ? 'border-primary bg-accent' : 'border-border hover:border-primary/50'
          )}
        >
          <div className="flex flex-col items-center justify-center gap-4">
            <UploadCloud className="h-12 w-12 text-muted-foreground" />
            <p className="text-lg font-medium text-foreground">
              Drag & drop files here
            </p>
            <p className="text-muted-foreground">or</p>
            <Button
              type="button"
              onClick={() => document.getElementById('file-upload-input')?.click()}
            >
              Browse Files
            </Button>
            <input
              id="file-upload-input"
              type="file"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </div>
        </div>

        {files.length > 0 && (
          <div className="mt-8 space-y-4">
            {files.map((f) => (
              <div key={f.id} className="border rounded-lg p-4 flex flex-col md:flex-row items-center gap-4">
                <FileIcon className="h-8 w-8 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{f.file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(f.file.size)}
                  </p>
                   {(f.status === 'uploading' || f.status === 'success') && (
                     <Progress value={f.progress} className="h-1.5 mt-1" />
                   )}
                   {f.status === 'pending' && !f.category && (
                     <p className="text-xs text-yellow-600 flex items-center gap-1 mt-1"><AlertCircle className="h-3 w-3" /> Waiting for category</p>
                   )}
                   {f.status === 'error' && (
                     <p className="text-xs text-destructive flex items-center gap-1 mt-1"><AlertCircle className="h-3 w-3" /> {f.error}</p>
                   )}
                   {f.status === 'success' && (
                      <p className="text-xs text-green-600 flex items-center gap-1 mt-1"><CheckCircle className="h-3 w-3" /> Complete</p>
                   )}

                </div>
                <div className="flex w-full md:w-auto items-center gap-2 shrink-0">
                  <Select
                    value={f.category ?? ''}
                    onValueChange={(value) => handleCategoryChange(f.id, value)}
                    disabled={f.status === 'uploading' || f.status === 'success'}
                  >
                    <SelectTrigger className="w-full md:w-[220px]">
                      <SelectValue placeholder="Select Document Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {DOCUMENT_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => handleRemoveFile(f.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 flex justify-end">
          <Button
            size="lg"
            onClick={handleSubmit}
            disabled={!canSubmit || files.some(f => f.status === 'uploading')}
          >
            Submit Package ({files.length} {files.length === 1 ? 'file' : 'files'})
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
