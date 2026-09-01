import type { Metadata } from "next";
import { SafetyClient } from "./SafetyClient";

export const metadata: Metadata = {
  title: "Mountain Terms, Altitude & Safety Guide | The Himalayan Trails",
  description:
    "Comprehensive guide to essential mountain terminology, high altitude physiology, low oxygen effects, AMS/HAPE/HACE prevention and emergency cures, and trail fundamentals.",
  alternates: { canonical: "https://thehimalayantrails.com/safety" },
  openGraph: {
    title: "Mountain Terms, Altitude & Safety Guide",
    description:
      "What is a mountain, peak, trek, hike, summit, glacier, crevasse, ridge, treeline, meadow, and AMS. Complete mountain definitions and altitude safety protocols.",
    url: "https://thehimalayantrails.com/safety",
    type: "website",
  },
};

export default function SafetyPage() {
  return <SafetyClient />;
}
