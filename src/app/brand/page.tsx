import { Metadata } from "next";
import BrandAssetClient from "./BrandAssetClient";

export const metadata: Metadata = {
  title: "Brand Assets & Identity",
  description: "Official brand identity system, vector assets, mountain color tokens, and press guidelines for Discover Himalayan Trails.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function BrandAssetPage() {
  return <BrandAssetClient />;
}
