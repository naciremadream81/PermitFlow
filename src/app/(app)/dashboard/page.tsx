'use client';

import * as React from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Search, FileText } from 'lucide-react';
import type { PermitPackage } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreatePackageDialog } from '@/components/CreatePackageDialog';
import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import { floridaCounties } from '@/lib/data';

const statusColors: { [key in PermitPackage['status']]: string } = {
  Draft: 'border-transparent bg-stone-200 text-stone-800 hover:bg-stone-200/80',
  'In Progress': 'border-transparent bg-blue-200 text-blue-800 hover:bg-blue-200/80',
  Submitted: 'border-transparent bg-yellow-200 text-yellow-800 hover:bg-yellow-200/80',
  Approved: 'border-transparent bg-green-200 text-green-800 hover:bg-green-200/80',
  Rejected: 'border-transparent bg-red-200 text-red-800 hover:bg-red-200/80',
};

export default function DashboardPage() {
  const firestore = useFirestore();
  const { user } = useUser();
  
  const packagesQuery = useMemoFirebase(() => {
    if (!user) return null;
    // NOTE: This is a simplified query for demonstration. In a real app, you would
    // likely have more complex queries and security rules.
    return query(collection(firestore, 'users', user.uid, 'permitPackages'));
  }, [firestore, user]);

  const { data: packages, isLoading } = useCollection<PermitPackage>(packagesQuery);

  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [countyFilter, setCountyFilter] = React.useState('all');
  const [isCreateDialogOpen, setCreateDialogOpen] = React.useState(false);

  const filteredPackages = React.useMemo(() => {
    if (!packages) return [];
    return packages.filter((pkg) => {
      const searchMatch =
        pkg.packageName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.id.toLowerCase().includes(searchQuery.toLowerCase());
      const statusMatch = statusFilter === 'all' || pkg.status === statusFilter;
      const countyMatch = countyFilter === 'all' || pkg.county === countyFilter;
      return searchMatch && statusMatch && countyMatch;
    });
  }, [packages, searchQuery, statusFilter, countyFilter]);

  return (
    <div className="flex h-full flex-col">
      <Header title="Permit Packages" description="Manage and track all your permit packages.">
        <Button onClick={() => setCreateDialogOpen(true)}>
          <PlusCircle />
          New Package
        </Button>
      </Header>
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, customer, or ID..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {Object.keys(statusColors).map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={countyFilter} onValueChange={setCountyFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by county" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Counties</SelectItem>
                {floridaCounties.map((county) => (
                  <SelectItem key={county} value={county}>
                    {county}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading && (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg font-semibold">Loading packages...</p>
          </div>
        )}

        {!isLoading && (
          <div className="grid gap-4 md:gap-6 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {filteredPackages.map((pkg) => (
              <Link key={pkg.id} href={`/package/${pkg.id}`} passHref>
                  <Card className="flex flex-col cursor-pointer hover:border-primary/50 transition-colors h-full">
                  <CardHeader className="pb-4">
                      <div className="flex justify-between items-start gap-2">
                      <CardTitle className="leading-tight text-lg">{pkg.packageName}</CardTitle>
                      <Badge variant="secondary" className={statusColors[pkg.status]}>
                          {pkg.status}
                      </Badge>
                      </div>
                      <CardDescription className="text-xs !mt-1">{pkg.id}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      <div className="text-muted-foreground">
                          <p className="font-medium text-foreground text-xs">Customer</p> 
                          <p>{pkg.customer.name}</p>
                      </div>
                      <div className="text-muted-foreground">
                          <p className="font-medium text-foreground text-xs">County</p>
                          <p>{pkg.county}</p>
                      </div>
                      <div className="text-muted-foreground">
                          <p className="font-medium text-foreground text-xs">Contractor</p>
                          <p>{pkg.contractor.name}</p>
                      </div>
                      <div className="text-muted-foreground">
                          <p className="font-medium text-foreground text-xs">Created</p>
                          <p>{new Date(pkg.createdAt).toLocaleDateString()}</p>
                      </div>
                  </CardContent>
                  <CardFooter>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          <span>Manage Package & Documents</span>
                      </p>
                  </CardFooter>
                  </Card>
              </Link>
            ))}
          </div>
        )}
        
        {!isLoading && filteredPackages.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
                <p className="text-lg font-semibold">No packages found</p>
                <p>Try adjusting your search or filters, or create a new package.</p>
            </div>
        )}
      </main>

      <CreatePackageDialog
        open={isCreateDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onPackageCreate={() => {
          /* No longer need to manually add to local state */
        }}
      />
    </div>
  );
}
