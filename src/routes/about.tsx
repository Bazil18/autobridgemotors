import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import heroAsset from "@/assets/hero-car.jpg.asset.json";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Autobridge Motors — Imported Car Specialists" },
      {
        name: "description",
        content:
          "Autobridge Motors is a small, hands-on dealership specialising in quality imported vehicles, chosen and prepared with genuine care.",
      },
      { property: "og:title", content: "About Autobridge Motors" },
      {
        property: "og:description",
        content: "Who we are, how we source cars and why customers trust us.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <SiteLayout>
      <div className="border-b border-border bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-12 py-14">
          <p className="eyebrow">Who we are</p>
          <h1 className="mt-3 text-5xl sm:text-6xl">ABOUT AUTOBRIDGE MOTORS</h1>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-8 lg:px-12 py-16 lg:grid-cols-2">
        <div className="space-y-6 text-muted-foreground">
          <p className="text-lg text-foreground">
            We're a small, hands-on dealership built around one simple idea: sell cars we'd happily
            drive ourselves.
          </p>
          <p>
            Every vehicle in our showroom is chosen personally. We don't buy in bulk and we don't
            take chances on cars with a questionable history. If a car doesn't pass our own
            inspection, it doesn't make it onto the forecourt.
          </p>
          <h2 className="pt-4 text-3xl text-foreground">What makes us different</h2>
          <p>
            Most of our stock is imported directly from Japan, where cars are typically well
            maintained, low mileage and rust-free. Buying at source means we can offer better
            specified vehicles at fairer prices than the equivalent local car.
          </p>
          <h2 className="pt-4 text-3xl text-foreground">Our approach to sourcing</h2>
          <p>
            We work to auction grades and detailed inspection sheets, and we review each car's
            history before bidding. Nothing is bought sight unseen on a photograph alone.
          </p>
          <h2 className="pt-4 text-3xl text-foreground">Our commitment to quality</h2>
          <p>
            On arrival, every vehicle is serviced, checked over mechanically and fully valeted. Any
            work needed is done before the car is offered for sale, not afterwards.
          </p>
          <h2 className="pt-4 text-3xl text-foreground">Customer service</h2>
          <p>
            You'll deal with the same people from your first message to the day you collect the car.
            No call centres, no pressure and no surprises on the invoice.
          </p>
          <div className="pt-4">
            <Button asChild size="lg" className="uppercase tracking-widest">
              <Link to="/cars">Browse our stock</Link>
            </Button>
          </div>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <img
            src={heroAsset.url}
            alt="Autobridge Motors showroom with a prepared vehicle under display lighting"
            loading="lazy"
            width={1920}
            height={1088}
            className="rounded-lg border border-border object-cover"
          />
          <div className="surface-panel mt-6 grid grid-cols-3 gap-4 rounded-lg p-6 text-center">
            <div>
              <p className="font-display text-4xl text-primary">100%</p>
              <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                Inspected
              </p>
            </div>
            <div>
              <p className="font-display text-4xl text-primary">7 days</p>
              <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">Open</p>
            </div>
            <div>
              <p className="font-display text-4xl text-primary">Japan</p>
              <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                Sourced at auction
              </p>
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
