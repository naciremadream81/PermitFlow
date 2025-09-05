export type Status = 'Draft' | 'In Progress' | 'Submitted' | 'Approved' | 'Rejected';

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
};

export type Contractor = {
  id:string;
  name: string;
  licenseNumber: string;
  email: string;
  phone: string;
};

export type Property = {
  id: string;
  address: string;
  city: string;
  zip: string;
};

export type ChecklistItem = {
  id: string;
  text: string;
  completed: boolean;
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
  property: Property;
  checklist: ChecklistItem[];
  attachments: File[];
  createdAt: string;
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
  checklist: Omit<ChecklistItem, 'id' | 'completed'>[];
};
