import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AdminShell } from "@/components/site/AdminShell";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  vehicle_label: string | null;
  handled: boolean;
  created_at: string;
}

export const Route = createFileRoute("/_authenticated/admin/enquiries")({
  head: () => ({
    meta: [
      { title: "Enquiries | Autobridge Motors Staff" },
      { name: "description", content: "Private staff area for reading customer enquiries." },
      { property: "og:title", content: "Enquiries | Autobridge Motors Staff" },
      { property: "og:description", content: "Customer enquiries received through the website." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: EnquiriesPage,
});

function EnquiriesPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "enquiries"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("enquiries")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Enquiry[];
    },
  });

  const toggle = async (e: Enquiry) => {
    const { error } = await supabase
      .from("enquiries")
      .update({ handled: !e.handled })
      .eq("id", e.id);
    if (error) return toast.error(error.message);
    void queryClient.invalidateQueries({ queryKey: ["admin", "enquiries"] });
  };

  const enquiries = data ?? [];

  return (
    <AdminShell>
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <p className="eyebrow">Inbox</p>
        <h1 className="mt-2 text-4xl">ENQUIRIES</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {enquiries.filter((e) => !e.handled).length} awaiting reply
        </p>

        {isLoading ? (
          <p className="mt-10 text-muted-foreground">Loading enquiries…</p>
        ) : (
          <div className="mt-8 space-y-3">
            {enquiries.map((e) => (
              <div key={e.id} className="surface-panel rounded-lg p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-lg">
                      {e.name}
                      {e.vehicle_label ? (
                        <span className="text-muted-foreground"> · {e.vehicle_label}</span>
                      ) : null}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <a href={`mailto:${e.email}`} className="hover:text-foreground">
                        {e.email}
                      </a>
                      {e.phone ? (
                        <>
                          {" · "}
                          <a href={`tel:${e.phone}`} className="hover:text-foreground">
                            {e.phone}
                          </a>
                        </>
                      ) : null}
                      {" · "}
                      {new Date(e.created_at).toLocaleString("en-IE")}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant={e.handled ? "outline" : "default"}
                    onClick={() => void toggle(e)}
                  >
                    {e.handled ? "Mark unread" : "Mark handled"}
                  </Button>
                </div>
                {e.subject ? <p className="mt-3 text-sm">{e.subject}</p> : null}
                <p className="mt-2 whitespace-pre-wrap text-muted-foreground">{e.message}</p>
              </div>
            ))}
            {enquiries.length === 0 && <p className="text-muted-foreground">No enquiries yet.</p>}
          </div>
        )}
      </div>
    </AdminShell>
  );
}
