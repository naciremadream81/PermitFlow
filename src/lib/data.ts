
import type { PermitPackage, Customer, Contractor, Property, PDFTemplate, PermitType, ChecklistItem } from './types';

const floridaAddress = { street: '123 Sunshine State St', city: 'Miami', state: 'FL', zip: '33101' };

export const customers: Customer[] = [
  { id: 'cust_001', name: 'John Doe', email: 'john.doe@email.com', phone: '555-1234', address: floridaAddress },
  { id: 'cust_002', name: 'Jane Smith', email: 'jane.smith@email.com', phone: '555-5678', address: floridaAddress },
];

export const contractors: Contractor[] = [
  { id: 'cont_001', name: 'BuildRight Inc.', trade: 'General Contractor', licenseNumber: 'CGC123456', email: 'contact@buildright.com', phone: '555-8765', address: floridaAddress },
  { id: 'cont_002', name: 'Quality Homes LLC', trade: 'Residential Contractor', licenseNumber: 'CGC789012', email: 'info@qualityhomes.com', phone: '555-4321', address: floridaAddress },
  { id: 'cont_003', name: 'PlumbPerfect', trade: 'Plumbing', licenseNumber: 'CFC1425899', email: 'service@plumbperfect.com', phone: '555-9999', address: floridaAddress },
  { id: 'cont_004', name: 'ElecTech', trade: 'Electrical', licenseNumber: 'EC13005138', email: 'contact@electech.com', phone: '555-8888', address: floridaAddress },
  { id: 'cont_005', name: 'CoolBreeze HVAC', trade: 'HVAC', licenseNumber: 'CAC1813642', email: 'support@coolbreeze.com', phone: '555-7777', address: floridaAddress },
];

export const properties: Property[] = [
  { id: 'prop_001', address: { street: '123 Main St', city: 'Miami', state: 'FL', zip: '33101' }, parcelId: '01-2345-000-0000' },
  { id: 'prop_002', address: { street: '456 Oak Ave', city: 'Orlando', state: 'FL', zip: '32801' }, parcelId: '02-3456-000-0000' },
];

export const floridaCounties: string[] = [
    "Alachua", "Baker", "Bay", "Bradford", "Brevard", "Broward", "Calhoun", "Charlotte", "Citrus", "Clay",
    "Collier", "Columbia", "DeSoto", "Dixie", "Duval", "Escambia", "Flagler", "Franklin", "Gadsden", "Gilchrist",
    "Glades", "Gulf", "Hamilton", "Hardee", "Hendry", "Hernando", "Highlands", "Hillsborough", "Holmes", "Indian River",
    "Jackson", "Jefferson", "Lafayette", "Lake", "Lee", "Leon", "Levy", "Liberty", "Madison", "Manatee",
    "Marion", "Martin", "Miami-Dade", "Monroe", "Nassau", "Okaloosa", "Okeechobee", "Orange", "Osceola", "Palm Beach",
    "Pasco", "Pinellas", "Polk", "Putnam", "Santa Rosa", "Sarasota", "Seminole", "St. Johns", "St. Lucie", "Sumter",
    "Suwannee", "Taylor", "Union", "Volusia", "Wakulla", "Walton", "Washington"
];

export const standardPackageChecklist: ChecklistItem[] = [
  { id: 'std_01', text: 'Completed Permit Application', completed: false, attachments: [] },
  { id: 'std_02', text: 'Notice of Commencement', completed: false, attachments: [] },
  { id: 'std_03', text: 'Contractor License & Insurance', completed: false, attachments: [] },
  { id: 'std_04', text: 'Owner-Builder Disclosure (if applicable)', completed: false, attachments: [] },
];

export const permitTypes: PermitType[] = [
    {
        id: 'pt_new_build',
        name: 'New Single Family Home',
    },
    {
        id: 'pt_mobile_home',
        name: 'Mobile/Manufactured Home',
    },
    {
        id: 'pt_modular',
        name: 'Modular Home',
    },
    {
        id: 'pt_remodel',
        name: 'Major Remodel / Addition',
    },
];

