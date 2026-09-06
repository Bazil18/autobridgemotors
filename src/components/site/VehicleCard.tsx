import { Link } from "@tanstack/react-router";
import { Fuel, Gauge, Settings2 } from "lucide-react";
import { imageUrl } from "@/lib/images";
import { formatMileage, formatPrice, vehicleTitle, type Vehicle } from "@/lib/vehicles";

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const sold = vehicle.status === "sold";

  return (
    <Link
      to="/cars/$slug"
      params={{ slug: vehicle.slug }}
      className="group surface-panel relative flex flex-col overflow-hidden rounded-lg transition-transform duration-300 hover:-translate-y-1"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-black">
        <img
          src={imageUrl(vehicle.images?.[0])}
          alt={`${vehicleTitle(vehicle)} for sale`}
          loading="lazy"
          width={1280}
          height={853}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        {sold && (
          <span className="absolute left-3 top-3 rounded-sm bg-primary px-3 py-1 font-display text-lg tracking-widest text-primary-foreground">
            SOLD
          </span>
        )}
        {vehicle.status === "reserved" && (
          <span className="absolute left-3 top-3 rounded-sm bg-secondary px-3 py-1 font-display text-lg tracking-widest text-secondary-foreground">
            RESERVED
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="font-display text-2xl">{vehicleTitle(vehicle)}</h3>
          <p className="text-sm text-muted-foreground">
            {[vehicle.engine, vehicle.transmission].filter(Boolean).join(" • ")}
          </p>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Gauge className="h-3.5 w-3.5" /> {formatMileage(vehicle.mileage)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Fuel className="h-3.5 w-3.5" /> {vehicle.fuel}
          </span>
          <span className="inline-flex items-center gap-1">
            <Settings2 className="h-3.5 w-3.5" /> {vehicle.transmission}
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-border/70 pt-4">
          <span className="font-display text-3xl text-foreground">{formatPrice(vehicle.price)}</span>
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            View details
          </span>
        </div>
      </div>
    </Link>
  );
}
