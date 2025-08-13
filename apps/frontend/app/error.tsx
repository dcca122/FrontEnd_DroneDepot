"use client";
import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <main className="p-8">
      <h1 className="text-4xl font-bold">Something went wrong</h1>
      <p className="mt-4">An unexpected error occurred.</p>
      <button onClick={reset} className="mt-4 text-blue-600 underline">
        Try again
      </button>
    </main>
  );
}
