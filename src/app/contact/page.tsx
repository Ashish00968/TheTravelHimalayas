import type { Metadata } from "next";
import { ContactClient } from "./ContactClient";

export const metadata: Metadata = {
  title: "About & Basecamp Dispatch | Discover Himalayan Trails",
  description:
    "Learn about Discover Himalayan Trails, our field operations, basecamp headquarters, and direct contact dispatch.",
};

export default function ContactPage() {
  return <ContactClient />;
}
