import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { X, Upload } from "lucide-react";
import { AdminShell } from "@/components/site/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { imageUrl } from "@/lib/images";
import {
  BODY_TYPES,
  FUEL_TYPES,
  STATUSES,
  TRANSMISSIONS,
  makeSlug,
  type Vehicle,
} from "@/lib/vehicles";

export const Route = createFileRoute("/_authenticated/admin/vehicles/$id")({
  head: () => ({
    meta: [
      { title: "Edit Vehicle | Autobridge Motors Staff" },
      { name: "description", content: "Private staff form for adding and editing dealership cars." },
      { property: "og:title", content: "Edit Vehicle | Autobridge Motors Staff" },
      { property: "og:description", content: "Add or edit a car in the Autobridge Motors stock." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: VehicleEditorPage,
});

type Form = Partial<Vehicle> & { featuresText?: string };

const EMPTY: Form = {
  make: "",
  model: "",
  variant: "",
  year: new Date().getFullYear(),
  price: 0,
  mileage: 0,
  fuel: "Petrol",
  transmission: "Automatic",
  status: "available",
  featured: false,
  images: [],
  features: [],
  featuresText: "",
};

function VehicleEditorPage() {
  const { id } = Route.useParams();
  const isNew = id === "new";
  const navigate = useNavigate();
  const [form, setForm] = useState<Form>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { data } = useQuery({
    queryKey: ["admin", "vehicle", id],
    enabled: !isNew,
    queryFn: async () => {
      const { data, error } = await supabase.from("vehicles").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return (data as unknown as Vehicle) ?? null;
    },
  });

  useEffect(() => {
    if (data) setForm({ ...data, featuresText: (data.features ?? []).join("\n") });
  }, [data]);

  const set = <K extends keyof Form>(key: K, value: Form[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const uploadPhotos = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    try {
      const paths: string[] = [];
      for (const file of Array.from(files)) {
        const ext = file.name.split(".").pop() ?? "jpg";
        const path = `${crypto.randomUUID()}.${ext}`;
        const { error } = await supabase.storage.from("vehicle-images").upload(path, file, {
          cacheControl: "31536000",
          upsert: false,
        });
        if (error) throw error;
        paths.push(path);
      }
      set("images", [...(form.images ?? []), ...paths]);
      toast.success(`${paths.length} photo${paths.length === 1 ? "" : "s"} uploaded`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const features = (form.featuresText ?? "")
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
      const payload = {
        slug: form.slug || makeSlug(form.make ?? "", form.model ?? "", form.year ?? ""),
        make: form.make ?? "",
        model: form.model ?? "",
        variant: form.variant || null,
        year: Number(form.year) || new Date().getFullYear(),
        price: Number(form.price) || 0,
        mileage: Number(form.mileage) || 0,
        fuel: form.fuel ?? "Petrol",
        transmission: form.transmission ?? "Automatic",
        engine: form.engine || null,
        engine_size: form.engine_size ? Number(form.engine_size) : null,
        body_type: form.body_type || null,
        colour: form.colour || null,
        doors: form.doors ? Number(form.doors) : null,
        seats: form.seats ? Number(form.seats) : null,
        registration: form.registration || null,
        nct_info: form.nct_info || null,
        import_info: form.import_info || null,
        overview: form.overview || null,
        condition_notes: form.condition_notes || null,
        video_url: form.video_url || null,
        status: form.status ?? "available",
        featured: Boolean(form.featured),
        features,
        images: form.images ?? [],
      };

      if (isNew) {
        const { error } = await supabase.from("vehicles").insert(payload);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("vehicles").update(payload).eq("id", id);
        if (error) throw error;
      }
      toast.success("Vehicle saved");
      navigate({ to: "/admin" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save vehicle");
    } finally {
      setSaving(false);
    }
  };

  const field = (label: string, key: keyof Form, type = "text") => (
    <div className="space-y-2">
      <Label htmlFor={String(key)}>{label}</Label>
      <Input
        id={String(key)}
        type={type}
        value={(form[key] as string | number | undefined) ?? ""}
        onChange={(e) => set(key, e.target.value as Form[keyof Form])}
      />
    </div>
  );

  const select = (label: string, key: keyof Form, options: string[]) => (
    <div className="space-y-2">
      <Label htmlFor={String(key)}>{label}</Label>
      <select
        id={String(key)}
        value={(form[key] as string) ?? ""}
        onChange={(e) => set(key, e.target.value as Form[keyof Form])}
        className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm capitalize"
      >
        <option value="">—</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <AdminShell>
      <form onSubmit={save} className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <p className="eyebrow">{isNew ? "New vehicle" : "Edit vehicle"}</p>
        <h1 className="mt-2 text-4xl">{isNew ? "ADD A CAR" : "EDIT CAR"}</h1>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {field("Make", "make")}
          {field("Model", "model")}
          {field("Variant", "variant")}
          {field("Year", "year", "number")}
          {field("Price (€)", "price", "number")}
          {field("Mileage (km)", "mileage", "number")}
          {select("Fuel", "fuel", FUEL_TYPES)}
          {select("Transmission", "transmission", TRANSMISSIONS)}
          {select("Body type", "body_type", BODY_TYPES)}
          {field("Engine", "engine")}
          {field("Engine size (L)", "engine_size", "number")}
          {field("Colour", "colour")}
          {field("Doors", "doors", "number")}
          {field("Seats", "seats", "number")}
          {field("Registration", "registration")}
          {field("NCT / inspection", "nct_info")}
          {field("Video URL", "video_url")}
          {select("Status", "status", STATUSES)}
        </div>

        <div className="mt-6 flex items-center gap-2">
          <input
            id="featured"
            type="checkbox"
            checked={Boolean(form.featured)}
            onChange={(e) => set("featured", e.target.checked)}
            className="h-4 w-4 accent-[var(--primary)]"
          />
          <Label htmlFor="featured">Show on homepage as featured</Label>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="overview">Overview</Label>
            <Textarea
              id="overview"
              rows={5}
              value={form.overview ?? ""}
              onChange={(e) => set("overview", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="condition_notes">Condition notes</Label>
            <Textarea
              id="condition_notes"
              rows={5}
              value={form.condition_notes ?? ""}
              onChange={(e) => set("condition_notes", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="import_info">History / import info</Label>
            <Textarea
              id="import_info"
              rows={5}
              value={form.import_info ?? ""}
              onChange={(e) => set("import_info", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="featuresText">Key features (one per line)</Label>
            <Textarea
              id="featuresText"
              rows={5}
              value={form.featuresText ?? ""}
              onChange={(e) => set("featuresText", e.target.value)}
            />
          </div>
        </div>

        <div className="mt-10">
          <Label>Photos</Label>
          <div className="mt-3 flex flex-wrap gap-3">
            {(form.images ?? []).map((img, i) => (
              <div key={img} className="relative">
                <img
                  src={imageUrl(img)}
                  alt={`Vehicle photo ${i + 1}`}
                  loading="lazy"
                  width={160}
                  height={110}
                  className="h-[110px] w-40 rounded object-cover"
                />
                <button
                  type="button"
                  aria-label="Remove photo"
                  onClick={() =>
                    set(
                      "images",
                      (form.images ?? []).filter((x) => x !== img),
                    )
                  }
                  className="absolute right-1 top-1 rounded-full bg-background/80 p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            <label className="flex h-[110px] w-40 cursor-pointer flex-col items-center justify-center gap-2 rounded border border-dashed border-border text-sm text-muted-foreground hover:border-primary/60">
              <Upload className="h-5 w-5" />
              {uploading ? "Uploading…" : "Add photos"}
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => void uploadPhotos(e.target.files)}
              />
            </label>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            The first photo is used as the main image on cards and listings.
          </p>
        </div>

        <div className="mt-10 flex gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save vehicle"}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate({ to: "/admin" })}>
            Cancel
          </Button>
        </div>
      </form>
    </AdminShell>
  );
}
