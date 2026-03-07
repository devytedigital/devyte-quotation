"use client";

import React, { useEffect, useState, useRef } from "react";
import QuotationPreview from "@/components/QuotationPreview";
import { Quotation } from "@/lib/types";
import {
  Printer,
  ArrowLeft,
  Download,
  CheckCircle2,
  Clock,
  Send as SendIcon,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import jsPDF from "jspdf";

export default function DynamicPreviewPage() {
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<Quotation | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      fetch(`/api/quotations/${id}`)
        .then((res) => res.json())
        .then((fetchedData) => {
          if (!fetchedData.error) {
            setData(fetchedData);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleDownload = async () => {
    if (!previewRef.current || !data) return;
    setDownloading(true);
    setIsExporting(true);

    try {
      // Small delay to allow the DOM to update with isExporting styles
      await new Promise((resolve) => setTimeout(resolve, 100));

      const { toCanvas } = await import("html-to-image");
      const element = previewRef.current;

      // Capture the component using native browser rendering (supports oklab/oklch)
      const canvas = await toCanvas(element, {
        pixelRatio: 3, // Ultra-high resolution for crystal clear text
        backgroundColor: "#ffffff",
        cacheBust: true,
      });

      const imgData = canvas.toDataURL("image/png");

      // Use a temporary PDF instance to get image properties safely
      const tempPdf = new jsPDF();
      const imgProps = tempPdf.getImageProperties(imgData);

      // Calculate dynamic PDF height in inches based on the A4 width (8.27in)
      const pdfWidth = 8.27;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      // Initialize the actual jsPDF with the dynamic height
      const pdf = new jsPDF("p", "in", [pdfWidth, pdfHeight]);

      pdf.addImage(
        imgData,
        "PNG",
        0,
        0,
        pdfWidth,
        pdfHeight,
        undefined,
        "NONE",
      );

      pdf.save(`Quotation_${data.quotationNumber || "Preview"}.pdf`);
    } catch (error) {
      console.error("PDF Generation Error:", error);
    } finally {
      setDownloading(false);
      setIsExporting(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/quotations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const updated = await res.json();
        setData(updated);
      }
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] flex-col gap-4">
        <p className="text-muted-foreground font-medium">
          No quotation data found to preview.
        </p>
        <Link href="/" className="text-primary hover:underline font-semibold">
          Go back to dashboard
        </Link>
      </div>
    );
  }

  const statusConfig = {
    pending: { icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
    reject: { icon: AlertTriangle, color: "text-rose-500", bg: "bg-rose-50" },
    advanced: { icon: CheckCircle2, color: "text-blue-500", bg: "bg-blue-50" },
    delivery: { icon: Clock, color: "text-indigo-500", bg: "bg-indigo-50" },
    settled: {
      icon: CheckCircle2,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
    },
  };

  const CurrentStatusIcon =
    statusConfig[data.status as keyof typeof statusConfig]?.icon || Clock;

  return (
    <div className="min-h-screen bg-slate-100 pb-24">
      <div className="space-y-8 print:space-y-0 p-8 print:p-0">
        <div className="flex justify-between items-center print:hidden max-w-[850px] mx-auto mb-8">
          <Link
            href="/"
            className="group text-sm flex items-center gap-2 text-slate-700 hover:text-primary transition-all font-bold"
          >
            <div className="w-8 h-8 rounded-full bg-white border border-border flex items-center justify-center group-hover:border-primary/30 group-hover:bg-primary/5">
              <ArrowLeft size={16} />
            </div>
            Back to Dashboard
          </Link>

          <div
            className={`print:hidden px-4 py-1.5 rounded-full border border-current/20 flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${statusConfig[data.status as keyof typeof statusConfig]?.color} ${statusConfig[data.status as keyof typeof statusConfig]?.bg}`}
          >
            <CurrentStatusIcon size={14} />
            {data.status}
          </div>
        </div>

        <div
          className={
            isExporting
              ? "bg-white"
              : "print:m-0 shadow-2xl shadow-slate-200/50"
          }
          ref={previewRef}
        >
          <QuotationPreview data={data} isExporting={isExporting} />
        </div>
      </div>

      {/* ── Bottom Action Bar (Dark Theme) ── */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0f172a] shadow-[0_-8px_30px_rgba(0,0,0,0.3)] border-t border-slate-800 p-5 print:hidden z-50">
        <div className="max-w-[850px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] absolute -top-2.5 left-3 bg-[#0f172a] px-2 py-0.5">
                Update Status
              </label>
              <select
                value={data.status}
                disabled={updating}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="w-full sm:w-56 bg-slate-800/50 border border-slate-700 rounded-xl px-5 py-3 text-sm font-bold text-white focus:ring-2 focus:ring-blue-500/40 outline-none transition-all appearance-none cursor-pointer hover:bg-slate-800"
              >
                <option value="pending" className="bg-slate-900">
                  ⏳ PENDING
                </option>
                <option value="reject" className="bg-slate-900">
                  ❌ REJECT
                </option>
                <option value="advanced" className="bg-slate-900">
                  📈 ADVANCED
                </option>
                <option value="delivery" className="bg-slate-900">
                  🚚 DELIVERY
                </option>
                <option value="settled" className="bg-slate-900">
                  💰 SETTLED
                </option>
              </select>
            </div>
            {updating && (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400"></div>
            )}
          </div>

          <button
            onClick={handleDownload}
            disabled={downloading}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-3 bg-white text-[#0f172a] rounded-xl hover:bg-slate-100 transition-all text-sm font-black shadow-xl shadow-white/5 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 group"
          >
            {downloading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#0f172a]"></div>
            ) : (
              <Download
                size={20}
                className="group-hover:-translate-y-0.5 transition-transform"
              />
            )}
            {downloading ? "GENERATING..." : "DOWNLOAD PDF"}
          </button>
        </div>
      </div>
    </div>
  );
}
