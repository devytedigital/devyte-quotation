"use client";

import { motion } from "framer-motion";
import {
  Search,
  Filter,
  ArrowUpRight,
  Plus,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Quotation } from "@/lib/types";

export default function QuotationsListPage() {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("/api/quotations")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setQuotations(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching quotations:", err);
        setLoading(false);
      });
  }, []);

  const filteredQuotations = quotations.filter((quote) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      quote.client.name.toLowerCase().includes(searchLower) ||
      quote.client.company.toLowerCase().includes(searchLower) ||
      (quote.projectTitle &&
        quote.projectTitle.toLowerCase().includes(searchLower)) ||
      quote.quotationNumber.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            Manage <span className="text-gradient">Quotations</span>
          </h1>
          <p className="text-muted-foreground text-sm">
            Overview of all your software project quotations and their status.
          </p>
        </div>
        <Link
          href="/create"
          className="btn-primary inline-flex items-center gap-2"
        >
          <Plus size={20} />
          Create New
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by client, project, or quotation number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-3 bg-card border border-border rounded-xl hover:bg-border/50 transition-colors text-sm font-medium">
          <Filter size={18} />
          Filters
        </button>
      </div>

      {/* List */}
      <div className="grid gap-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-24 bg-card/50 border border-border border-dashed rounded-3xl gap-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            <p className="text-muted-foreground animate-pulse">
              Loading quotations...
            </p>
          </div>
        ) : filteredQuotations.length === 0 ? (
          <div className="text-center p-24 bg-card border border-border border-dashed rounded-3xl">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="text-primary w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">No quotations found</h3>
            <p className="text-muted-foreground mb-6 max-w-xs mx-auto text-sm">
              We couldn't find any quotations matching your criteria. Try
              creating a new one!
            </p>
            <Link
              href="/create"
              className="btn-primary inline-flex items-center gap-2 py-2.5 px-6"
            >
              <Plus size={18} />
              Create First Quotation
            </Link>
          </div>
        ) : (
          filteredQuotations.map((quote, i) => (
            <motion.div
              key={quote._id || quote.id || i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={`/preview/${quote._id || quote.id}`}
                className="group bg-card border border-border p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between hover:border-primary/40 hover:bg-primary/[0.02] transition-all cursor-pointer gap-4 relative overflow-hidden"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-300" />

                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                    {quote.client.name[0].toUpperCase()}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 font-bold text-lg group-hover:text-primary transition-colors">
                      {quote.projectTitle || "Software Services"}
                      <span className="text-[10px] text-muted-foreground font-normal tracking-widest uppercase border border-border px-1.5 py-0.5 rounded">
                        {quote.quotationNumber}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className="font-medium text-foreground">
                        {quote.client.company}
                      </span>
                      <span className="opacity-40">•</span>
                      <span>{quote.date}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-10">
                  <div className="text-right">
                    <div className="text-xl font-bold text-primary">
                      ₹ {quote.total.toLocaleString()}
                    </div>
                    <div
                      className={`text-[10px] px-2.5 py-1 rounded-full inline-flex items-center gap-1 uppercase font-black tracking-widest ${
                        quote.status === "settled"
                          ? "bg-green-500/10 text-green-500"
                          : quote.status === "pending"
                            ? "bg-accent/10 text-accent"
                            : quote.status === "advanced"
                              ? "bg-blue-500/10 text-blue-500"
                              : quote.status === "delivery"
                                ? "bg-indigo-500/10 text-indigo-500"
                                : "bg-rose-500/10 text-rose-500"
                      }`}
                    >
                      {quote.status === "settled" && <CheckCircle2 size={10} />}
                      {quote.status === "pending" && <Clock size={10} />}
                      {quote.status}
                    </div>
                  </div>
                  <div className="bg-background group-hover:bg-primary group-hover:text-white p-2 rounded-xl transition-all shadow-sm border border-border group-hover:border-primary">
                    <ArrowUpRight size={20} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