export const permitPackages: PermitPackage[] = [
  {
    id: 'PKG-2024-001',
    packageName: 'Doe Residence - New Build',
    status: 'In Progress',
    county: 'Miami-Dade',
    customer: customers[0],
    contractor: contractors[0],
    subcontractors: [contractors[2], contractors[3], contractors[4]],
    property: properties[0],
    standardChecklist: standardPackageChecklist.map(item => ({...item, attachments: []})),
    createdAt: '2024-07-28T10:00:00Z',
    descriptionOfWork: 'New single family home construction',
    buildingUse: 'Single Family Residential',
    constructionCost: 350000,
  },
  {
    id: 'PKG-2024-002',
    packageName: 'Smith Modular Home',
    status: 'Draft',
    county: 'Orange',
    customer: customers[1],
    contractor: contractors[1],
    subcontractors: [],
    property: properties[1],
    standardChecklist: standardPackageChecklist.map(item => ({...item, attachments: []})),
    createdAt: '2024-07-29T14:30:00Z',
    descriptionOfWork: 'Installation of a new modular home on existing lot.',
    buildingUse: 'Modular Home',
    constructionCost: 150000,
  },
    {
    id: 'PKG-2024-003',
    packageName: 'Lakefront Property Setup',
    status: 'Submitted',
    county: 'Polk',
    customer: customers[0],
    contractor: contractors[1],
    subcontractors: [],
    property: { id: 'prop_003', parcelId: '03-4567-000-0000', address: { street: '789 Lake Rd', city: 'Lakeland', state: 'FL', zip: '33801' } },
    standardChecklist: standardPackageChecklist.map(item => ({...item, attachments: []})),
    createdAt: '2024-07-30T09:00:00Z',
    descriptionOfWork: 'Site prep and setup for a new manufactured home.',
    buildingUse: 'Manufactured Home',
    constructionCost: 85000,
  },
];

export const pdfTemplates: PDFTemplate[] = [
    {
        id: 'tpl_001',
        name: 'Standard Building Permit Application',
        description: 'Generic permit application form for most counties.',
        dataUri: 'data:application/pdf;base64,JVBERi0xLjcKMSAwIG9iago8PC9UeXBlL0NhdGFsb2cvUGFnZXMgMiAwIFI+PgplbmRvYmoKMiAwIG9iago8PC9UeXBlL1BhZ2VzL0tpZHNbMyAwIFJdL0NvdW50IDE+PgplbmRvYmoKMyAwIG9iago8PC9UeXBlL1BhZ2UvUGFyZW50IDIgMCBSL01lZGlhQm94WzAgMCA1OTUgODQyXS9SZXNvdXJjZXM8PC9Gb250PDwvRjEgNiAwIFI+Pj4vQ29udGVudHMgNCAwIFI+PgplbmRvYmoKNCAwIG9iago8PC9MZW5ndGggNTg+PgpzdHJlYW0KQkQKQVQmIENvbXBhbnkgV29yayBPcmRlciBFVAovRjEgMTIgVGYgCjEgMCAwIDEgNzIgNzQwIFRtIApCVCgmbmJzcDsJVGhpcyBpcyBhIHNhbXBsZSBQREYgZG9jdW1lbnQuKSBUago5MCBUZCAoRm9yIEZpbGxpbmcpIFRqCkVNCmVuZHN0cmVhbQplbmRvYmoKNSAwIG9iago8PC9MZW5ndGggMTIwPj4Kc3RyZWFtClRyYWlsZXIKPDwvUm9vdCAxIDAgUi9TSVpFIDY+PgpzdGFydHhyZWYKMzQzCiUlRU9GCmVuZHN0cmVhbQplbmRvYmoKNjoyCi9CYXNlRm9udC9IZWx2ZXRpY2EvU3VidHlwZS9UeXBlMS9UeXBlL0ZvbnQvRW5jb2RpbmcvV2luQW5zaUVuY29kaW5nCj4+CmVuZG9iagp4cmVmCjAgNgogMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDE1IDY1NTM1IGYgCjAwMDAwMDAwNjkgNjU1MzUgZiAKMDAwMDAwMDEyMyA2NTUzNSBmIAowMDAwMDAwMjQxIDY1NTM1IGYgCjAwMDAwMDAzMjYgNjU1MzUgZiAKdHJhaWxlcgo8PC9TaXplIDYvUm9vdCAxIDAgUj4+CnN0YXJ0eHJlZgo0MjAKJSVFT0YK'
    },
    {
        id: 'tpl_002',
        name: 'Notice of Commencement',
        description: 'Official document to be filed before work begins.',
        dataUri: 'data:application/pdf;base64,JVBERi0xLjQKJSAg...JUI1NvbW1lbmNlbWVudC4pIFRqCkVNCmVuZHN0cmVhbQplbmRvYmoKCjYgMCBvYmoKPDwvVHlwZS9Gb250L1N1YnR5cGUvVHlwZTEvQmFzZUZvbnQvSGVsdmV0aWNhPj4KZW5kb2JqCnhyZWYKMCA3CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAxNSAwMDAwMCBuIAowMDAwMDAwMDYxIDAwMDAwIG4gCjAwMDAwMDAxMTUgMDAwMDAgbiAKMDAwMDAwMjA5IDAwMDAwIG4gCjAwMDAwMDAzMDUgMDAwMDAgbiAKMDAwMDAwMDM3MyAwMDAwMCBuIAp0cmFpbGVyCjw8L1Jvb3QgMSAwIFIvU2l6ZSA3Pj4Kc3RhcnR4cmVmCjQyOQolJUVPRgo='
    }
];
