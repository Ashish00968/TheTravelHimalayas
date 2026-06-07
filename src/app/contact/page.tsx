import type { Metadata } from "next";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with TheHimalayanTrails team. Ask questions about treks, peaks, or partnerships.",
};

export default function ContactPage() {
  return (
    <section className="container mx-auto px-4 py-16">
      {/* Page Title */}
      <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-12 text-center">
        Contact Us
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-5xl mx-auto">
        {/* Contact Form */}
        <div className="lg:col-span-2 glass-card rounded-xl p-8">
          <h2 className="font-heading text-2xl font-semibold text-foreground mb-6">
            Send us a message
          </h2>
          <ContactForm />
        </div>

        {/* Contact Info Sidebar */}
        <div className="space-y-6">
          <div className="glass-card rounded-xl p-6">
            <h3 className="font-semibold text-foreground mb-3">Email</h3>
            <p className="text-foreground/70 text-sm">
              hello@thehimalayantrails.com
            </p>
          </div>

          <div className="glass-card rounded-xl p-6">
            <h3 className="font-semibold text-foreground mb-3">Location</h3>
            <p className="text-foreground/70 text-sm">
              Based in Manali, Himachal Pradesh, India — at the doorstep of the
              Himalayas.
            </p>
          </div>

          <div className="glass-card rounded-xl p-6">
            <h3 className="font-semibold text-foreground mb-3">Follow Us</h3>
            <p className="text-foreground/70 text-sm">
              Stay updated on new trails, guides, and mountain stories through
              our social channels.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
