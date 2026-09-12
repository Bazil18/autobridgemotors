import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { AdminShell } from "@/components/site/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { imageUrl } from "@/lib/images";
import { formatMileage, formatPrice, STATUSES, vehicleTitle, type Vehicle } from "@/lib/vehicles";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/admin/")({
  head: () => ({
    meta: [
      { title: "Stock Manager | Autobridge Motors Staff" },
      { name: "description", content: "Private staff area for managing Autobridge Motors stock." },
      { property: "og:title", content: "Stock Manager | Autobridge Motors Staff" },
      { property: "og:description", content: "Private staff area for managing dealership stock." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminStockPage,
});

function AdminStockPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "vehicles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Vehicle[];
    },
  });

  const setStatus = async (v: Vehicle, status: string) => {
    const { error } = await supabase.from("vehicles").update({ status }).eq("id", v.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(`${vehicleTitle(v)} marked ${status}`);
    void queryClient.invalidateQueries();
  };

  const remove = async (v: Vehicle) => {
    if (!window.confirm(`Delete ${vehicleTitle(v)}? This can't be undone.`)) return;
    const { error } = await supabase.from("vehicles").delete().eq("id", v.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Vehicle deleted");
    void queryClient.invalidateQueries();
  };

  const q = search.trim().toLowerCase();
  const vehicles = (data ?? []).filter((v) =>
    q ? `${v.make} ${v.model} ${v.year} ${v.registration ?? ""}`.toLowerCase().includes(q) : true,
  );

  return (
    <AdminShell>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Stock manager</p>
            <h1 className="mt-2 text-4xl">VEHICLES</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {vehicles.length} vehicle{vehicles.length === 1 ? "" : "s"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Input
              placeholder="Search stock"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-48"
            />
            <Button asChild>
              <Link to="/admin/vehicles/$id" params={{ id: "new" }}>
                <Plus className="mr-1 h-4 w-4" /> Add car
              </Link>
            </Button>
          </div>
        </div>

        {isLoading ? (
          <p className="mt-10 text-muted-foreground">Loading stock…</p>
        ) : (
          <div className="mt-8 space-y-3">
            {vehicles.map((v) => (
              <div
                key={v.id}
                className="surface-panel flex flex-wrap items-center gap-4 rounded-lg p-3"
              >
                <img
                  src={imageUrl(v.images[0])}
                  alt={vehicleTitle(v)}
                  loading="lazy"
                  width={112}
                  height={72}
                  className="h-[72px] w-28 rounded object-cover"
                />
                <div className="min-w-40 flex-1">
                  <p className="text-lg">{vehicleTitle(v)}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatPrice(v.price)} · {formatMileage(v.mileage)} · {v.fuel} ·{" "}
                    {v.transmission}
                  </p>
                </div>
                <select
                  value={v.status}
                  onChange={(e) => void setStatus(v, e.target.value)}
                  className="h-9 rounded-md border border-border bg-background px-2 text-sm capitalize"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <Button asChild size="sm" variant="outline">
                  <Link to="/admin/vehicles/$id" params={{ id: v.id }}>
                    <Pencil className="mr-1 h-4 w-4" /> Edit
                  </Link>
                </Button>
                <Button size="sm" variant="ghost" onClick={() => void remove(v)}>
                  <Trash2 className="h-4 w-4 text-primary" />
                </Button>
              </div>
            ))}
            {vehicles.length === 0 && (
              <p className="text-muted-foreground">No vehicles match that search.</p>
            )}
          </div>
        )}
      </div>
    </AdminShell>
  );
}
