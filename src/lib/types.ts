
export type Status = 'Draft' | 'In Progress' | 'Submitted' | 'Approved' | 'Rejected';

export type Address = {
  street: string;
  city: string;
  state: string;
  zip: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: Address;
};

export type Contractor = {
  id:string;
  name: string;
  licenseNumber: string;
  trade: string;
  email: string;
  phone: string;
  fax?: string;
  address: Address;
};

export type Property = {
  id: string;
  parcelId: string;
  address: Address;
  unit?: string;
  building?: string;
};

export type ChecklistItem = {
  id: string;
  text: string;
  completed: boolean;
  attachments?: File[];
};

export type County = {
  name: string;
  checklist: ChecklistItem[];
};

export type PermitPackage = {
  id: string;
  packageName: string;
  status: Status;
  county: string;
  customer: Customer;
  contractor: Contractor;
  subcontractors?: Contractor[];
  property: Property;
  standardChecklist: ChecklistItem[];
  countyChecklist: ChecklistItem[];
  createdAt: string;
  // New fields from permit application
  descriptionOfWork: string;
  buildingUse: string;
  constructionCost: number;
  acTons?: number;
  heatKw?: number;
  septicPermitOrSewerCompany?: string;
  electricalServiceAmps?: number;
  waterServiceSource?: string;
};

export type PDFTemplate = {
  id: string;
  name: string;
  description: string;
  dataUri: string;
};

export type PermitType = {
  id: string;
  name: string;
};

export type BareChecklistItem = Omit<ChecklistItem, 'id' | 'completed' | 'attachments'>;

export interface CountyPermitChecklists {
  [county: string]: {
    [permitTypeId: string]: BareChecklistItem[];
  };
}
