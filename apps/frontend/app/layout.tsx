import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

const title = "Drone Depot";
const description = "Professional Drone Services Made Simple";

export const viewport = { width: "device-width", initialScale: 1 } as const;

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description },
  twitter: { card: "summary_large_image", title, description },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="scroll-smooth antialiased bg-neutral-bg text-gray-900">
        <header className="flex items-center justify-between p-4">
          <Link href="/">
            <img src="/images/logo.png" alt="Drone Depot logo" className="h-8 w-auto" />
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="#how" className="hover:text-electric-cyan">
              How It Works
            </Link>
            <Link href="#plans" className="hover:text-electric-cyan">
              Plans
            </Link>
            <Link href="#contact" className="hover:text-electric-cyan">
              Contact
            </Link>
            <Link
              href="/contact"
              className="rounded bg-brand-purple px-4 py-2 text-white hover:bg-brand-purple/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-purple"
            >
              Get Started
            </Link>
          </nav>
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
