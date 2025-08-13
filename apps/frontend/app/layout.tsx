import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Analytics from "@/components/Analytics";
import "./globals.css";

const title = "Drone Depot";
const description = "Professional Drone Services Made Simple";

export const viewport = { width: "device-width", initialScale: 1 } as const;

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, images: "/images/og.png" },
  twitter: { card: "summary_large_image", title, description },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="scroll-smooth antialiased bg-neutral-bg text-gray-900">
        <Analytics />
        <header className="flex items-center justify-between p-4">
          <Link href="/">
            <img src="/images/logo.png" alt="Drone Depot logo" className="h-8 w-auto" />
          </Link>
          <Nav />
        </header>
        {children}
        <footer className="mt-16 border-t border-gray-200 bg-neutral-bg p-4 text-center text-sm text-gray-600">
          <div>© Drone-Depot.ai</div>
          <div className="mt-2 flex justify-center gap-4">
            <Link href="/privacy" className="hover:text-electric-cyan">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-electric-cyan">
              Terms
            </Link>
            <Link href="/contact" className="hover:text-electric-cyan">
              Contact
            </Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
