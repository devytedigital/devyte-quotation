"use client";

import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  TrendingUp,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Quotation } from "@/lib/types";

export default function Home() {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);

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

  const totalAmount = quotations.reduce((acc, q) => acc + q.total, 0);
  const pendingCount = quotations.filter((q) => q.status === "pending").length;
  const settledCount = quotations.filter((q) => q.status === "settled").length;
  const advancedCount = quotations.filter(
    (q) => q.status === "advanced",
  ).length;
  const deliveryCount = quotations.filter(
    (q) => q.status === "delivery",
  ).length;
  const rejectCount = quotations.filter((q) => q.status === "reject").length;

  const stats = [
    {
      label: "Total Revenue",
      value: `₹${totalAmount.toLocaleString()}`,
      icon: <Clock className="text-primary" />,
      trend: `Count: ${quotations.length}`,
    },
    {
      label: "Pending",
      value: pendingCount.toString(),
      icon: <AlertCircle className="text-accent" />,
      trend: "Action needed",
    },
    {
      label: "Settled",
      value: settledCount.toString(),
      icon: <CheckCircle2 className="text-emerald-500" />,
      trend: "Recent success",
    },
    {
      label: "Advanced",
      value: advancedCount.toString(),
      icon: <TrendingUp className="text-blue-500" />,
      trend: "Growth focused",
    },
    {
      label: "Delivery",
      value: deliveryCount.toString(),
      icon: <Truck className="text-indigo-500" />,
      trend: "In progress",
    },
    {
      label: "Rejected",
      value: rejectCount.toString(),
      icon: <XCircle className="text-rose-500" />,
      trend: "Review needed",
    },
  ];

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-card border border-border p-8 md:p-12">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-4 max-w-xl">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold tracking-tight"
            >
              Streamline Your <span className="text-gradient">Quotations</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-muted-foreground opacity-80"
            >
              Professional, automated, and beautiful quotes for your software
              company. win more clients with premium presentation.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="pt-4"
            >
              <Link
                href="/create"
                className="btn-primary inline-flex items-center gap-2 group"
              >
                Create New Quotation
                <Plus
                  size={20}
                  className="group-hover:rotate-90 transition-transform"
                />
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="w-full md:w-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {stats.map((stat, i) => (
              <div
                key={i}
                className="glass-morphism p-6 rounded-2xl flex flex-col gap-2"
              >
                <div className="flex justify-between items-start">
                  <div className="p-2 rounded-lg bg-background/50">
                    {stat.icon}
                  </div>
                  <span className="text-xs font-bold text-primary">
                    {stat.trend}
                  </span>
                </div>
                <div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-widest">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <h2 className="text-2xl font-bold tracking-tight">
            Recent Quotations
          </h2>
          <div className="flex gap-2">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={16}
              />
              <input
                type="text"
                placeholder="Search..."
                className="bg-card border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <button className="p-2 rounded-lg bg-card border border-border hover:bg-border/50 transition-colors">
              <Filter size={18} />
            </button>
          </div>
        </div>

        <div className="grid gap-4">
          {loading ? (
            <div className="flex justify-center p-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : quotations.length === 0 ? (
            <div className="text-center p-12 bg-card border border-border rounded-2xl border-dashed">
              <p className="text-muted-foreground">No quotations found yet.</p>
              <Link
                href="/create"
                className="text-primary hover:underline text-sm font-semibold mt-2 inline-block"
              >
                Create your first quote
              </Link>
            </div>
          ) : (
            quotations.map((quote, i) => (
              <motion.div
                key={quote._id || quote.id || i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  href={`/preview/${quote._id || quote.id}`}
                  className="group bg-card border border-border p-4 rounded-xl flex items-center justify-between hover:border-primary/50 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                      {quote.client.name[0]}
                    </div>
                    <div>
                      <div className="font-semibold group-hover:text-primary transition-colors">
                        {quote.projectTitle || quote.client.company}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {quote.client.company} • {quote.quotationNumber} •{" "}
                        {quote.date}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <div className="font-bold">
                        ₹ {quote.total.toLocaleString()}
                      </div>
                      <div
                        className={`text-[10px] px-2 py-0.5 rounded-full inline-block uppercase font-bold ${
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
                        {quote.status}
                      </div>
                    </div>
                    <ArrowUpRight className="text-muted-foreground group-hover:text-primary transition-all opacity-0 group-hover:opacity-100" />
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
