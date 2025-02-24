"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "@/lib/utils/utilities";

const defaultProps = {
  width: "100%",
  height: 300,
  margin: { top: 5, right: 30, left: 20, bottom: 5 },
};

interface RevenueChartProps {
  data: Record<string, number>;
}

export function RevenueChart({ data }: RevenueChartProps) {
  const chartData = Object.entries(data).map(([month, revenue]) => ({
    month,
    revenue,
  }));

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Revenue Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer {...defaultProps}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" padding={{ left: 0, right: 0 }} />
              <YAxis
                padding={{ top: 0, bottom: 0 }}
                tickFormatter={(value) => formatCurrency(value)}
              />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
