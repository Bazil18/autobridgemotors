import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, MessageCircle, Phone, Clock } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Autobridge Motors — Call, WhatsApp or Email" },
      {
        name: "description",
        content:
          "Get in touch with Autobridge Motors about a car, an import request or a viewing. Phone, WhatsApp, email and opening hours.",
      },
      { property: "og:title", content: "Contact Autobridge Motors" },
      {
        property: "og:description",
        content: "Call, WhatsApp or email us about any vehicle or import request.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/contact" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <SiteLayout>
      <div className="border-b border-border bg-[var(--surface)]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <p className="eyebrow">Get in touch</p>
          <h1 className="mt-3 text-5xl sm:text-6xl">CONTACT US</h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Questions about a car, an import request or booking a viewing? We answer quickly.
          </p>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2">
        <div className="space-y-4">
          <a
            href={SITE.phoneHref}
            className="surface-panel flex items-center gap-4 rounded-lg p-5 transition-colors hover:border-primary/60"
          >
            <Phone className="h-5 w-5 text-primary" />
            <span>
              <span className="block text-sm text-muted-foreground">Call us</span>
              <span className="text-lg">{SITE.phone}</span>
            </span>
          </a>
          <a
            href={SITE.whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="surface-panel flex items-center gap-4 rounded-lg p-5 transition-colors hover:border-primary/60"
          >
            <MessageCircle className="h-5 w-5 text-primary" />
            <span>
              <span className="block text-sm text-muted-foreground">WhatsApp</span>
              <span className="text-lg">{SITE.whatsapp}</span>
            </span>
          </a>
          <a
            href={SITE.emailHref}
            className="surface-panel flex items-center gap-4 rounded-lg p-5 transition-colors hover:border-primary/60"
          >
            <Mail className="h-5 w-5 text-primary" />
            <span>
              <span className="block text-sm text-muted-foreground">Email</span>
              <span className="text-lg break-all">{SITE.email}</span>
            </span>
          </a>
          <div className="surface-panel flex items-center gap-4 rounded-lg p-5">
            <Clock className="h-5 w-5 text-primary" />
            <span>
              <span className="block text-sm text-muted-foreground">Opening hours</span>
              <span className="text-lg">{SITE.hours}</span>
            </span>
          </div>
          <div className="surface-panel flex items-center gap-4 rounded-lg p-5">
            <MapPin className="h-5 w-5 text-primary" />
            <span>
              <span className="block text-sm text-muted-foreground">Location</span>
              <span className="text-lg">{SITE.location}</span>
            </span>
          </div>
        </div>

        <div className="surface-panel rounded-lg p-6">
          <h2 className="text-3xl">SEND US A MESSAGE</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Fill in the form and we'll get back to you as soon as we can.
          </p>
          <div className="mt-6">
            <EnquiryForm showSubject />
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
