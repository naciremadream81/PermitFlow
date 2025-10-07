
import type { PermitPackage, County, Customer, Contractor, Property, PDFTemplate, PermitType } from './types';

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
        id: 'pt_mobile_home',
        name: 'Mobile/Manufactured Home',
        checklist: [
            { text: 'Application Package for Mobile/Manufactured Home Permit' },
            { text: 'Notice of Commencement (if contract > $5,000)' },
            { text: 'HUD Wind Zone 3 Letter from Manufacturer' },
            { text: 'Foundation and Stairs Plans' },
            { text: 'Drainage/Site Plan' },
            { text: 'Survey' },
            { text: 'Drainage Survey (As Built)' },
            { text: 'Tree Permit Application Package (if removing trees)' },
            { text: 'No Public Utility Structures On-Site Affidavit' },
            { text: 'Fire Hydrant Accessibility/Location Affidavit' },
            { text: 'Public Sewer, Private Septic & Water Service Affidavit' },
            { text: 'Subcontractor Worksheet' },
            { text: 'CCU Application or FDOH Septic Permit' },
            { text: 'Elevation Certificate (Final, if in SFHA)' },
            { text: 'No Impact Certification (if in floodway)' },
        ],
    },
    {
        id: 'pt_modular',
        name: 'Modular Home',
        checklist: [
            { text: 'Application for Construction Permit' },
            { text: 'Tree Permit Application Package' },
            { text: 'Notice of Commencement (1 copy signed and recorded): Any improvement for which the direct contract price is greater than $5,000. Must be submitted prior to scheduling the first inspection.' },
            { text: 'Drawings/Plans/Engineering: Proof of Florida DBPR approval. Must convey the full extent of proposed work – legible and of sufficient clarity. Foundation drawings/plans need to be signed and sealed. If applying for a permit in person, plans must be wet or embossed with a signature. If applying for a permit online, plans must be digitally signed and sealed with a third-party verification.' },
            { text: 'Elevation Certificate (Final): Prepared by a registered surveyor, is required if the property is within the Special Flood Hazard Area. The certificate must be submitted for approval prior to requesting any final inspections. The document may be emailed to FloodInfo@CharlotteCountyFL.gov.' },
            { text: 'Drainage/Site Plan: Showing the proposed structure(s), setbacks from the structure to the property lines, seawall, or mean highwater line to the structure, any easements on the property, street names, and existing and proposed ground elevations adjacent to the building, the property lines, and property corners (minimum), as well as the proposed final elevations of the different floor areas. Include one site plan for right-of-way (ROW) review showing proposed driveway.' },
            { text: 'Survey' },
            { text: 'Drainage Survey (As Built): Prepared, signed and sealed by a registered surveyor indicating post-construction elevations. The plan must be submitted for approval prior to requesting any final inspections.' },
            { text: 'Tree Permit Application Package (if removing trees)' },
            { text: 'CCU or State of Florida Department of Health (FDOH): Either a Charlotte County Utilities (CCU) application, an approved septic permit from the FDOH, or a letter from the utility company that provides service to that location' },
            { text: 'No Public Utility Structures On-Site Affidavit' },
            { text: 'Fire Hydrant Accessibility/Location Affidavit' },
            { text: 'Public Sewer, Private Septic & Water Service Affidavit' },
            { text: 'Subcontractor Worksheet: Required if contractor is hiring a subcontractor to perform any electric, mechanical, or plumbing' },
            { text: 'Owner-Builder Disclosure Statement Form (if applicable)' },
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
    subcontractors: [contractors[2], contractors[3], contractors[4]],
    property: properties[0],
    checklist: countyData.find(c => c.name === 'Miami-Dade')?.checklist || [],
    attachments: [],
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
    checklist: countyData.find(c => c.name === 'Orange')?.checklist || [],
    attachments: [],
    createdAt: '2024-07-29T14:30:00Z',
    descriptionOfWork: 'Installation of a new modular home on existing lot.',
    buildingUse: 'Modular Home',
    constructionCost: 150000,
    parcelId: '123-456-789'
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
    checklist: countyData.find(c => c.name === 'Polk')?.checklist || [],
    attachments: [],
    createdAt: '2024-07-30T09:00:00Z',
    descriptionOfWork: 'Site prep and setup for a new manufactured home.',
    buildingUse: 'Manufactured Home',
    constructionCost: 85000,
    parcelId: '987-654-321'
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

    
