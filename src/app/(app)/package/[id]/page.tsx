'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileUploadManager } from '@/components/FileUploadManager';
import { ArrowLeft, User, HardHat, MapPin, Calendar, Fingerprint, DollarSign, Building, Wrench, Users } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import type { PermitPackage } from '@/lib/types';
import Link from 'next/link';
import { useUser, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

const DetailItem = ({ icon, label, children, className }: { icon: React.ElementType; label: string; children: React.ReactNode; className?: string }) => (
    <div className={`flex items-start gap-3 ${className}`}>
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

export default function PackageWorkspacePage() {
  const params = useParams();
  const packageId = params.id as string;
  const firestore = useFirestore();
  const { user } = useUser();

  const permitRef = useMemoFirebase(() => {
    if (!user || !packageId) return null;
    return doc(firestore, 'users', user.uid, 'permitPackages', packageId);
  }, [firestore, user, packageId]);

  const { data: permit, isLoading } = useDoc<PermitPackage>(permitRef);

  if (isLoading) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <p className="text-lg text-muted-foreground">Loading permit package...</p>
      </div>
    );
  }

  if (!permit) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <p className="text-lg text-muted-foreground">Permit package not found.</p>
        <Button variant="outline" asChild className="mt-4">
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <Header title={permit.packageName} description={`ID: ${permit.id}`}>
        <Button variant="outline" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </Header>
      <main className="flex-1 overflow-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Details */}
        <div className="lg:col-span-1 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Permit Details</CardTitle>
                    <CardDescription>High-level information about this package.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <DetailItem icon={Wrench} label="Description of Work">{permit.descriptionOfWork}</DetailItem>
                    <DetailItem icon={Building} label="Use of Building">{permit.buildingUse}</DetailItem>
                    <DetailItem icon={DollarSign} label="Construction Cost">{formatCurrency(permit.constructionCost)}</DetailItem>
                    <Separator />
                    <DetailItem icon={MapPin} label="Property Address">{permit.property.address.street}, {permit.county}</DetailItem>
                    <DetailItem icon={Fingerprint} label="Parcel ID">{permit.property.parcelId}</DetailItem>
                    <Separator />
                    <DetailItem icon={User} label="Customer">{permit.customer.name}</DetailItem>
                    <DetailItem icon={HardHat} label="Contractor">{permit.contractor.name}</DetailItem>
                    <DetailItem icon={Calendar} label="Created At">{new Date(permit.createdAt).toLocaleDateString()}</DetailItem>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Subcontractors</CardTitle>
                </CardHeader>
                <CardContent>
                    {(permit.subcontractors && permit.subcontractors.length > 0) ? (
                        <div className="space-y-2">
                        {permit.subcontractors.map(sub => (
                            <div key={sub.id} className="flex items-center justify-between p-2 rounded-md border bg-secondary/50">
                                <div>
                                    <p className="font-medium text-sm">{sub.name}</p>
                                    <p className="text-xs text-muted-foreground">{sub.trade}</p>
                                </div>
                                <Users className="h-5 w-5 text-muted-foreground" />
                            </div>
                        ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">No subcontractors assigned.</p>
                    )}
                </CardContent>
            </Card>
        </div>

        {/* Right Column: Document Hub */}
        <div className="lg:col-span-2">
          <FileUploadManager />
        </div>
      </main>
    </div>
  );
}
