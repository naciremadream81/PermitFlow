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
import { floridaCounties, contractors, permitTypes, countyData } from '@/lib/data';
import type { PermitPackage, Contractor } from '@/lib/types';
import { PlusCircle } from 'lucide-react';
import { Textarea } from './ui/textarea';

const packageSchema = z.object({
  packageName: z.string().min(3, 'Package name must be at least 3 characters'),
  county: z.string().min(1, 'Please select a county'),
  customerName: z.string().min(2, 'Customer name is required'),
  customerEmail: z.string().email('Invalid email address'),
  contractorId: z.string().min(1, 'Please select a contractor'),
  permitTypeId: z.string().min(1, 'Please select a permit type'),
  propertyAddress: z.string().min(5, 'Property address is required'),
  parcelId: z.string().min(1, "Parcel ID is required."),
  descriptionOfWork: z.string().min(10, 'Please provide a brief description of the work.'),
  buildingUse: z.string().min(3, 'Building use is required.'),
  constructionCost: z.coerce.number().min(0, 'Construction cost must be a positive number.'),
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
      contractorId: '',
      permitTypeId: '',
      propertyAddress: '',
      parcelId: '',
      descriptionOfWork: '',
      buildingUse: '',
      constructionCost: 0,
    },
  });

  function onSubmit(data: PackageFormValues) {
    const selectedContractor = contractors.find(c => c.id === data.contractorId) as Contractor;
    const selectedPermitType = permitTypes.find(pt => pt.id === data.permitTypeId);
    const countyChecklist = countyData.find(c => c.name === data.county)?.checklist || [];
    
    const newChecklist = selectedPermitType
      ? selectedPermitType.checklist.map((item, index) => ({
          id: `new_${data.county}_${selectedPermitType.id}_${index}`,
          text: item.text,
          completed: false,
        }))
      : countyChecklist;

    const newPackage: PermitPackage = {
      id: `PKG-${Date.now()}`,
      packageName: data.packageName,
      status: 'Draft',
      county: data.county,
      customer: {
        id: `cust_${Date.now()}`,
        name: data.customerName,
        email: data.customerEmail,
        phone: 'N/A', // Placeholder
        address: { street: '', city: '', state: '', zip: '' }, // Placeholder
      },
      contractor: selectedContractor,
      property: {
        id: `prop_${Date.now()}`,
        parcelId: data.parcelId,
        address: {
          street: data.propertyAddress,
          city: 'N/A', // Placeholder
          state: 'FL', // Placeholder
          zip: 'N/A', // Placeholder
        },
      },
      checklist: newChecklist,
      attachments: [],
      createdAt: new Date().toISOString(),
      descriptionOfWork: data.descriptionOfWork,
      buildingUse: data.buildingUse,
      constructionCost: data.constructionCost,
    };
    onPackageCreate(newPackage);
    onOpenChange(false);
    form.reset();
  }

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
                          </Trigger>
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
