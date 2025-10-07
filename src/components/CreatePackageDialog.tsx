
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { floridaCounties, contractors, permitTypes, countyData, countyPermitChecklists } from '@/lib/data';
import type { PermitPackage } from '@/lib/types';
import { PlusCircle } from 'lucide-react';
import { Textarea } from './ui/textarea';

const packageSchema = z.object({
  packageName: z.string().min(3, 'Package name must be at least 3 characters'),
  county: z.string().min(1, 'Please select a county'),
  customerName: z.string().min(2, 'Customer name is required'),
  customerEmail: z.string().email('Invalid email address'),
  customerPhone: z.string().optional(),
  contractorId: z.string().min(1, 'Please select a contractor'),
  permitTypeId: z.string().min(1, 'Please select a permit type'),
  propertyAddress: z.string().min(5, 'Property address is required'),
  parcelId: z.string().min(1, "Parcel ID is required."),
  descriptionOfWork: z.string().min(10, 'Please provide a brief description of the work.'),
  buildingUse: z.string().min(3, 'Building use is required.'),
  constructionCost: z.coerce.number().min(0, 'Construction cost must be a positive number.'),
  acTons: z.coerce.number().optional(),
  heatKw: z.coerce.number().optional(),
  septicPermitOrSewerCompany: z.string().optional(),
  electricalServiceAmps: z.coerce.number().optional(),
  waterServiceSource: z.string().optional(),
});

type PackageFormValues = z.infer<typeof packageSchema>;

interface CreatePackageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPackageCreate: (newPackage: PermitPackage) => void;
}

export function CreatePackageDialog({ open, onOpenChange, onPackageCreate }: CreatePackageDialogProps) {
  const form = useForm<PackageFormValues>({
    resolver: zodResolver(packageSchema),
    defaultValues: {
      packageName: '',
      county: '',
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      contractorId: '',
      permitTypeId: '',
      propertyAddress: '',
      parcelId: '',
      descriptionOfWork: '',
      buildingUse: '',
      constructionCost: 0,
      acTons: undefined,
      heatKw: undefined,
      septicPermitOrSewerCompany: '',
      electricalServiceAmps: undefined,
      waterServiceSource: '',
    },
  });

  const onSubmit = (data: PackageFormValues) => {
    const selectedContractor = contractors.find(c => c.id === data.contractorId);
    if (!selectedContractor) {
      console.error("Selected contractor not found!");
      return;
    }
    
    // Determine the correct checklist
    const specificChecklist = countyPermitChecklists[data.county]?.[data.permitTypeId];
    const fallbackChecklist = countyData.find(c => c.name === data.county)?.checklist || [];
    
    let rawChecklist = [];
    if (specificChecklist) {
      rawChecklist = specificChecklist.map((item, index) => ({
          id: `new_${data.county}_${data.permitTypeId}_${index}`,
          text: item.text,
          completed: false,
      }));
    } else {
      rawChecklist.push(...fallbackChecklist);
    }

    const newPackage: PermitPackage = {
      id: `PKG-${Date.now()}`,
      packageName: data.packageName,
      status: 'Draft',
      county: data.county,
      customer: {
        id: `cust_${Date.now()}`,
        name: data.customerName,
        email: data.customerEmail,
        phone: data.customerPhone || 'N/A',
        address: { street: '', city: '', state: '', zip: '' }, // Placeholder
      },
      contractor: selectedContractor,
      subcontractors: [],
      property: {
        id: `prop_${Date.now()}`,
        parcelId: data.parcelId,
        address: {
          street: data.propertyAddress,
          city: '', // Placeholder
          state: 'FL', // Placeholder
          zip: '', // Placeholder
        },
      },
      checklist: rawChecklist,
      attachments: [],
      createdAt: new Date().toISOString(),
      descriptionOfWork: data.descriptionOfWork,
      buildingUse: data.buildingUse,
      constructionCost: data.constructionCost,
      acTons: data.acTons,
      heatKw: data.heatKw,
      septicPermitOrSewerCompany: data.septicPermitOrSewerCompany,
      electricalServiceAmps: data.electricalServiceAmps,
      waterServiceSource: data.waterServiceSource,
    };
    onPackageCreate(newPackage);
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Create New Permit Package</DialogTitle>
          <DialogDescription>Fill in the details below to create a new permit package.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4 max-h-[80vh] overflow-y-auto pr-4">
            <FormField
              control={form.control}
              name="packageName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Package Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Smith Residence - New Modular" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="descriptionOfWork"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description of Work</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe the work to be done..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <FormField
                control={form.control}
                name="buildingUse"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Building Use</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Single Family Residential" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="constructionCost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Construction Cost</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="150000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">System Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-lg border p-4">
                    <FormField control={form.control} name="acTons" render={({ field }) => (
                        <FormItem>
                            <FormLabel>A/C Tons</FormLabel>
                            <FormControl><Input type="number" placeholder="3.5" {...field} value={field.value ?? ''} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                    <FormField control={form.control} name="heatKw" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Heat (kW)</FormLabel>
                            <FormControl><Input type="number" placeholder="10" {...field} value={field.value ?? ''} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                    <FormField control={form.control} name="electricalServiceAmps" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Electrical (Amps)</FormLabel>
                            <FormControl><Input type="number" placeholder="200" {...field} value={field.value ?? ''} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                </div>
            </div>

            <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Utilities</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-lg border p-4">
                    <FormField control={form.control} name="septicPermitOrSewerCompany" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Septic/Sewer</FormLabel>
                            <FormControl><Input placeholder="Charlotte County Utilities" {...field} value={field.value ?? ''} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                    <FormField control={form.control} name="waterServiceSource" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Water Source</FormLabel>
                            <FormControl><Input placeholder="City Water" {...field} value={field.value ?? ''} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                </div>
            </div>


            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Location & Type</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-lg border p-4">
                <FormField
                  control={form.control}
                  name="county"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>County</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a county" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {floridaCounties.map((county) => (
                            <SelectItem key={county} value={county}>
                              {county}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="permitTypeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Permit Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a permit type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {permitTypes.map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Property Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-lg border p-4">
                <FormField
                  control={form.control}
                  name="propertyAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property Address (Street)</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main St" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="parcelId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parcel ID</FormLabel>
                      <FormControl>
                        <Input placeholder="01-2345-000-0000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Customer Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-lg border p-4">
                <FormField
                  control={form.control}
                  name="customerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="customerEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="john.doe@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="customerPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="555-123-4567" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Contractor</h3>
               <div className="rounded-lg border p-4">
                <FormField
                  control={form.control}
                  name="contractorId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Contractor</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a contractor" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {contractors.map((contractor) => (
                            <SelectItem key={contractor.id} value={contractor.id}>
                              {contractor.name} ({contractor.licenseNumber})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                <PlusCircle />
                Create Package
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

    