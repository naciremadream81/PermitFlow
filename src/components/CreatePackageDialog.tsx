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
import { floridaCounties } from '@/lib/data';
import type { PermitPackage } from '@/lib/types';
import { PlusCircle } from 'lucide-react';

const packageSchema = z.object({
  packageName: z.string().min(3, 'Package name must be at least 3 characters'),
  county: z.string().min(1, 'Please select a county'),
  customerName: z.string().min(2, 'Customer name is required'),
  customerEmail: z.string().email('Invalid email address'),
  contractorName: z.string().min(2, 'Contractor name is required'),
  propertyAddress: z.string().min(5, 'Property address is required'),
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
      contractorName: '',
      propertyAddress: '',
    },
  });

  function onSubmit(data: PackageFormValues) {
    const newPackage: PermitPackage = {
      id: `PKG-${Date.now()}`,
      packageName: data.packageName,
      status: 'Draft',
      county: data.county,
      customer: {
        id: `cust_${Date.now()}`,
        name: data.customerName,
        email: data.customerEmail,
        phone: 'N/A',
      },
      contractor: {
        id: `cont_${Date.now()}`,
        name: data.contractorName,
        licenseNumber: 'N/A',
        email: 'N/A',
        phone: 'N/A',
      },
      property: {
        id: `prop_${Date.now()}`,
        address: data.propertyAddress,
        city: 'N/A',
        zip: 'N/A',
      },
      checklist: [],
      attachments: [],
      createdAt: new Date().toISOString(),
    };
    onPackageCreate(newPackage);
    onOpenChange(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Permit Package</DialogTitle>
          <DialogDescription>Fill in the details below to create a new permit package.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <h3 className="text-sm font-medium text-muted-foreground">Contractor & Property</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-lg border p-4">
                <FormField
                  control={form.control}
                  name="contractorName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contractor Name</FormLabel>
                      <FormControl>
                        <Input placeholder="BuildRight Inc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="propertyAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main St, Anytown, FL" {...field} />
                      </FormControl>
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
