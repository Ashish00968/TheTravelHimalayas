"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global runtime error:", error);
  }, [error]);

  return (
    <html lang="en" className="dark">
      <body className="bg-[#050608] text-white min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full p-8 rounded-3xl bg-[#0f1218] border border-white/10 text-center shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-4 text-red-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          
          <h2 className="text-2xl font-bold mb-2">
            Application Error
          </h2>
          
          <p className="text-sm text-white/60 mb-6 font-light">
            A critical error occurred while rendering the page.
          </p>

          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0066cc] hover:bg-[#0052a3] text-white text-xs font-semibold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reload Application
          </button>
        </div>
      </body>
    </html>
  );
}
