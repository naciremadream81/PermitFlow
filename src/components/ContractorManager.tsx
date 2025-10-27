'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash2, Phone, Mail, FileText, MoreVertical, Award } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import type { Contractor } from '@/lib/types';
import { contractors as initialContractors } from '@/lib/data';

const contractorSchema = z.object({
    name: z.string().min(2, 'Company name is required'),
    trade: z.string().min(2, 'Trade is required'),
    licenseNumber: z.string().min(1, 'License number is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(1, 'Phone number is required'),
    fax: z.string().optional(),
    address: z.object({
        street: z.string().min(1, 'Street is required'),
        city: z.string().min(1, 'City is required'),
        state: z.string().min(1, 'State is required'),
        zip: z.string().min(1, 'Zip code is required'),
    }),
});

type ContractorFormValues = z.infer<typeof contractorSchema>;

// NOTE: This component is currently using mock data.
// In a real application, this would be wired up to Firestore.
export function ContractorManager() {
  const [contractors, setContractors] = useState<Contractor[]>(initialContractors);
  const [isFormOpen, setFormOpen] = useState(false);
  const [editingContractor, setEditingContractor] = useState<Contractor | null>(null);
  const { toast } = useToast();

  const form = useForm<ContractorFormValues>({
    resolver: zodResolver(contractorSchema),
  });

  const handleEditClick = (contractor: Contractor) => {
    setEditingContractor(contractor);
    form.reset({
        name: contractor.name,
        trade: contractor.trade,
        licenseNumber: contractor.licenseNumber,
        email: contractor.email,
        phone: contractor.phone,
        fax: contractor.fax,
        address: {
            street: contractor.address.street,
            city: contractor.address.city,
            state: contractor.address.state,
            zip: contractor.address.zip,
        }
    });
    setFormOpen(true);
  };
  
  const handleAddNewClick = () => {
    setEditingContractor(null);
    form.reset({
        name: '',
        trade: '',
        licenseNumber: '',
        email: '',
        phone: '',
        fax: '',
        address: {
            street: '',
            city: '',
            state: '',
            zip: '',
        }
    });
    setFormOpen(true);
  }

  const handleDelete = (contractorId: string) => {
    setContractors(contractors.filter((c) => c.id !== contractorId));
    toast({ title: 'Success', description: 'Contractor removed.' });
  };
  
  const onSubmit = (data: ContractorFormValues) => {
    if (editingContractor) {
      // Update existing contractor
      const updatedContractor: Contractor = { ...editingContractor, ...data };
      setContractors(contractors.map((c) => (c.id === editingContractor.id ? updatedContractor : c)));
      toast({ title: 'Success', description: 'Contractor updated.' });
    } else {
      // Add new contractor
      const newContractor: Contractor = {
        id: `cont_${Date.now()}`,
        ...data,
      };
      setContractors([newContractor, ...contractors]);
      toast({ title: 'Success', description: 'Contractor added.' });
    }
    setFormOpen(false);
    setEditingContractor(null);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Contractor List</h2>
          <p className="text-muted-foreground">Here are all the contractors in your system.</p>
        </div>
        <Button onClick={handleAddNewClick}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Contractor
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {contractors.map((contractor) => (
          <Card key={contractor.id}>
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle>{contractor.name}</CardTitle>
                        <CardDescription>{contractor.trade}</CardDescription>
                         <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
                            <Award className="h-4 w-4" /> <span>{contractor.licenseNumber}</span>
                        </div>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditClick(contractor)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(contractor.id)} className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
               <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" /> <span>{contractor.email}</span>
               </div>
               <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" /> <span>{contractor.phone}</span>
               </div>
                {contractor.fax && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <FileText className="h-4 w-4" /> <span>{contractor.fax}</span>
                    </div>
                )}
            </CardContent>
            <CardFooter>
                 <p className="text-xs text-muted-foreground">{`${contractor.address.street}, ${contractor.address.city}, ${contractor.address.state} ${contractor.address.zip}`}</p>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={isFormOpen} onOpenChange={setFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingContractor ? 'Edit Contractor' : 'Add New Contractor'}</DialogTitle>
            <DialogDescription>
              Fill in the details below. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem><FormLabel>Company Name</FormLabel><FormControl><Input placeholder="BuildRight Inc." {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="trade" render={({ field }) => (
                        <FormItem><FormLabel>Trade</FormLabel><FormControl><Input placeholder="General Contractor" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                </div>
                <FormField control={form.control} name="licenseNumber" render={({ field }) => (
                    <FormItem><FormLabel>License Number</FormLabel><FormControl><Input placeholder="CGC123456" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="contact@buildright.com" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem><FormLabel>Phone</FormLabel><FormControl><Input placeholder="555-123-4567" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="fax" render={({ field }) => (
                    <FormItem><FormLabel>Fax (Optional)</FormLabel><FormControl><Input placeholder="555-123-4568" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                
                <h3 className="text-sm font-medium text-muted-foreground pt-4">Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-lg border p-4">
                    <FormField control={form.control} name="address.street" render={({ field }) => (
                        <FormItem className="md:col-span-2"><FormLabel>Street</FormLabel><FormControl><Input placeholder="123 Main St" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="address.city" render={({ field }) => (
                        <FormItem><FormLabel>City</FormLabel><FormControl><Input placeholder="Miami" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="address.state" render={({ field }) => (
                        <FormItem><FormLabel>State</FormLabel><FormControl><Input placeholder="FL" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="address.zip" render={({ field }) => (
                        <FormItem><FormLabel>Zip Code</FormLabel><FormControl><Input placeholder="33101" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                </div>
              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
