"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useMemo } from "react";

type TimeFilter = "30days" | "7days" | "year" | "lifetime";

interface ClientGrowthData {
  day: string;
  totalClients: number;
  activeClients: number;
}

export function ClientGrowth({ data }: { data: ClientGrowthData[] }) {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("30days");

  const filteredData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const now = new Date();
    const filterDate = new Date();

    // Reset the time to start of day for consistent comparison
    now.setHours(0, 0, 0, 0);
    filterDate.setHours(0, 0, 0, 0);

    let startDate: Date;

    switch (timeFilter) {
      case "30days":
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 29);
        break;
      case "7days":
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 6);
        break;
      case "year":
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      case "lifetime":
        startDate = new Date("2025-01-01");
        break;
      default:
        startDate = new Date(now);
    }

    // Generate all dates in the range
    const dateRange: ClientGrowthData[] = [];
    const endDate = new Date(now);

    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      const dateStr = d.toISOString().split("T")[0];
      const existingData = data.find((item) => item.day === dateStr);

      dateRange.push({
        day: dateStr,
        totalClients: existingData?.totalClients ?? 0,
        activeClients: existingData?.activeClients ?? 0,
      });
    }

    return dateRange;
  }, [data, timeFilter]);

  return (
    <Card className="col-span-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Client Growth</CardTitle>
        <Select
          value={timeFilter}
          onValueChange={(value: TimeFilter) => setTimeFilter(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30days">Last 30 Days</SelectItem>
            <SelectItem value="7days">Last 7 Days</SelectItem>
            <SelectItem value="year">Last Year</SelectItem>
            <SelectItem value="lifetime">Lifetime</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={filteredData}>
            <XAxis
              dataKey="day"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="totalClients"
              name="Total Clients"
              stroke="#adfa1d"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="activeClients"
              name="Active Clients"
              stroke="#0ea5e9"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
