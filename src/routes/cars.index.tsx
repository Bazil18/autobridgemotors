import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SlidersHorizontal } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { VehicleCard } from "@/components/site/VehicleCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { vehiclesQuery, type Vehicle } from "@/lib/vehicles";

export const Route = createFileRoute("/cars/")({
  head: () => ({
    meta: [
      { title: "Cars For Sale — Autobridge Motors Stock" },
      {
        name: "description",
        content:
          "Browse every car currently in stock at Autobridge Motors. Filter by make, price, year, mileage, fuel, transmission and body type.",
      },
      { property: "og:title", content: "Current Stock — Autobridge Motors" },
      {
        property: "og:description",
        content: "Every imported vehicle currently available, with full specifications and photos.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/cars" },
    ],
    links: [{ rel: "canonical", href: "/cars" }],
  }),
  component: CarsPage,
});

const SORTS = {
  newest: "Newest in",
  price_asc: "Price: Low → High",
  price_desc: "Price: High → Low",
  mileage_asc: "Mileage: Low → High",
  year_desc: "Year: Newest first",
} as const;

type SortKey = keyof typeof SORTS;

const EMPTY = "any";

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="grid gap-1.5">
      <Label className="text-xs uppercase tracking-widest text-muted-foreground">{label}</Label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 rounded-md border border-input bg-background px-3 text-sm"
      >
        <option value={EMPTY}>Any</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

function CarsPage() {
  const { data, isLoading } = useQuery(vehiclesQuery);
  const vehicles = (data ?? []) as Vehicle[];

  const [showFilters, setShowFilters] = useState(false);
  const [make, setMake] = useState(EMPTY);
  const [model, setModel] = useState(EMPTY);
  const [fuel, setFuel] = useState(EMPTY);
  const [transmission, setTransmission] = useState(EMPTY);
  const [body, setBody] = useState(EMPTY);
  const [maxPrice, setMaxPrice] = useState("");
  const [minYear, setMinYear] = useState("");
  const [maxMileage, setMaxMileage] = useState("");
  const [sort, setSort] = useState<SortKey>("newest");

  const uniq = (fn: (v: Vehicle) => string | null | undefined) =>
    Array.from(new Set(vehicles.map(fn).filter(Boolean) as string[])).sort();

  const filtered = useMemo(() => {
    const list = vehicles.filter((v) => {
      if (make !== EMPTY && v.make !== make) return false;
      if (model !== EMPTY && v.model !== model) return false;
      if (fuel !== EMPTY && v.fuel !== fuel) return false;
      if (transmission !== EMPTY && v.transmission !== transmission) return false;
      if (body !== EMPTY && v.body_type !== body) return false;
      if (maxPrice && v.price > Number(maxPrice)) return false;
      if (minYear && v.year < Number(minYear)) return false;
      if (maxMileage && v.mileage > Number(maxMileage)) return false;
      return true;
    });

    const sorted = [...list];
    sorted.sort((a, b) => {
      switch (sort) {
        case "price_asc":
          return a.price - b.price;
        case "price_desc":
          return b.price - a.price;
        case "mileage_asc":
          return a.mileage - b.mileage;
        case "year_desc":
          return b.year - a.year;
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });
    // Sold cars always last
    return sorted.sort((a, b) => Number(a.status === "sold") - Number(b.status === "sold"));
  }, [vehicles, make, model, fuel, transmission, body, maxPrice, minYear, maxMileage, sort]);

  const availableCount = filtered.filter((v) => v.status !== "sold").length;

  const reset = () => {
    setMake(EMPTY);
    setModel(EMPTY);
    setFuel(EMPTY);
    setTransmission(EMPTY);
    setBody(EMPTY);
    setMaxPrice("");
    setMinYear("");
    setMaxMileage("");
  };

  return (
    <SiteLayout>
      <div className="border-b border-border bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-12 py-14">
          <p className="eyebrow">Our stock</p>
          <h1 className="mt-3 text-5xl sm:text-6xl">CARS FOR SALE</h1>
          <p className="mt-4 text-muted-foreground">
            {isLoading ? "Loading stock…" : `${availableCount} vehicles available right now`}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-12 py-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button
            variant="outline"
            className="border-border bg-transparent uppercase tracking-widest lg:hidden"
            onClick={() => setShowFilters((v) => !v)}
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            {showFilters ? "Hide filters" : "Filters"}
          </Button>
          <div className="ml-auto grid gap-1.5">
            <Label className="text-xs uppercase tracking-widest text-muted-foreground">Sort by</Label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              {Object.entries(SORTS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={`${showFilters ? "grid" : "hidden"} surface-panel mt-6 gap-4 rounded-lg p-5 sm:grid-cols-2 lg:grid lg:grid-cols-4`}>
          <Select label="Make" value={make} onChange={setMake} options={uniq((v) => v.make)} />
          <Select label="Model" value={model} onChange={setModel} options={uniq((v) => v.model)} />
          <Select label="Fuel" value={fuel} onChange={setFuel} options={uniq((v) => v.fuel)} />
          <Select
            label="Transmission"
            value={transmission}
            onChange={setTransmission}
            options={uniq((v) => v.transmission)}
          />
          <Select label="Body type" value={body} onChange={setBody} options={uniq((v) => v.body_type)} />
          <div className="grid gap-1.5">
            <Label className="text-xs uppercase tracking-widest text-muted-foreground">Max price (€)</Label>
            <Input
              inputMode="numeric"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value.replace(/\D/g, ""))}
              placeholder="e.g. 20000"
            />
          </div>
          <div className="grid gap-1.5">
            <Label className="text-xs uppercase tracking-widest text-muted-foreground">Year from</Label>
            <Input
              inputMode="numeric"
              value={minYear}
              onChange={(e) => setMinYear(e.target.value.replace(/\D/g, ""))}
              placeholder="e.g. 2017"
            />
          </div>
          <div className="grid gap-1.5">
            <Label className="text-xs uppercase tracking-widest text-muted-foreground">Max mileage (km)</Label>
            <Input
              inputMode="numeric"
              value={maxMileage}
              onChange={(e) => setMaxMileage(e.target.value.replace(/\D/g, ""))}
              placeholder="e.g. 90000"
            />
          </div>
          <div className="flex items-end">
            <Button variant="ghost" onClick={reset} className="uppercase tracking-widest">
              Clear filters
            </Button>
          </div>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading &&
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="surface-panel h-80 animate-pulse rounded-lg" />
            ))}
          {filtered.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>

        {!isLoading && filtered.length === 0 && (
          <p className="mt-10 text-center text-muted-foreground">
            No cars match those filters. Try widening your search or get in touch and we'll source
            one for you.
          </p>
        )}
      </div>
    </SiteLayout>
  );
}
