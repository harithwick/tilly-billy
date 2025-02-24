"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const defaultProps = {
  width: "100%",
  height: 300,
  margin: { top: 5, right: 30, left: 20, bottom: 5 },
};

const data = [
  { month: "Jan", clients: 2 },
  { month: "Feb", clients: 3 },
  { month: "Mar", clients: 2 },
  { month: "Apr", clients: 4 },
  { month: "May", clients: 3 },
  { month: "Jun", clients: 5 },
];

export function ClientGrowth() {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>New Clients</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer {...defaultProps}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" padding={{ left: 0, right: 0 }} />
              <YAxis padding={{ top: 0, bottom: 0 }} />
              <Tooltip />
              <Bar
                dataKey="clients"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
