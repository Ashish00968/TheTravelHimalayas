import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404 — Trail Not Found",
  description: "The requested Himalayan trail, summit profile, or field guide could not be located.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="font-heading text-6xl md:text-8xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-4">
        Page Not Found
      </h2>
      <p className="text-foreground/70 mb-8 max-w-md">
        The trail you&apos;re looking for doesn&apos;t exist. It may have been moved or the URL might be incorrect.
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors min-h-[44px] min-w-[44px]"
      >
        Back to Home
      </Link>
    </div>
  );
}
