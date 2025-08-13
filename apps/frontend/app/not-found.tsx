import Link from "next/link";

export default function NotFound() {
  return (
    <main className="p-8">
      <h1 className="text-4xl font-bold">404 - Not Found</h1>
      <p className="mt-4">The page you requested could not be found.</p>
      <Link href="/" className="text-blue-600 underline mt-4 inline-block">Return Home</Link>
    </main>
  );
}
