
'use client';

import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Contractor, PermitPackage, Status } from '@/lib/types';
import { Download } from 'lucide-react';
import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import { contractors } from '@/lib/data';

const statuses: Status[] = ['Draft', 'In Progress', 'Submitted', 'Approved', 'Rejected'];

export function ReportGenerator() {
  const firestore = useFirestore();
  const { user } = useUser();
  
  const packagesQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(collection(firestore, 'users', user.uid, 'permitPackages'));
  }, [firestore, user]);

  const { data: permitPackages } = useCollection<PermitPackage>(packagesQuery);
  
  const [statusFilter, setStatusFilter] = useState('all');
  const [contractorFilter, setContractorFilter] = useState('all');

  const filteredPackages = (permitPackages || []).filter((pkg) => {
    const statusMatch = statusFilter === 'all' || pkg.status === statusFilter;
    const contractorMatch = contractorFilter === 'all' || pkg.contractor.id === contractorFilter;
    return statusMatch && contractorMatch;
  });
  
  const downloadCSV = () => {
    const headers = ['Package ID', 'Package Name', 'Status', 'County', 'Customer', 'Contractor', 'Created At'];
    const rows = filteredPackages.map(pkg => [
      pkg.id,
      pkg.packageName,
      pkg.status,
      pkg.county,
      pkg.customer.name,
      pkg.contractor.name,
      new Date(pkg.createdAt).toLocaleDateString()
    ]);

    let csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "permit_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
                <CardTitle>Permit Package Report</CardTitle>
                <CardDescription>Filter and export a list of permit packages.</CardDescription>
            </div>
            <Button onClick={downloadCSV} disabled={filteredPackages.length === 0}>
                <Download className="mr-2 h-4 w-4" />
                Download CSV
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={contractorFilter} onValueChange={setContractorFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by contractor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Contractors</SelectItem>
                {contractors.map((contractor) => (
                  <SelectItem key={contractor.id} value={contractor.id}>
                    {contractor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
        </div>

        <div className="border rounded-md">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Package Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>County</TableHead>
                        <TableHead>Contractor</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Created</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredPackages.length > 0 ? (
                        filteredPackages.map((pkg) => (
                            <TableRow key={pkg.id}>
                                <TableCell className="font-medium">{pkg.packageName}</TableCell>
                                <TableCell>{pkg.status}</TableCell>
                                <TableCell>{pkg.county}</TableCell>
                                <TableCell>{pkg.contractor.name}</TableCell>
                                <TableCell>{pkg.customer.name}</TableCell>
                                <TableCell>{new Date(pkg.createdAt).toLocaleDateString()}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center h-24">
                                No packages found for the selected filters.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
      </CardContent>
    </Card>
  );
}
