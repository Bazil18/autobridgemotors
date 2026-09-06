import type { ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAdminSession } from "@/hooks/useAdminSession";
import { Button } from "@/components/ui/button";

export function AdminShell({ children }: { children: ReactNode }) {
  const { session, isAdmin, loading } = useAdminSession();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const signOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border bg-[var(--surface)]">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-6">
            <Link to="/" className="font-display text-xl tracking-wide">
              AUTOBRIDGE <span className="text-muted-foreground">STAFF</span>
            </Link>
            <nav className="hidden items-center gap-5 sm:flex">
              <Link
                to="/admin"
                activeOptions={{ exact: true }}
                className="text-sm uppercase tracking-wider text-muted-foreground hover:text-foreground"
                activeProps={{ className: "text-foreground" }}
              >
                Stock
              </Link>
              <Link
                to="/admin/enquiries"
                className="text-sm uppercase tracking-wider text-muted-foreground hover:text-foreground"
                activeProps={{ className: "text-foreground" }}
              >
                Enquiries
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-muted-foreground md:inline">
              {session?.user.email}
            </span>
            <Button size="sm" variant="outline" onClick={signOut}>
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {loading ? (
          <p className="mx-auto max-w-7xl px-4 py-16 text-muted-foreground sm:px-6">Loading…</p>
        ) : isAdmin ? (
          children
        ) : (
          <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
            <h1 className="text-4xl">NO ACCESS YET</h1>
            <p className="mt-3 text-muted-foreground">
              Your account is signed in but hasn't been given staff permissions. Ask the site owner
              to grant your account admin access.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
