export interface QuotationItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Client {
  name: string;
  email: string;
  company: string;
  phoneNumber: string;
  address: string;
  optionalAddress?: string;
  state: string;
  district: string;
  taxId?: string;
  country: string;
}

export interface Quotation {
  _id?: string;
  id: string;
  quotationNumber: string;
  projectTitle?: string;
  date: string;
  expiryDate: string;
  client: Client;
  items: QuotationItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: "pending" | "reject" | "advanced" | "delivery" | "settled";
  notes?: string;
  companyDetails?: {
    name: string;
    address: string;
    phone?: string;
    email?: string;
    website?: string;
    district?: string;
    state?: string;
    country?: string;
    taxRate?: number;
  };
}
