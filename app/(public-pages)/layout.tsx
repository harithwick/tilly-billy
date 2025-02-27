"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import DashboardTopNav from "@/components/dashboard-top-nav";
import { SiteHeader } from "@/components/marketing/site-header";
import { User } from "@supabase/supabase-js";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();
        if (!error) {
          setUser(user);
        }
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {user ? <DashboardTopNav organizations={[]} /> : <SiteHeader />}
      {/* {children} */}
    </div>
  );
}
