import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import { FileText, PlusCircle, LayoutDashboard, Settings } from "lucide-react";
import Link from "next/link";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Devyte | Premium Software Quotation Engine",
  description:
    "Professional quotation making tool for software companies and freelancers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${outfit.variable} ${inter.variable} antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <FileText className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-gradient">
                Devyte
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/"
                className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2"
              >
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
              <Link
                href="/preview"
                className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2"
              >
                <PlusCircle size={18} />
                Quotations
              </Link>
              <Link
                href="/settings"
                className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2"
              >
                <Settings size={18} />
                Settings
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <Link href="/create">
                <button className="btn-primary py-2 px-4 text-sm">
                  Create Quotation
                </button>
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1 container mx-auto px-4 py-8">{children}</main>

        <footer className="border-t border-border py-8 bg-card/30 mt-auto">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm text-muted-foreground opacity-60">
              © {new Date().getFullYear()} Devyte Quotation Engine. Build for
              Growth.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
