import { supabase } from "@/integrations/supabase/client";

export interface Vehicle {
  id: string;
  slug: string;
  make: string;
  model: string;
  variant: string | null;
  year: number;
  price: number;
  mileage: number;
  fuel: string;
  transmission: string;
  engine: string | null;
  engine_size: number | null;
  body_type: string | null;
  colour: string | null;
  doors: number | null;
  seats: number | null;
  registration: string | null;
  nct_info: string | null;
  import_info: string | null;
  overview: string | null;
  condition_notes: string | null;
  features: string[];
  images: string[];
  video_url: string | null;
  status: string;
  featured: boolean;
  created_at: string;
}

export const FUEL_TYPES = ["Petrol", "Diesel", "Hybrid", "Electric", "Plug-in Hybrid"];
export const TRANSMISSIONS = ["Automatic", "Manual"];
export const BODY_TYPES = ["Hatchback", "Saloon", "SUV", "Estate", "Coupe", "MPV", "Van"];
export const STATUSES = ["available", "reserved", "sold", "hidden"];

export function vehicleTitle(v: Pick<Vehicle, "year" | "make" | "model">) {
  return `${v.year} ${v.make} ${v.model}`;
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatMileage(km: number) {
  return `${new Intl.NumberFormat("en-IE").format(km)} km`;
}

export function makeSlug(make: string, model: string, year: number | string) {
  return `${make}-${model}-${year}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function fetchPublicVehicles(): Promise<Vehicle[]> {
  const { data, error } = await supabase
    .from("vehicles")
    .select("*")
    .neq("status", "hidden")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as Vehicle[];
}

export async function fetchVehicleBySlug(slug: string): Promise<Vehicle | null> {
  const { data, error } = await supabase
    .from("vehicles")
    .select("*")
    .eq("slug", slug)
    .neq("status", "hidden")
    .maybeSingle();
  if (error) throw error;
  return (data as unknown as Vehicle) ?? null;
}

export const vehiclesQuery = {
  queryKey: ["vehicles", "public"] as const,
  queryFn: fetchPublicVehicles,
  staleTime: 30_000,
};

export const vehicleQuery = (slug: string) => ({
  queryKey: ["vehicle", slug] as const,
  queryFn: () => fetchVehicleBySlug(slug),
  staleTime: 30_000,
});
