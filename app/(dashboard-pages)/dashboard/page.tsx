"use client";

import { useDashboardMetrics } from "@/lib/hooks/use-dashboard-metrics";
import { LoadingState } from "@/components/loading-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, FileText, TrendingUp, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { ClientGrowth } from "@/components/dashboard/client-growth";
import { formatCurrency } from "@/lib/utils/utilities";
import { Chart1 } from "@/components/charts/chart1";
import { Chart2 } from "@/components/charts/chart2";

export default function DashboardPage() {
  const { metrics, loading, error } = useDashboardMetrics();

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-destructive">
        <p>Error loading dashboard data: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>
        <Button asChild>
          <Link href="/studio">
            <Plus className="mr-2 h-4 w-4" />
            Create Invoice
          </Link>
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <ClientGrowth data={metrics.clientGrowthData} />
      </div>
    </div>
  );
}
