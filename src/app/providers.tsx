import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/auth.store";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Toaster } from "@/components/ui/toast";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000, // 30s
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const { setSession, logout, setLoading } = useAuthStore();

  useEffect(() => {
    // Check for existing session on mount
    const initAuth = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          const { data: profile } = await supabase
            .from("users")
            .select("*")
            .eq("id", session.user.id)
            .single();

          setSession(
            profile ?? {
              id: session.user.id,
              email: session.user.email ?? "",
              full_name: session.user.user_metadata?.full_name ?? "User",
              role: "mechanic",
              organization_id: null,
              avatar_url: null,
              is_active: true,
              last_login_at: null,
              created_at: session.user.created_at,
              updated_at: session.user.created_at,
            },
            session.access_token,
          );
        } else {
          logout();
        }
      } catch {
        logout();
      } finally {
        setLoading(false);
        setReady(true);
      }
    };

    initAuth();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .single();

        setSession(
          profile ?? {
            id: session.user.id,
            email: session.user.email ?? "",
            full_name: session.user.user_metadata?.full_name ?? "User",
            role: "mechanic",
            organization_id: null,
            avatar_url: null,
            is_active: true,
            last_login_at: null,
            created_at: session.user.created_at,
            updated_at: session.user.created_at,
          },
          session.access_token,
        );
      } else {
        logout();
      }
      setReady(true);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!ready) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster />
    </QueryClientProvider>
  );
}