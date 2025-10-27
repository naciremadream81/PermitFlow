'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  File,
  UploadCloud,
  X,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const documentTypes = [
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

type UploadStatus = 'pending' | 'uploading' | 'success' | 'error';

interface UploadableFile {
  file: File;
  id: string;
  status: UploadStatus;
  progress: number;
  category: string | null;
}

export function FileUploadManager() {
  const [files, setFiles] = useState<UploadableFile[]>([]);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadableFile[] = acceptedFiles.map((file) => ({
      file,
      id: `${file.name}-${file.lastModified}`,
      status: 'pending',
      progress: 0,
      category: null,
    }));
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/vnd.dwg': ['.dwg'],
    },
  });

  const handleCategoryChange = (id: string, category: string) => {
    setFiles((prevFiles) =>
      prevFiles.map((f) => (f.id === id ? { ...f, category } : f))
    );
  };

  const removeFile = (id: string) => {
    setFiles((prevFiles) => prevFiles.filter((f) => f.id !== id));
  };

  const allFilesCategorized = files.every((f) => f.category !== null);

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const handleSubmit = () => {
    // Simulate uploading process
    setFiles(prevFiles => prevFiles.map(f => ({...f, status: 'uploading' as UploadStatus})))

    const uploadPromises = files.map(f => {
        return new Promise(resolve => {
            const interval = setInterval(() => {
                setFiles(prev => prev.map(pf => {
                    if (pf.id === f.id) {
                        const newProgress = Math.min(pf.progress + 20, 100);
                        if (newProgress === 100) {
                            clearInterval(interval);
                            resolve(pf.id);
                            return {...pf, progress: 100, status: 'success' as UploadStatus };
                        }
                        return {...pf, progress: newProgress};
                    }
                    return pf;
                }));
            }, 200);
        });
    });

    Promise.all(uploadPromises).then(() => {
        toast({
            title: "Package Submitted",
            description: "All documents have been successfully uploaded.",
        });
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Document Hub</CardTitle>
        <CardDescription>
          Upload all necessary documents for this permit package.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <UploadCloud className="h-10 w-10" />
            {isDragActive ? (
              <p>Drop the files here ...</p>
            ) : (
              <p>Drag 'n' drop some files here, or click to select files</p>
            )}
            <p className="text-xs">PDF, DOC, DOCX, DWG files supported</p>
          </div>
        </div>

        {files.length > 0 && (
          <div className="mt-6 space-y-4">
            {files.map((uploadableFile) => (
              <div key={uploadableFile.id} className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="font-medium truncate max-w-xs">{uploadableFile.file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatBytes(uploadableFile.file.size)}
                    </p>
                  </div>
                </div>

                <div className="w-full md:w-52">
                    <Select
                        value={uploadableFile.category || ''}
                        onValueChange={(value) => handleCategoryChange(uploadableFile.id, value)}
                    >
                        <SelectTrigger>
                        <SelectValue placeholder="Select Document Type" />
                        </SelectTrigger>
                        <SelectContent>
                        {documentTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                            {type}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                </div>
                
                <div className="w-full md:w-32 flex items-center gap-2">
                  {uploadableFile.status === 'pending' && <span className="text-xs text-muted-foreground">Waiting...</span>}
                  {uploadableFile.status === 'uploading' && <Progress value={uploadableFile.progress} className="w-full h-2" />}
                  {uploadableFile.status === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
                  {uploadableFile.status === 'error' && <AlertCircle className="h-5 w-5 text-destructive" />}
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => removeFile(uploadableFile.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleSubmit}
          className="w-full"
          disabled={!allFilesCategorized || files.length === 0}
        >
          {files.some(f=>f.status === 'uploading') ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ): 'Submit Package'}
        </Button>
      </CardFooter>
    </Card>
  );
}
