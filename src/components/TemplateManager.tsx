'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, PlusCircle, Upload } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { pdfTemplates as initialTemplates } from '@/lib/data';
import type { PDFTemplate } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export function TemplateManager() {
  const [templates, setTemplates] = useState<PDFTemplate[]>(initialTemplates);
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateFile, setNewTemplateFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleAddTemplate = () => {
    if (!newTemplateName || !newTemplateFile) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Please provide a name and select a file.",
        });
        return;
    }

    // In a real app, we would read the file and convert to data URI
    // For this demo, we'll use a placeholder
    const newTemplate: PDFTemplate = {
        id: `tpl_${Date.now()}`,
        name: newTemplateName,
        description: `Uploaded on ${new Date().toLocaleDateString()}`,
        dataUri: 'data:application/pdf;base64,JVBERi0xLjcK...'
    };
    
    setTemplates([newTemplate, ...templates]);
    setAddDialogOpen(false);
    setNewTemplateName('');
    setNewTemplateFile(null);
    toast({
        title: "Success",
        description: "New template added.",
    });
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Template Library</h2>
          <p className="text-muted-foreground">Browse and manage your PDF templates.</p>
        </div>
        <Button onClick={() => setAddDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Template
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <Card key={template.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-lg">{template.name}</CardTitle>
              <CardDescription className="mt-1">{template.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New PDF Template</DialogTitle>
            <DialogDescription>
              Upload a new PDF form template to be used for document generation.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="template-name">Template Name</Label>
              <Input
                id="template-name"
                value={newTemplateName}
                onChange={(e) => setNewTemplateName(e.target.value)}
                placeholder="e.g., Standard Permit Application"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="template-file">PDF File</Label>
              <Input 
                id="template-file" 
                type="file" 
                accept=".pdf"
                onChange={(e) => setNewTemplateFile(e.target.files ? e.target.files[0] : null)}
              />
               {newTemplateFile && <p className="text-sm text-muted-foreground">Selected: {newTemplateFile.name}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTemplate}><Upload className="mr-2 h-4 w-4" /> Add Template</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
