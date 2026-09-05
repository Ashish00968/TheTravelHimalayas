import { Metadata } from "next";
import BrandAssetClient from "./BrandAssetClient";

export const metadata: Metadata = {
  title: "Brand Assets & Identity System",
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
