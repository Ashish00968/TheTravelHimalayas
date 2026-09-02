import type { Metadata } from "next";
import { Sora, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { SITE } from "@/lib/site";
import { buildOrganizationJsonLd, buildWebSiteJsonLd, serializeJsonLd } from "@/lib/json-ld";
import { ThemeScript } from "@/components/theme/ThemeScript";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "The Himalayan Trails | Himalayan Trekking & Expedition Guides",
    template: "%s | The Himalayan Trails",
  },
  description: SITE.description,
  keywords: [
    "Himalayan treks",
    "Manali trekking",
    "Kullu valley treks",
    "Himachal Pradesh trekking",
    "Beas Kund trek",
    "Himalayan expeditions",
    "trekking guides India",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE.name,
    url: SITE.url,
    title: "The Himalayan Trails | Himalayan Trekking & Expedition Guides",
    description: SITE.description,
    images: [{ url: SITE.ogImage, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Himalayan Trails",
    description: SITE.description,
    images: [SITE.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [buildOrganizationJsonLd(), buildWebSiteJsonLd()],
  };

  return (
    <html lang="en" suppressHydrationWarning className={cn(sora.variable, hanken.variable, "font-sans selection:bg-primary/30 selection:text-white")}>
      <head>
        <ThemeScript />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
        />
      </head>
      <body className="bg-background text-foreground font-sans pt-20">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg focus:text-sm focus:font-medium interactive-button"
        >
          Skip to main content
        </a>
        <Navigation />
        <main id="main-content" className="min-h-screen">
          {children}
        </main>
        {/* Floating Theme Controller on Left Side */}
        <ThemeToggle variant="floating" />
        <Footer />
      </body>
    </html>
  );
}
