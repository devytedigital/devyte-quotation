import mongoose, { Schema, Document, Model } from "mongoose";

const ItemSchema = new Schema({
  id: { type: String, required: true },
  description: { type: String, required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  total: { type: Number, required: true },
});

const ClientSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  company: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  address: { type: String, required: true },
  optionalAddress: { type: String },
  state: { type: String, required: true },
  district: { type: String, required: true },
  taxId: { type: String },
  country: { type: String, default: "India" },
});

const QuotationSchema = new Schema(
  {
    quotationNumber: { type: String, required: true, unique: true },
    projectTitle: { type: String },
    date: { type: String, required: true },
    expiryDate: { type: String, required: true },
    client: { type: ClientSchema, required: true },
    items: { type: [ItemSchema], required: true },
    subtotal: { type: Number, required: true },
    tax: { type: Number, required: true },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "reject", "advanced", "delivery", "settled"],
      default: "pending",
    },
    notes: { type: String },
    companyDetails: {
      name: { type: String },
      address: { type: String },
      phone: { type: String },
      email: { type: String },
      website: { type: String },
      district: { type: String },
      state: { type: String },
      country: { type: String },
      taxRate: { type: Number },
    },
  },
  { timestamps: true },
);

export interface IQuotation extends Document {
  quotationNumber: string;
  projectTitle?: string;
  date: string;
  expiryDate: string;
  client: {
    name: string;
    email: string;
    company: string;
    phoneNumber: string;
    address: string;
    optionalAddress?: string;
    state: string;
    district: string;
    taxId?: string;
    country?: string;
  };
  items: any[];
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

const Quotation: Model<IQuotation> =
  mongoose.models.Quotation ||
  mongoose.model<IQuotation>("Quotation", QuotationSchema);

export default Quotation;
