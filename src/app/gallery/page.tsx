import { Metadata } from "next";
import { ImageGallery } from "@/components/content/ImageGallery";
import { PageTransition } from "@/components/animation/PageTransition";

export const metadata: Metadata = {
  title: "Photo Gallery | TheHimalayanTrails",
  description:
    "Browse stunning photography from Himalayan treks, peaks, and day hikes. Cinematic landscapes from across Kullu, Manali, Spiti, and beyond.",
  alternates: { canonical: "https://thehimalayantrails.com/gallery" },
  openGraph: {
    title: "Photo Gallery",
    description:
      "Browse stunning photography from Himalayan treks, peaks, and day hikes.",
    url: "https://thehimalayantrails.com/gallery",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Photo Gallery",
    description:
      "Browse stunning photography from Himalayan treks, peaks, and day hikes.",
  },
};

const galleryImages = Array.from(
  { length: 16 },
  (_, i) => `/images/gallery/himalaya-${i + 1}.jpg`
);

export default function GalleryPage() {
  return (
    <PageTransition>
      <section className="container mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
          Photo Gallery
        </h1>
        <p className="text-lg text-foreground/70 mb-10 max-w-2xl">
          A curated collection of photographs from our adventures across the
          Himalayas — towering peaks, alpine meadows, misty valleys, and
          everything in between.
        </p>
        <ImageGallery images={galleryImages} alt="Himalayan landscape" />
      </section>
    </PageTransition>
  );
}
