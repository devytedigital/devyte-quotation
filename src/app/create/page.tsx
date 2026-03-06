import QuotationForm from "@/components/QuotationForm";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function CreateQuotation() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col gap-2">
        <Link
          href="/"
          className="text-sm text-primary flex items-center gap-1 hover:underline w-fit"
        >
          <ChevronLeft size={16} /> Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">
          Create New <span className="text-gradient">Quotation</span>
        </h1>
        <p className="text-muted-foreground">
          Fill in the details below to generate a professional quotation.
        </p>
      </div>

      <QuotationForm />
    </div>
  );
}
