export const SITE = {
  name: "Autobridge Motors",
  tagline: "Premium imported vehicles",
  phone: "0830450106",
  phoneHref: "tel:+353830450106",
  whatsapp: "0868615165",
  whatsappHref: "https://wa.me/353868615165",
  email: "autobridgemotors@outlook.com",
  emailHref: "mailto:autobridgemotors@outlook.com",
  hours: "9:00 – 19:00, seven days a week",
  location: "Ireland",
  social: {
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
    tiktok: "https://tiktok.com",
  },
} as const;

export function whatsappLink(message: string) {
  return `${SITE.whatsappHref}?text=${encodeURIComponent(message)}`;
}
