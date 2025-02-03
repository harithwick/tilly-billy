"use client";

import { useDashboardMetrics } from "@/lib/hooks/use-dashboard-metrics";
import { LoadingState } from "@/lib/components/loading-state";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/lib/components/ui/card";
import { DollarSign, Users, FileText, TrendingUp, Plus } from "lucide-react";
import { Button } from "@/lib/components/ui/button";
import Link from "next/link";
import { RevenueChart } from "@/lib/components/dashboard/revenue-chart";
import { ClientGrowth } from "@/lib/components/dashboard/client-growth";
import { formatCurrency } from "@/lib/utils";
import { Chart1 } from "@/lib/components/charts/chart1";
import { Chart2 } from "@/lib/components/charts/chart2";

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
      <Chart1 />
      <Chart2 />
      {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(metrics.totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics.revenueGrowth.percentage > 0 ? "+" : ""}
              {metrics.revenueGrowth.percentage}% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Clients
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeClients}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.newClients} new this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Invoices
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.pendingInvoices}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(metrics.pendingAmount)} total value
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.growthRate > 0 ? "+" : ""}
              {metrics.growthRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">Client growth rate</p>
          </CardContent>
        </Card>
      </div> */}

      <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-8">
        {/* <RevenueChart data={metrics.monthlyRevenue} /> */}
        <ClientGrowth />
      </div>
    </div>
  );
}
