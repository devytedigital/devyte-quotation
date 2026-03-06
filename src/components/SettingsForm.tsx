"use client";

import React, { useState } from "react";
import {
  Save,
  Building2,
  Globe,
  Phone,
  Mail,
  MapPin,
  Percent,
  DollarSign,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function SettingsForm() {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    companyName: "",
    website: "",
    email: "",
    phone: "",
    address: "",
    district: "",
    state: "",
    country: "India",
    taxRate: "0",
    currency: "USD",
    defaultTerms: "",
  });

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data._id) {
          setFormData({
            companyName: data.companyName,
            website: data.website || "",
            email: data.email,
            phone: data.phone || "",
            address: data.address,
            district: data.district || "",
            state: data.state || "",
            country: data.country || "India",
            taxRate: data.taxRate.toString(),
            currency: data.currency,
            defaultTerms: data.terms || "",
          });
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching settings:", err);
        setLoading(false);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          taxRate: parseFloat(formData.taxRate),
          terms: formData.defaultTerms,
        }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-8 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Company Profile */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-card border border-border rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Building2 className="text-primary" size={24} />
              Company Profile
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold opacity-70">
                  Company Name
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) =>
                    setFormData({ ...formData, companyName: e.target.value })
                  }
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold opacity-70">
                  Website
                </label>
                <div className="relative">
                  <Globe
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={18}
                  />
                  <input
                    type="text"
                    value={formData.website}
                    onChange={(e) =>
                      setFormData({ ...formData, website: e.target.value })
                    }
                    className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold opacity-70">
                  Official Email
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={18}
                  />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold opacity-70">
                  Business Phone
                </label>
                <div className="relative">
                  <Phone
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={18}
                  />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold opacity-70">
                  Business Address
                </label>
                <div className="relative">
                  <MapPin
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={18}
                  />
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold opacity-70">
                  District
                </label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) =>
                    setFormData({ ...formData, district: e.target.value })
                  }
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                  placeholder="e.g. Malappuram"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold opacity-70">
                  State
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) =>
                    setFormData({ ...formData, state: e.target.value })
                  }
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                  placeholder="e.g. Kerala"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold opacity-70">
                  Country
                </label>
                <select
                  value={formData.country}
                  onChange={(e) =>
                    setFormData({ ...formData, country: e.target.value })
                  }
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
                  <option value="Singapore">🇸🇬 Singapore</option>
                  <option value="Malaysia">🇲🇾 Malaysia</option>
                  <option value="Other">🌍 Other</option>
                </select>
              </div>
            </div>
          </section>

          {/* Quotation Defaults */}
          <section className="bg-card border border-border rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Percent className="text-secondary" size={24} />
              Quotation Defaults
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold opacity-70">
                  Default Tax Rate (%)
                </label>
                <input
                  type="number"
                  value={formData.taxRate}
                  onChange={(e) =>
                    setFormData({ ...formData, taxRate: e.target.value })
                  }
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold opacity-70">
                  Currency Code
                </label>
                <div className="relative">
                  <DollarSign
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={18}
                  />
                  <select
                    value={formData.currency}
                    onChange={(e) =>
                      setFormData({ ...formData, currency: e.target.value })
                    }
                    className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-primary/50 outline-none transition-all appearance-none"
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="INR">INR - Indian Rupee</option>
                  </select>
                </div>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-semibold opacity-70">
                  Default Terms & Conditions
                </label>
                <textarea
                  rows={4}
                  value={formData.defaultTerms}
                  onChange={(e) =>
                    setFormData({ ...formData, defaultTerms: e.target.value })
                  }
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none transition-all resize-none text-sm"
                />
              </div>
            </div>
          </section>
        </div>

        {/* Action Sidebar */}
        <div className="space-y-6">
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 sticky top-24 space-y-6">
            <div className="space-y-2 text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="text-primary" size={32} />
              </div>
              <h3 className="font-bold">Settings Sync</h3>
              <p className="text-xs text-muted-foreground opacity-70">
                Your settings are automatically synced to all new quotations you
                create.
              </p>
            </div>

            <button
              type="submit"
              className="w-full btn-primary flex items-center justify-center gap-2 py-3"
            >
              {saved ? <CheckCircle2 size={18} /> : <Save size={18} />}
              {saved ? "Changes Saved" : "Save Settings"}
            </button>
            <p className="text-[10px] text-center text-muted-foreground opacity-50 uppercase tracking-widest">
              Last synced: Just now
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}
