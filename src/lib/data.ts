import type { PermitPackage, County, Customer, Contractor, Property, PDFTemplate, PermitType } from './types';

export const customers: Customer[] = [
  { id: 'cust_001', name: 'John Doe', email: 'john.doe@email.com', phone: '555-1234' },
  { id: 'cust_002', name: 'Jane Smith', email: 'jane.smith@email.com', phone: '555-5678' },
];

export const contractors: Contractor[] = [
  { id: 'cont_001', name: 'BuildRight Inc.', licenseNumber: 'CGC123456', email: 'contact@buildright.com', phone: '555-8765' },
  { id: 'cont_002', name: 'Quality Homes LLC', licenseNumber: 'CGC789012', email: 'info@qualityhomes.com', phone: '555-4321' },
];

export const properties: Property[] = [
  { id: 'prop_001', address: '123 Main St', city: 'Miami', zip: '33101' },
  { id: 'prop_002', address: '456 Oak Ave', city: 'Orlando', zip: '32801' },
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

const defaultChecklist = [
  { id: 'chk_01', text: 'Notice of Commencement', completed: false },
  { id: 'chk_02', text: 'Site Plan / Plot Plan', completed: true },
  { id: 'chk_03', text: 'Floor Plans', completed: false },
  { id: 'chk_04', text: 'Energy Calculations', completed: false },
  { id: 'chk_05', text: 'HVAC Duct Layout', completed: false },
];

export const countyData: County[] = floridaCounties.map(name => ({
  name,
  checklist: defaultChecklist.map(item => ({...item, id: `${name.toLowerCase().replace(/\s/g, '-')}_${item.id}`}))
}));

export const permitTypes: PermitType[] = [
    {
        id: 'pt_new_build',
        name: 'New Single Family Home',
        checklist: [
            { text: 'Foundation Plans' },
            { text: 'Framing Plans' },
            { text: 'Electrical Plans' },
            { text: 'Plumbing Plans' },
            { text: 'Mechanical Plans (HVAC)' },
            { text: 'Roofing Details' },
            { text: 'Energy Code Compliance Forms' },
        ],
    },
    {
        id: 'pt_modular',
        name: 'Modular/Manufactured Home',
        checklist: [
            { text: 'Manufacturer\'s Installation Manual' },
            { text: 'Foundation/Anchoring Details' },
            { text: 'Utility Connection Plans (Sewer, Water, Electric)' },
            { text: 'Site Plan' },
            { text: 'Transportation Permit' },
        ],
    },
    {
        id: 'pt_remodel',
        name: 'Major Remodel / Addition',
        checklist: [
            { text: 'As-Built Drawings of Existing Structure' },
            { text: 'Demolition Plans' },
            { text: 'Proposed Floor Plans' },
            { text: 'Structural Modifications Details' },
            { text: 'Electrical/Plumbing Updates' },
        ],
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
    property: properties[0],
    checklist: countyData.find(c => c.name === 'Miami-Dade')?.checklist || [],
    attachments: [],
    createdAt: '2024-07-28T10:00:00Z',
  },
  {
    id: 'PKG-2024-002',
    packageName: 'Smith Modular Home',
    status: 'Draft',
    county: 'Orange',
    customer: customers[1],
    contractor: contractors[1],
    property: properties[1],
    checklist: countyData.find(c => c.name === 'Orange')?.checklist || [],
    attachments: [],
    createdAt: '2024-07-29T14:30:00Z',
  },
    {
    id: 'PKG-2024-003',
    packageName: 'Lakefront Property Setup',
    status: 'Submitted',
    county: 'Polk',
    customer: customers[0],
    contractor: contractors[1],
    property: { id: 'prop_003', address: '789 Lake Rd', city: 'Lakeland', zip: '33801' },
    checklist: countyData.find(c => c.name === 'Polk')?.checklist || [],
    attachments: [],
    createdAt: '2024-07-30T09:00:00Z',
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
