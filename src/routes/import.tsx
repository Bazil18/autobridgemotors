import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/site/SiteLayout";

const STEPS = [
  {
    title: "Japan",
    body: "We search the Japanese auction houses daily for well-kept, low-mileage cars that suit Irish buyers.",
  },
  {
    title: "Inspection",
    body: "Every candidate is checked against its auction grade and inspection sheet before we bid.",
  },
  {
    title: "Purchase",
    body: "We bid to an agreed budget, so there are no surprises on the final landed price.",
  },
  {
    title: "Shipping",
    body: "The car is transported to port, loaded and shipped, usually arriving within six to eight weeks.",
  },
  {
    title: "Ireland",
    body: "On arrival we handle customs, VRT and registration paperwork on your behalf.",
  },
  {
    title: "Preparation",
    body: "Full service, NCT preparation, valet and any remedial work before the keys change hands.",
  },
  {
    title: "Customer",
    body: "You collect a car that's ready to drive, taxed-ready and fully documented.",
  },
];

export const Route = createFileRoute("/import")({
  head: () => ({
    meta: [
      { title: "Car Import & Sourcing Service | Autobridge Motors" },
      {
        name: "description",
        content:
          "How Autobridge Motors sources, inspects, imports and prepares quality vehicles from Japan for Irish customers, step by step.",
      },
      { property: "og:title", content: "Import & Sourcing | Autobridge Motors" },
      {
        property: "og:description",
        content: "From Japanese auction to your driveway — our full import and preparation process.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/import" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/import" }],
  }),
  component: ImportPage,
});

function ImportPage() {
  return (
    <SiteLayout>
      <div className="border-b border-border bg-[var(--surface)]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <p className="eyebrow">Import &amp; services</p>
          <h1 className="mt-3 text-5xl sm:text-6xl">SOURCED, IMPORTED, PREPARED</h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Can't see the car you want in stock? We'll find it, import it and hand it over ready to
            drive.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <ol className="relative border-l border-border pl-8">
          {STEPS.map((step, i) => (
            <li key={step.title} className="animate-rise relative pb-10 last:pb-0">
              <span className="absolute -left-[41px] flex h-6 w-6 items-center justify-center rounded-full border border-primary/60 bg-background text-xs text-primary">
                {i + 1}
              </span>
              <h2 className="text-3xl">{step.title.toUpperCase()}</h2>
              <p className="mt-2 text-muted-foreground">{step.body}</p>
            </li>
          ))}
        </ol>

        <div className="surface-panel mt-12 rounded-lg p-8 text-center">
          <h2 className="text-3xl">LOOKING FOR SOMETHING SPECIFIC?</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Tell us the make, model, budget and spec you have in mind and we'll go and find it.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link to="/contact">Request a car</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/cars">Browse stock</Link>
            </Button>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
