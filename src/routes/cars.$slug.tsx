import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Mail, MessageCircle, Phone } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { VehicleGallery } from "@/components/site/VehicleGallery";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { Button } from "@/components/ui/button";
import { SITE, whatsappLink } from "@/lib/site";
import {
  fetchVehicleBySlug,
  formatMileage,
  formatPrice,
  vehicleQuery,
  vehicleTitle,
  type Vehicle,
} from "@/lib/vehicles";

export const Route = createFileRoute("/cars/$slug")({
  loader: async ({ params }) => {
    const vehicle = await fetchVehicleBySlug(params.slug);
    if (!vehicle) throw notFound();
    return { vehicle };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return { meta: [{ title: "Vehicle unavailable" }, { name: "robots", content: "noindex" }] };
    }
    const v = loaderData.vehicle;
    const title = `${vehicleTitle(v)} ${v.variant ?? ""} — ${formatPrice(v.price)} | Autobridge Motors`;
    const description = `${vehicleTitle(v)}${v.variant ? ` ${v.variant}` : ""}, ${formatMileage(v.mileage)}, ${v.fuel}, ${v.transmission}. ${formatPrice(v.price)} at Autobridge Motors.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { property: "og:url", content: `/cars/${params.slug}` },
      ],
      links: [{ rel: "canonical", href: `/cars/${params.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Car",
            name: vehicleTitle(v),
            brand: v.make,
            model: v.model,
            vehicleModelDate: String(v.year),
            fuelType: v.fuel,
            vehicleTransmission: v.transmission,
            mileageFromOdometer: { "@type": "QuantitativeValue", value: v.mileage, unitCode: "KMT" },
            offers: {
              "@type": "Offer",
              price: v.price,
              priceCurrency: "EUR",
              availability:
                v.status === "sold"
                  ? "https://schema.org/SoldOut"
                  : "https://schema.org/InStock",
            },
          }),
        },
      ],
    };
  },
  component: VehiclePage,
});

function Spec({ label, value }: { label: string; value?: string | number | null }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="border-b border-border/60 py-3">
      <dt className="text-xs uppercase tracking-widest text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-base">{value}</dd>
    </div>
  );
}

function VehiclePage() {
  const { slug } = Route.useParams();
  const initial = Route.useLoaderData();
  const { data } = useQuery({ ...vehicleQuery(slug), initialData: initial.vehicle });
  const vehicle = (data ?? initial.vehicle) as Vehicle;
  const title = vehicleTitle(vehicle);
  const sold = vehicle.status === "sold";
  const enquiryText = `Hi, I'm interested in the ${title}${vehicle.variant ? ` ${vehicle.variant}` : ""}.`;

  return (
    <SiteLayout>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <Link
          to="/cars"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to all cars
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <VehicleGallery images={vehicle.images} alt={title} />

            <section className="mt-10">
              <h2 className="text-3xl">Vehicle overview</h2>
              <p className="mt-3 whitespace-pre-line text-muted-foreground">{vehicle.overview}</p>
            </section>

            {vehicle.features.length > 0 && (
              <section className="mt-8">
                <h2 className="text-3xl">Key features</h2>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {vehicle.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
                      {f}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {vehicle.condition_notes && (
              <section className="mt-8">
                <h2 className="text-3xl">Condition</h2>
                <p className="mt-3 whitespace-pre-line text-muted-foreground">
                  {vehicle.condition_notes}
                </p>
              </section>
            )}

            {vehicle.import_info && (
              <section className="mt-8">
                <h2 className="text-3xl">History &amp; import information</h2>
                <p className="mt-3 whitespace-pre-line text-muted-foreground">
                  {vehicle.import_info}
                </p>
              </section>
            )}

            {vehicle.video_url && (
              <section className="mt-8">
                <h2 className="text-3xl">Video</h2>
                <div className="mt-3 aspect-video overflow-hidden rounded-lg border border-border">
                  <iframe
                    src={vehicle.video_url}
                    title={`${title} walkaround video`}
                    className="h-full w-full"
                    allowFullScreen
                  />
                </div>
              </section>
            )}
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="surface-panel rounded-lg p-6">
              {sold && (
                <span className="mb-3 inline-block rounded-sm bg-primary px-3 py-1 font-display text-lg tracking-widest text-primary-foreground">
                  SOLD
                </span>
              )}
              <h1 className="text-4xl">{title}</h1>
              {vehicle.variant && <p className="mt-1 text-muted-foreground">{vehicle.variant}</p>}
              <p className="mt-4 font-display text-5xl">{formatPrice(vehicle.price)}</p>

              <div className="mt-6 grid grid-cols-2 gap-x-6">
                <Spec label="Year" value={vehicle.year} />
                <Spec label="Mileage" value={formatMileage(vehicle.mileage)} />
                <Spec label="Fuel" value={vehicle.fuel} />
                <Spec label="Transmission" value={vehicle.transmission} />
                <Spec label="Engine" value={vehicle.engine} />
                <Spec label="Body type" value={vehicle.body_type} />
                <Spec label="Colour" value={vehicle.colour} />
                <Spec label="Doors" value={vehicle.doors} />
                <Spec label="Seats" value={vehicle.seats} />
                <Spec label="Registration" value={vehicle.registration} />
              </div>
              {vehicle.nct_info && (
                <dl>
                  <Spec label="NCT / inspection" value={vehicle.nct_info} />
                </dl>
              )}

              <div className="mt-6 grid gap-2">
                <Button asChild size="lg" className="uppercase tracking-widest">
                  <a href={whatsappLink(enquiryText)} target="_blank" rel="noreferrer">
                    <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp about this car
                  </a>
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button asChild variant="outline" className="border-border bg-transparent">
                    <a href={SITE.phoneHref}>
                      <Phone className="mr-2 h-4 w-4" /> Call
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="border-border bg-transparent">
                    <a href={`${SITE.emailHref}?subject=${encodeURIComponent(title)}`}>
                      <Mail className="mr-2 h-4 w-4" /> Email
                    </a>
                  </Button>
                </div>
              </div>
            </div>

            <div id="enquire" className="surface-panel mt-6 scroll-mt-24 rounded-lg p-6">
              <h2 className="text-3xl">Interested in this vehicle?</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Send us a message and we'll come straight back to you.
              </p>
              <div className="mt-5">
                <EnquiryForm vehicleId={vehicle.id} vehicleLabel={title} />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </SiteLayout>
  );
}
