import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Award, Car, Globe2, ShieldCheck, Wrench } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Hero } from "@/components/site/Hero";
import { VehicleCard } from "@/components/site/VehicleCard";
import { Button } from "@/components/ui/button";
import { vehiclesQuery, type Vehicle } from "@/lib/vehicles";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Autobridge Motors — Premium Imported Cars in Ireland" },
      {
        name: "description",
        content:
          "Hand-picked imported vehicles, fully inspected and prepared. Browse current stock, enquire online or call Autobridge Motors today.",
      },
      { property: "og:title", content: "Autobridge Motors — Premium Imported Cars" },
      {
        property: "og:description",
        content: "Quality imported cars, straightforward service. Browse our current stock.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

const TRUST = [
  { icon: Globe2, title: "Sourced at auction", body: "Vehicles selected directly in Japan on verified auction grades." },
  { icon: ShieldCheck, title: "Fully inspected", body: "Every car checked, documented and road-ready before sale." },
  { icon: Wrench, title: "Prepared properly", body: "Serviced, valeted and NCT-ready when you collect it." },
  { icon: Award, title: "Honest pricing", body: "Clear prices, no hidden add-ons and no pressure selling." },
];

function Index() {
  const { data, isLoading } = useQuery(vehiclesQuery);
  const vehicles = (data ?? []) as Vehicle[];
  const available = vehicles.filter((v) => v.status !== "sold");
  const featured = (available.filter((v) => v.featured).length
    ? available.filter((v) => v.featured)
    : available
  ).slice(0, 6);

  return (
    <SiteLayout>
      <Hero />

      <section id="featured" className="mx-auto max-w-6xl scroll-mt-20 px-5 sm:px-8 lg:px-12 py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Current stock</p>
            <h2 className="mt-3 text-4xl sm:text-5xl">FEATURED CARS</h2>
          </div>
          <Button asChild variant="outline" className="border-border bg-transparent uppercase tracking-widest">
            <Link to="/cars">View all {available.length} cars</Link>
          </Button>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading &&
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="surface-panel h-80 animate-pulse rounded-lg" />
            ))}
          {featured.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
          {!isLoading && featured.length === 0 && (
            <p className="text-muted-foreground">
              New stock is arriving shortly — get in touch and we'll let you know first.
            </p>
          )}
        </div>
      </section>

      <section className="border-y border-border bg-[var(--surface)]">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 sm:px-8 lg:px-12 py-16 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST.map(({ icon: Icon, title, body }) => (
            <div key={title}>
              <Icon className="h-7 w-7 text-primary" />
              <h3 className="mt-4 text-2xl">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-12 py-20">
        <div className="surface-panel relative overflow-hidden rounded-lg p-10 sm:p-14">
          <div
            className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl"
            aria-hidden
          />
          <Car className="h-8 w-8 text-primary" />
          <h2 className="mt-5 max-w-2xl text-4xl sm:text-5xl">
            LOOKING FOR SOMETHING SPECIFIC?
          </h2>
          <p className="mt-4 max-w-xl text-muted-foreground">
            Tell us the make, model and budget you have in mind and we'll source it for you at
            auction in Japan — inspected, imported and delivered ready to drive.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="uppercase tracking-widest">
              <Link to="/contact">Request a car</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-border bg-transparent uppercase tracking-widest">
              <a href={SITE.whatsappHref} target="_blank" rel="noreferrer">
                WhatsApp us
              </a>
            </Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
