import SettingsForm from "@/components/SettingsForm";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
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
          System <span className="text-gradient">Settings</span>
        </h1>
        <p className="text-muted-foreground">
          Configure your company identity and default quotation preferences.
        </p>
      </div>

      <SettingsForm />
    </div>
  );
}
