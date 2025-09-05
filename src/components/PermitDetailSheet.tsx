'use client';

import * as React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import type { PermitPackage, PDFTemplate } from '@/lib/types';
import {
  FileText,
  User,
  HardHat,
  MapPin,
  Calendar,
  Paperclip,
  Upload,
  Loader2,
  Download,
  X,
} from 'lucide-react';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { automatePdfPopulation, type AutomatePdfPopulationInput } from '@/ai/flows/automate-pdf-population';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { pdfTemplates } from '@/lib/data';

interface PermitDetailSheetProps {
  permit: PermitPackage | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdatePackage: (updatedPackage: PermitPackage) => void;
}

const statusColors: { [key: string]: string } = {
  Draft: 'bg-gray-200 text-gray-800',
  'In Progress': 'bg-blue-200 text-blue-800',
  Submitted: 'bg-yellow-200 text-yellow-800',
  Approved: 'bg-green-200 text-green-800',
  Rejected: 'bg-red-200 text-red-800',
};

export function PermitDetailSheet({ permit, open, onOpenChange, onUpdatePackage }: PermitDetailSheetProps) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [generatedPdf, setGeneratedPdf] = React.useState<string | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = React.useState<string | undefined>();
  const [attachments, setAttachments] = React.useState<File[]>(permit?.attachments || []);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (permit) {
      setAttachments(permit.attachments);
    }
  }, [permit]);


  if (!permit) return null;

  const handleChecklistChange = (itemId: string, checked: boolean) => {
    const updatedChecklist = permit.checklist.map((item) =>
      item.id === itemId ? { ...item, completed: checked } : item
    );
    onUpdatePackage({ ...permit, checklist: updatedChecklist });
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      const updatedAttachments = [...attachments, ...newFiles];
      setAttachments(updatedAttachments);
      onUpdatePackage({ ...permit, attachments: updatedAttachments });
    }
  };
  
  const removeAttachment = (fileToRemove: File) => {
    const updatedAttachments = attachments.filter(file => file !== fileToRemove);
    setAttachments(updatedAttachments);
    onUpdatePackage({ ...permit, attachments: updatedAttachments });
  };


  const handleGeneratePdf = async () => {
    if (!permit || !selectedTemplateId) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please select a template.' });
      return;
    }
    const template = pdfTemplates.find((t) => t.id === selectedTemplateId);
    if (!template) {
      toast({ variant: 'destructive', title: 'Error', description: 'Template not found.' });
      return;
    }

    setIsGenerating(true);
    setGeneratedPdf(null);

    try {
      const input: AutomatePdfPopulationInput = {
        customerData: permit.customer,
        contractorData: permit.contractor,
        propertyData: permit.property,
        permitData: { permitNumber: permit.id, county: permit.county, status: permit.status },
        pdfTemplateDataUri: template.dataUri,
      };

      const result = await automatePdfPopulation(input);

      if (result.populatedPdfDataUri) {
        setGeneratedPdf(result.populatedPdfDataUri);
        toast({ title: 'Success', description: 'PDF has been generated successfully.' });
      } else {
        throw new Error('Generation failed, no PDF data returned.');
      }
    } catch (error) {
      console.error('PDF Generation Error:', error);
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: 'Could not generate the PDF. Please try again.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const DetailItem = ({ icon, label, children }: { icon: React.ElementType; label: string; children: React.ReactNode }) => (
    <div className="flex items-start gap-3">
      <div className="text-muted-foreground mt-1">
        {React.createElement(icon, { className: 'h-5 w-5' })}
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="text-base font-semibold">{children}</p>
      </div>
    </div>
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl lg:max-w-3xl flex flex-col">
        <SheetHeader>
          <SheetTitle className="text-2xl">{permit.packageName}</SheetTitle>
          <SheetDescription className="flex items-center gap-2">
            ID: {permit.id}
            <Badge className={statusColors[permit.status]}>{permit.status}</Badge>
          </SheetDescription>
        </SheetHeader>
        <Separator className="my-4" />

        <div className="flex-1 overflow-y-auto pr-6 -mr-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DetailItem icon={User} label="Customer">{permit.customer.name}</DetailItem>
            <DetailItem icon={HardHat} label="Contractor">{permit.contractor.name}</DetailItem>
            <DetailItem icon={MapPin} label="Property">{permit.property.address}, {permit.county}</DetailItem>
            <DetailItem icon={Calendar} label="Created At">{new Date(permit.createdAt).toLocaleDateString()}</DetailItem>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-lg font-semibold mb-3">County Checklist</h3>
            <div className="space-y-3">
              {permit.checklist.map((item) => (
                <div key={item.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={item.id}
                    checked={item.completed}
                    onCheckedChange={(checked) => handleChecklistChange(item.id, !!checked)}
                  />
                  <Label htmlFor={item.id} className={`flex-1 ${item.completed ? 'line-through text-muted-foreground' : ''}`}>{item.text}</Label>
                </div>
              ))}
            </div>
          </div>
          
          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-3">Attachments</h3>
            <div className="space-y-2">
               {attachments.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded-md border bg-secondary/50">
                    <div className="flex items-center gap-2">
                        <Paperclip className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{file.name}</span>
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeAttachment(file)}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-3" onClick={() => fileInputRef.current?.click()}>
              <Upload className="mr-2 h-4 w-4" />
              Upload Document
            </Button>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" multiple />
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-3">Generate Documents</h3>
            <div className="space-y-4">
              <Select onValueChange={setSelectedTemplateId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a PDF template" />
                </SelectTrigger>
                <SelectContent>
                  {pdfTemplates.map(template => (
                    <SelectItem key={template.id} value={template.id}>{template.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleGeneratePdf} disabled={isGenerating || !selectedTemplateId} className="w-full">
                {isGenerating ? (<Loader2 className="mr-2 h-4 w-4 animate-spin" />) : (<FileText className="mr-2 h-4 w-4" />)}
                {isGenerating ? 'Generating...' : 'Generate PDF'}
              </Button>
              {generatedPdf && (
                <a href={generatedPdf} download={`${permit.customer.name.replace(/\s+/g, '_')}_permit.pdf`} className="block">
                  <Button variant="outline" className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download Generated PDF
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>

        <SheetFooter className="mt-6">
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
