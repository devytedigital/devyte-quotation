"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Save,
  Send,
  Eye,
  CheckCircle2,
  FileText,
} from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Quotation, QuotationItem } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function QuotationForm() {
  const router = useRouter();
  const [items, setItems] = useState<QuotationItem[]>([
    { id: "1", description: "", quantity: 1, unitPrice: 0, total: 0 },
  ]);
  const [client, setClient] = useState({
    name: "",
    email: "",
    company: "",
    phoneNumber: "",
    address: "",
    optionalAddress: "",
    state: "",
    district: "",
    taxId: "",
    country: "India",
  });
  const [projectTitle, setProjectTitle] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isDirty, setIsDirty] = useState(true);
  const [currentQuotationId, setCurrentQuotationId] = useState<string | null>(
    null,
  );
  const [notes, setNotes] = useState("");
  const [settings, setSettings] = useState({
    taxRate: 15, // Default if fetch fails
    companyName: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    district: "",
    state: "",
    country: "India",
    currency: "USD",
  });

  useEffect(() => {
    // Fetch default settings
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data._id) {
          setSettings({
            taxRate: Number(data.taxRate),
            companyName: data.companyName,
            address: data.address,
            phone: data.phone || "",
            email: data.email || "",
            website: data.website || "",
            district: data.district || "",
            state: data.state || "",
            country: data.country || "India",
            currency: data.currency || "USD",
          });
          if (data.bankAccountNumber) {
            // bankAccountNumber removed from state, ignore or handle differently
          }
          if (data.terms) {
            setNotes(data.terms);
          }
        }
      })
      .catch((err) => console.error("Error fetching settings:", err));
  }, []);

  const handleSave = async () => {
    setLoading(true);
    const quotationData = {
      quotationNumber: "QUO-" + Math.floor(1000 + Math.random() * 9000),
      date: format(new Date(), "dd/MM/yyyy"),
      expiryDate: format(
        new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        "dd/MM/yyyy",
      ),
      client,
      items,
      subtotal,
      tax,
      total,
      status: "pending",
      projectTitle,
      notes,
      // Pass settings along so they are pinned for this quotation
      companyDetails: {
        name: settings.companyName,
        address: settings.address,
        phone: settings.phone,
        email: settings.email,
        website: settings.website,
        district: settings.district,
        state: settings.state,
        country: settings.country,
        taxRate: settings.taxRate,
      },
    };

    try {
      const res = await fetch("/api/quotations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quotationData),
      });

      if (res.ok) {
        const savedData = await res.json();
        if (savedData._id) {
          setCurrentQuotationId(savedData._id);
        }
        setSaved(true);
        setIsSaved(true);
        setIsDirty(false);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error("Error saving quotation:", error);
    } finally {
      setLoading(false);
    }
  };

  const addItem = () => {
    const newItem: QuotationItem = {
      id: Math.random().toString(36).substr(2, 9),
      description: "",
      quantity: 1,
      unitPrice: 0,
      total: 0,
    };
    setItems([...items, newItem]);
    setIsDirty(true);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
      setIsDirty(true);
    }
  };

  const updateItem = (
    id: string,
    field: keyof QuotationItem,
    value: string | number,
  ) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const val =
            field === "quantity" || field === "unitPrice"
              ? Number(value)
              : value;
          const updatedItem = { ...item, [field]: val };
          if (field === "quantity" || field === "unitPrice") {
            updatedItem.total =
              Number(updatedItem.quantity) * Number(updatedItem.unitPrice);
          }
          return updatedItem as QuotationItem;
        }
        return item;
      }),
    );
    setIsDirty(true);
  };

  const subtotal = items.reduce((acc, item) => acc + item.total, 0);
  const tax = subtotal * (settings.taxRate / 100);
  const total = subtotal + tax;

  const isValid =
    client.name.trim() !== "" &&
    client.email.trim() !== "" &&
    client.company.trim() !== "" &&
    client.phoneNumber.trim() !== "" &&
    client.address.trim() !== "" &&
    client.state.trim() !== "" &&
    client.district.trim() !== "" &&
    projectTitle.trim() !== "" &&
    items.length > 0 &&
    items.every((item) => item.description.trim() !== "" && item.unitPrice > 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Form Section */}
      <div className="lg:col-span-2 space-y-8">
        <section className="bg-card border border-border rounded-2xl p-6 space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <span className="w-2 h-6 bg-primary rounded-full" />
            Client Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium opacity-70">
                Client Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={client.name}
                onChange={(e) => {
                  setClient({ ...client, name: e.target.value });
                  setIsDirty(true);
                }}
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                placeholder="e.g. John Doe"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium opacity-70">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={client.company}
                onChange={(e) => {
                  setClient({ ...client, company: e.target.value });
                  setIsDirty(true);
                }}
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                placeholder="e.g. Acme Inc."
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium opacity-70">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={client.email}
                onChange={(e) => {
                  setClient({ ...client, email: e.target.value });
                  setIsDirty(true);
                }}
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                placeholder="john@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium opacity-70">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={client.phoneNumber}
                onChange={(e) => {
                  setClient({ ...client, phoneNumber: e.target.value });
                  setIsDirty(true);
                }}
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                placeholder="+1 (555) 000-0000"
                required
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium opacity-70">
                Company Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={client.address}
                onChange={(e) => {
                  setClient({ ...client, address: e.target.value });
                  setIsDirty(true);
                }}
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                placeholder="Street Address, Building, etc."
                required
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium opacity-70">
                Optional Address
              </label>
              <input
                type="text"
                value={client.optionalAddress}
                onChange={(e) => {
                  setClient({ ...client, optionalAddress: e.target.value });
                  setIsDirty(true);
                }}
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                placeholder="Apartment, suite, unit, etc."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium opacity-70">
                District <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={client.district}
                onChange={(e) => {
                  setClient({ ...client, district: e.target.value });
                  setIsDirty(true);
                }}
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                placeholder="e.g. Malappuram"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium opacity-70">
                State <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={client.state}
                onChange={(e) => {
                  setClient({ ...client, state: e.target.value });
                  setIsDirty(true);
                }}
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                placeholder="e.g. Kerala"
                required
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium opacity-70">Country</label>
              <select
                value={client.country}
                onChange={(e) => {
                  setClient({ ...client, country: e.target.value });
                  setIsDirty(true);
                }}
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
              >
                <option value="India">🇮🇳 India</option>
                <option value="United States">🇺🇸 United States</option>
                <option value="United Kingdom">🇬🇧 United Kingdom</option>
                <option value="United Arab Emirates">
                  🇦🇪 United Arab Emirates
                </option>
                <option value="Canada">🇨🇦 Canada</option>
                <option value="Australia">🇦🇺 Australia</option>
                <option value="Germany">🇩🇪 Germany</option>
                <option value="France">🇫🇷 France</option>
                <option value="Singapore">🇸🇬 Singapore</option>
                <option value="Malaysia">🇲🇾 Malaysia</option>
                <option value="Bangladesh">🇧🇩 Bangladesh</option>
                <option value="Pakistan">🇵🇰 Pakistan</option>
                <option value="Sri Lanka">🇱🇰 Sri Lanka</option>
                <option value="Nepal">🇳🇵 Nepal</option>
                <option value="Other">🌍 Other</option>
              </select>
            </div>
          </div>
        </section>

        <section className="bg-card border border-border rounded-2xl p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <span className="w-2 h-6 bg-secondary rounded-full" />
              Services & Items
            </h3>
            <button
              onClick={addItem}
              className="text-xs font-bold uppercase tracking-widest text-primary hover:opacity-80 transition-opacity flex items-center gap-1"
            >
              <Plus size={16} /> Add Item
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium opacity-70">
              Project Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={projectTitle}
              onChange={(e) => {
                setProjectTitle(e.target.value);
                setIsDirty(true);
              }}
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/50 outline-none transition-all font-semibold"
              placeholder="e.g. E-commerce Platform Suite"
              required
            />
          </div>

          <div className="space-y-4">
            <AnimatePresence initial={false}>
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group grid grid-cols-12 gap-4 items-start bg-background/50 border border-border p-4 rounded-xl relative"
                >
                  <div className="col-span-12 md:col-span-6 space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">
                      Description
                    </label>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) =>
                        updateItem(item.id, "description", e.target.value)
                      }
                      className="w-full bg-transparent border-none p-0 focus:ring-0 outline-none text-sm"
                      placeholder="UI/UX Design Services..."
                    />
                  </div>
                  <div className="col-span-4 md:col-span-2 space-y-2 text-center">
                    <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">
                      Qty
                    </label>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(item.id, "quantity", e.target.value)
                      }
                      className="w-full bg-transparent border-none p-0 text-center focus:ring-0 outline-none text-sm"
                    />
                  </div>
                  <div className="col-span-4 md:col-span-2 space-y-2 text-right">
                    <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">
                      Price
                    </label>
                    <input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) =>
                        updateItem(item.id, "unitPrice", e.target.value)
                      }
                      className="w-full bg-transparent border-none p-0 text-right focus:ring-0 outline-none text-sm font-semibold"
                    />
                  </div>
                  <div className="col-span-4 md:col-span-2 space-y-2 text-right">
                    <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">
                      Total
                    </label>
                    <div className="text-sm font-bold text-gradient">
                      ₹ {item.total.toLocaleString()}
                    </div>
                  </div>

                  {items.length > 1 && (
                    <button
                      onClick={() => removeItem(item.id)}
                      className="absolute -right-2 -top-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>

        {/* Notes & Terms */}
        <section className="bg-accent/5 border border-accent/20 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center">
              <FileText className="text-accent" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold">Terms & Conditions</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                Customizable per quotation
              </p>
            </div>
          </div>
          <div className="space-y-4 pt-2">
            <textarea
              value={notes}
              onChange={(e) => {
                setNotes(e.target.value);
                setIsDirty(true);
              }}
              rows={6}
              className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-accent/50 outline-none transition-all text-sm resize-y shadow-inner"
              placeholder="Enter any terms, conditions, payment instructions, etc."
            />
          </div>
        </section>
      </div>

      {/* Summary Section */}
      <div className="space-y-6">
        <section className="bg-primary/5 border border-primary/20 rounded-2xl p-6 sticky top-24">
          <h3 className="text-lg font-bold mb-4">Quotation Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm opacity-70">
              <span>Subtotal</span>
              <span>₹ {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm opacity-70">
              <span>Tax ({settings.taxRate}%)</span>
              <span>₹ {tax.toLocaleString()}</span>
            </div>
            <div className="h-px bg-primary/20 my-2" />
            <div className="flex justify-between items-end">
              <span className="font-semibold text-primary">Grand Total</span>
              <span className="text-2xl font-bold">
                ₹ {total.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="space-y-3 mt-8">
            {!isSaved || isDirty ? (
              <button
                onClick={handleSave}
                disabled={loading || !isValid}
                className={cn(
                  "w-full btn-primary flex items-center justify-center gap-2 py-3",
                  (loading || !isValid) && "opacity-50 cursor-not-allowed",
                )}
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : saved ? (
                  <CheckCircle2 size={18} />
                ) : (
                  <Save size={18} />
                )}
                {loading
                  ? "Saving..."
                  : saved
                    ? "Quotation Saved"
                    : !isSaved
                      ? "Save Quotation"
                      : "Save Update"}
              </button>
            ) : (
              <button
                onClick={() => {
                  if (currentQuotationId) {
                    window.open(`/preview/${currentQuotationId}`, "_blank");
                  }
                }}
                className="w-full flex items-center justify-center gap-2 py-3 bg-secondary text-secondary-foreground rounded-xl hover:opacity-90 transition-all font-bold shadow-lg shadow-secondary/20"
              >
                <Eye size={18} /> Preview Quotation
              </button>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
