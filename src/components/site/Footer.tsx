import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Mail, MessageCircle, Phone } from "lucide-react";
import { SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-border bg-[var(--surface)]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div>
          <div className="font-display text-2xl">AUTOBRIDGE MOTORS</div>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Quality imported vehicles, hand selected at source and prepared to a high standard
            before they reach you.
          </p>
        </div>

        <div>
          <h3 className="eyebrow">Dealership</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/cars" className="hover:text-foreground">
                Our Cars
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-foreground">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/import" className="hover:text-foreground">
                Import Services
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-foreground">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="eyebrow">Get in touch</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <a href={SITE.phoneHref} className="flex items-center gap-2 hover:text-foreground">
                <Phone className="h-4 w-4" /> {SITE.phone}
              </a>
            </li>
            <li>
              <a
                href={SITE.whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 hover:text-foreground"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp {SITE.whatsapp}
              </a>
            </li>
            <li>
              <a href={SITE.emailHref} className="flex items-center gap-2 hover:text-foreground">
                <Mail className="h-4 w-4" /> {SITE.email}
              </a>
            </li>
            <li>Open daily {SITE.hours}</li>
          </ul>
        </div>

        <div>
          <h3 className="eyebrow">Follow</h3>
          <div className="mt-4 flex gap-3">
            <a
              href={SITE.social.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href={SITE.social.facebook}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
            >
              <Facebook className="h-4 w-4" />
            </a>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            Privacy Policy · Terms &amp; Conditions · Cookie Policy
          </p>
        </div>
      </div>
      <div className="border-t border-border/70 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {SITE.name}. All rights reserved.
      </div>
    </footer>
  );
}
