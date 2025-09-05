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
import type { PermitPackage, PDFTemplate, Contractor } from '@/lib/types';
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
  Building,
  Wrench,
  DollarSign,
  DownloadCloud,
  Copy,
  Users,
  PlusCircle,
  Trash2,
} from 'lucide-react';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { automatePdfPopulation, type AutomatePdfPopulationInput } from '@/ai/flows/automate-pdf-population';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { pdfTemplates, contractors as allContractors } from '@/lib/data';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { cn } from '@/lib/utils';
import useLocalStorage from '@/hooks/use-local-storage';

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

const ManageSubcontractorsDialog = ({
  permit,
  onUpdatePackage,
  open,
  onOpenChange
}: { permit: PermitPackage, onUpdatePackage: (pkg: PermitPackage) => void, open: boolean, onOpenChange: (open: boolean) => void }) => {
  const [contractors] = useLocalStorage<Contractor[]>('contractors', allContractors);
  const [selectedSub, setSelectedSub] = React.useState('');

  const currentSubs = permit.subcontractors || [];
  const availableContractors = contractors.filter(c => 
    c.id !== permit.contractor.id && !currentSubs.some(sub => sub.id === c.id)
  );

  const handleAdd = () => {
    const contractorToAdd = contractors.find(c => c.id === selectedSub);
    if(contractorToAdd) {
      const updatedSubs = [...currentSubs, contractorToAdd];
      onUpdatePackage({ ...permit, subcontractors: updatedSubs });
      setSelectedSub('');
    }
  }

  const handleRemove = (subId: string) => {
    const updatedSubs = currentSubs.filter(sub => sub.id !== subId);
    onUpdatePackage({ ...permit, subcontractors: updatedSubs });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Subcontractors for {permit.packageName}</DialogTitle>
          <DialogDescription>Add or remove subcontractors from this permit package.</DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">Current Subcontractors</h4>
            <div className="space-y-2">
              {currentSubs.length > 0 ? currentSubs.map(sub => (
                <div key={sub.id} className="flex items-center justify-between p-2 rounded-md border bg-secondary/50">
                  <div>
                    <p className="font-medium">{sub.name}</p>
                    <p className="text-xs text-muted-foreground">{sub.trade}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleRemove(sub.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )) : <p className="text-sm text-muted-foreground">No subcontractors assigned.</p>}
            </div>
          </div>
          <Separator />
          <div className="space-y-2">
            <h4 className="font-medium">Add a Subcontractor</h4>
            <div className="flex gap-2">
              <Select onValueChange={setSelectedSub} value={selectedSub}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a contractor" />
                </SelectTrigger>
                <SelectContent>
                  {availableContractors.map(c => <SelectItem key={c.id} value={c.id}>{c.name} ({c.trade})</SelectItem>)}
                </SelectContent>
              </Select>
              <Button onClick={handleAdd} disabled={!selectedSub}>
                <PlusCircle className="h-4 w-4" /> Add
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function PermitDetailSheet({ permit, open, onOpenChange, onUpdatePackage }: PermitDetailSheetProps) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [generatedData, setGeneratedData] = React.useState<Record<string, any> | null>(null);
  const [isDataDialogOpen, setDataDialogOpen] = React.useState(false);
  const [isSubcontractorDialogOpen, setSubcontractorDialogOpen] = React.useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = React.useState<string | undefined>();
  const [attachments, setAttachments] = React.useState<File[]>(permit?.attachments || []);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  

  React.useEffect(() => {
    if (permit) {
      setAttachments(permit.attachments);
    }
    // Reset generation state when sheet closes or permit changes
    setGeneratedData(null);
    setIsGenerating(false);
  }, [permit, open]);

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
  
  const handleDownloadAll = () => {
    if (attachments.length === 0) {
      toast({ variant: 'destructive', title: 'No files to download' });
      return;
    }
    // This is a simplified download. A real app might zip these on a server.
    attachments.forEach(file => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(file);
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    });
    toast({ title: 'Success', description: 'Your downloads have started.' });
  }

  const handleGenerateData = async () => {
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
    setGeneratedData(null);

    try {
      const input: AutomatePdfPopulationInput = {
        customerData: permit.customer,
        contractorData: permit.contractor,
        propertyData: permit.property,
        permitData: { permitNumber: permit.id, county: permit.county, status: permit.status },
        pdfTemplateDataUri: template.dataUri,
      };

      const result = await automatePdfPopulation(input);

      if (result.extractedData) {
        setGeneratedData(result.extractedData);
        setDataDialogOpen(true);
        toast({ title: 'Success', description: 'AI has extracted the form data.' });
      } else {
        throw new Error('Generation failed, no data returned.');
      }
    } catch (error) {
      console.error('Data Generation Error:', error);
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: 'Could not extract data. Please try again.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const DetailItem = ({ icon, label, children, className }: { icon: React.ElementType; label: string; children: React.ReactNode; className?: string }) => (
    <div className={cn("flex items-start gap-3", className)}>
      <div className="text-muted-foreground mt-1">
        {React.createElement(icon, { className: 'h-5 w-5' })}
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div className="text-base font-semibold">{children}</div>
      </div>
    </div>
  );
  
  const formatCurrency = (amount?: number) => {
    if (typeof amount !== 'number') return 'N/A';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  }

  const copyToClipboard = () => {
    if (generatedData) {
      navigator.clipboard.writeText(JSON.stringify(generatedData, null, 2));
      toast({ title: 'Copied!', description: 'Data copied to clipboard.' });
    }
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-2xl lg:max-w-3xl flex flex-col">
          <SheetHeader>
            <SheetTitle className="text-2xl">{permit.packageName}</SheetTitle>
            <SheetDescription asChild>
              <div className="flex items-center gap-2 text-muted-foreground">
                ID: {permit.id}
                <Badge className={statusColors[permit.status]}>{permit.status}</Badge>
              </div>
            </SheetDescription>
          </SheetHeader>
          <Separator className="my-4" />

          <div className="flex-1 overflow-y-auto pr-6 -mr-6 space-y-6">
            
            <div className="space-y-4">
               <h3 className="text-lg font-semibold">Permit Details</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <DetailItem icon={Wrench} label="Description of Work">{permit.descriptionOfWork}</DetailItem>
                  <DetailItem icon={Building} label="Use of Building">{permit.buildingUse}</DetailItem>
                  <DetailItem icon={DollarSign} label="Construction Cost">{formatCurrency(permit.constructionCost)}</DetailItem>
                  <DetailItem icon={MapPin} label="Property Address">{permit.property.address.street}, {permit.county}</DetailItem>
                  <DetailItem icon={User} label="Customer">{permit.customer.name}</DetailItem>
                  <DetailItem icon={HardHat} label="Contractor">{permit.contractor.name}</DetailItem>
                  
                  <DetailItem icon={Users} label="Subcontractors" className="md:col-span-2">
                    <div className="mt-1 space-y-1 text-sm font-normal">
                      {(permit.subcontractors && permit.subcontractors.length > 0) ? (
                        permit.subcontractors.map(sub => (
                          <div key={sub.id} className="flex items-center justify-between p-1.5 rounded-md border bg-secondary/50">
                              <p className="font-medium">{sub.name}</p>
                              <p className="text-xs text-muted-foreground">{sub.trade}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground">No subcontractors assigned.</p>
                      )}
                      <Button variant="outline" size="sm" className="mt-2" onClick={() => setSubcontractorDialogOpen(true)}>
                        Manage Subcontractors
                      </Button>
                    </div>
                  </DetailItem>
                  
                   <DetailItem icon={Calendar} label="Created At">{new Date(permit.createdAt).toLocaleDateString()}</DetailItem>
              </div>
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
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold">Attachments</h3>
                <Button variant="secondary" size="sm" onClick={handleDownloadAll} disabled={attachments.length === 0}>
                  <DownloadCloud className="mr-2 h-4 w-4" />
                  Download All
                </Button>
              </div>
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
              <h3 className="text-lg font-semibold mb-3">Generate Document Data</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Select a template and the AI will extract the relevant data from this package, preparing it for form population.
              </p>
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
                <Button onClick={handleGenerateData} disabled={isGenerating || !selectedTemplateId} className="w-full">
                  {isGenerating ? (<Loader2 className="mr-2 h-4 w-4 animate-spin" />) : (<FileText className="mr-2 h-4 w-4" />)}
                  {isGenerating ? 'Extracting Data...' : 'Extract Data with AI'}
                </Button>
              </div>
            </div>
          </div>

          <SheetFooter className="mt-6">
            <Button onClick={() => onOpenChange(false)}>Close</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Dialog open={isDataDialogOpen} onOpenChange={setDataDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>AI Extracted Form Data</DialogTitle>
            <DialogDescription>
              Here is the data the AI prepared. You can copy this and use it to manually fill your PDF form.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 relative">
            <Textarea
              readOnly
              value={JSON.stringify(generatedData, null, 2)}
              className="h-64 font-mono text-xs"
            />
            <Button size="icon" variant="ghost" className="absolute top-6 right-2" onClick={copyToClipboard}>
              <Copy className="h-4 w-4"/>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {permit && <ManageSubcontractorsDialog 
        permit={permit} 
        onUpdatePackage={onUpdatePackage}
        open={isSubcontractorDialogOpen}
        onOpenChange={setSubcontractorDialogOpen}
      />}
    </>
  );
}
