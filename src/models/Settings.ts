import mongoose, { Schema, Document, Model } from "mongoose";

const SettingsSchema = new Schema(
  {
    companyName: { type: String, required: true },
    website: { type: String },
    email: { type: String, required: true },
    phone: { type: String },
    address: { type: String, required: true },
    district: { type: String },
    state: { type: String },
    country: { type: String, default: "India" },
    taxRate: { type: Number, default: 0 },
    currency: { type: String, default: "USD" },
    terms: { type: String },
  },
  { timestamps: true },
);

export interface ISettings extends Document {
  companyName: string;
  website?: string;
  email: string;
  phone?: string;
  address: string;
  district?: string;
  state?: string;
  country?: string;
  taxRate: number;
  currency: string;
  terms?: string;
}

// Delete cached model so schema changes (like adding phone) are always picked up
// during Next.js hot-module-replacement in development.
if (mongoose.models.Settings) {
  delete (mongoose.models as Record<string, unknown>).Settings;
}

const Settings: Model<ISettings> = mongoose.model<ISettings>(
  "Settings",
  SettingsSchema,
);

export default Settings;
