import type { Metadata } from "next";
import { ContactClient } from "./ContactClient";

export const metadata: Metadata = {
  title: "About & Basecamp Dispatch | The Himalayan Trails",
  description:
    "Learn about The Himalayan Trails, our field operations, basecamp headquarters, and direct contact dispatch.",
};

export default function ContactPage() {
  return <ContactClient />;
}
