import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import type { Complaint } from "./UserDashboard";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

interface AdminAnalyticsProps {
  complaints: Complaint[];
}

export function AdminAnalytics({ complaints }: AdminAnalyticsProps) {
  /* ================= STATUS COUNTS ================= */
  const resolved = complaints.filter(c => c.status === "resolved").length;
  const pending = complaints.filter(c => c.status === "pending").length;
  const inProgress = complaints.filter(c => c.status === "in-progress").length;

  const statusData = [
    { name: "Resolved", value: resolved },
    { name: "In Progress", value: inProgress },
    { name: "Pending", value: pending },
  ];

  /* ================= MONTHLY TREND (REAL DATA) ================= */
  const monthOrder = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ];

  const getMonth = (dateStr: string) =>
    new Date(dateStr).toLocaleString("default", { month: "short" });

  const monthlyMap: Record<
    string,
    { Bus: number; Train: number; Metro: number }
  > = {};

  complaints.forEach((c) => {
    if (!c.date || !c.transportType) return;

    const month = getMonth(c.date);
    const type = c.transportType.toLowerCase();

    if (!monthlyMap[month]) {
      monthlyMap[month] = { Bus: 0, Train: 0, Metro: 0 };
    }

    if (type === "bus") monthlyMap[month].Bus++;
    else if (type === "train") monthlyMap[month].Train++;
    else if (type === "metro") monthlyMap[month].Metro++;
  });

  const monthlyData = monthOrder
    .filter(month => monthlyMap[month])
    .map(month => ({
      month,
      Bus: monthlyMap[month].Bus,
      Train: monthlyMap[month].Train,
      Metro: monthlyMap[month].Metro,
    }));

  /* ================= COLORS ================= */
  const STATUS_COLORS = ["#22c55e", "#f59e0b", "#9ca3af"];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl">Admin Performance Analytics</h2>
      <p className="text-sm text-gray-600">
        Visual analysis of grievance resolution status
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Complaint Analytics</CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* ================= STATUS PIE CHART ================= */}
          <div className="h-[300px] w-full">
            <h3 className="text-sm font-medium mb-2 text-center">
              Complaint Status
            </h3>

            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  label
                >
                  {statusData.map((_, index) => (
                    <Cell key={index} fill={STATUS_COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* ================= MONTHLY LINE GRAPH ================= */}
          <div className="h-[320px] w-full">
            <h3 className="text-sm font-semibold mb-3 text-center">
              Monthly Complaint Trend
            </h3>

            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={monthlyData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />

                <Line
                  type="monotone"
                  dataKey="Bus"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="Train"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="Metro"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
