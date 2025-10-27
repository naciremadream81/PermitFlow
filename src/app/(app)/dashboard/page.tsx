
'use client';

import * as React from 'react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Search, User, HardHat, MapPin, Calendar } from 'lucide-react';
import { permitPackages as initialPermitPackages, floridaCounties } from '@/lib/data';
import type { PermitPackage, Status } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreatePackageDialog } from '@/components/CreatePackageDialog';
import { PermitDetailSheet } from '@/components/PermitDetailSheet';
import useLocalStorage from '@/hooks/use-local-storage';

const statusColors: { [key in Status]: string } = {
  Draft: 'border-transparent bg-stone-200 text-stone-800 hover:bg-stone-200/80',
  'In Progress': 'border-transparent bg-blue-200 text-blue-800 hover:bg-blue-200/80',
  Submitted: 'border-transparent bg-yellow-200 text-yellow-800 hover:bg-yellow-200/80',
  Approved: 'border-transparent bg-green-200 text-green-800 hover:bg-green-200/80',
  Rejected: 'border-transparent bg-red-200 text-red-800 hover:bg-red-200/80',
};

const DetailItem = ({ icon, children }: { icon: React.ElementType, children: React.ReactNode }) => (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {React.createElement(icon, { className: 'h-4 w-4' })}
        <span>{children}</span>
    </div>
);

export default function DashboardPage() {
  const [packages, setPackages] = useLocalStorage<PermitPackage[]>('permitPackages', initialPermitPackages);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [countyFilter, setCountyFilter] = React.useState('all');
  const [isCreateDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [selectedPermit, setSelectedPermit] = React.useState<PermitPackage | null>(null);

  const handleUpdatePackage = (updatedPackage: PermitPackage) => {
    setPackages(packages.map(p => p.id === updatedPackage.id ? updatedPackage : p));
  };
  
  const filteredPackages = packages.filter((pkg) => {
    const searchMatch =
      pkg.packageName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.id.toLowerCase().includes(searchQuery.toLowerCase());
    const statusMatch = statusFilter === 'all' || pkg.status === statusFilter;
    const countyMatch = countyFilter === 'all' || pkg.county === countyFilter;
    return searchMatch && statusMatch && countyMatch;
  });

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

        <div className="grid gap-4 md:gap-6 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filteredPackages.map((pkg) => (
            <Card key={pkg.id} className="flex flex-col cursor-pointer hover:shadow-lg transition-shadow duration-300" onClick={() => setSelectedPermit(pkg)}>
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start gap-2">
                  <CardTitle className="leading-tight text-lg">{pkg.packageName}</CardTitle>
                  <Badge variant="secondary" className={statusColors[pkg.status]}>
                    {pkg.status}
                  </Badge>
                </div>
                <CardDescription className="text-xs !mt-1">{pkg.id}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 space-y-3">
                 <p className="text-sm text-muted-foreground line-clamp-2">{pkg.descriptionOfWork}</p>
                 <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-2">
                    <DetailItem icon={User}>{pkg.customer.name}</DetailItem>
                    <DetailItem icon={HardHat}>{pkg.contractor.name}</DetailItem>
                    <DetailItem icon={MapPin}>{pkg.county}</DetailItem>
                    <DetailItem icon={Calendar}>{new Date(pkg.createdAt).toLocaleDateString()}</DetailItem>
                 </div>
              </CardContent>
              <CardFooter>
                 
              </CardFooter>
            </Card>
          ))}
        </div>
        {filteredPackages.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
                <p className="text-lg font-semibold">No packages found</p>
                <p>Try adjusting your search or filters.</p>
            </div>
        )}
      </main>

      <CreatePackageDialog
        open={isCreateDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onPackageCreate={(newPackage) => {
          setPackages([newPackage, ...packages]);
        }}
      />

      <PermitDetailSheet
        permit={selectedPermit}
        open={!!selectedPermit}
        onOpenChange={(open) => {
          if (!open) setSelectedPermit(null);
        }}
        onUpdatePackage={handleUpdatePackage}
      />
    </div>
  );
}
