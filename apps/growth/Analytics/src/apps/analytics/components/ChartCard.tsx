"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ChartVariant = "bar" | "line" | "pie";

interface ChartCardProps {
  title: string;
  variant: ChartVariant;
  data: object[];
  xKey: string;
  yKey: string;
  secondaryYKey?: string;
}

const COLORS = ["#2563eb", "#16a34a", "#dc2626", "#ca8a04", "#7c3aed", "#0891b2"];

export function ChartCard({ title, variant, data, xKey, yKey, secondaryYKey }: ChartCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72 w-full">
          <ResponsiveContainer>
            {variant === "line" ? (
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={xKey} />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey={yKey} stroke="#2563eb" strokeWidth={2} dot={false} />
              </LineChart>
            ) : null}

            {variant === "bar" ? (
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={xKey} />
                <YAxis />
                <Tooltip />
                <Bar dataKey={yKey} fill="#2563eb" radius={[6, 6, 0, 0]} />
                {secondaryYKey ? <Bar dataKey={secondaryYKey} fill="#16a34a" radius={[6, 6, 0, 0]} /> : null}
              </BarChart>
            ) : null}

            {variant === "pie" ? (
              <PieChart>
                <Tooltip />
                <Pie data={data} dataKey={yKey} nameKey={xKey} cx="50%" cy="50%" outerRadius={100} label>
                  {data.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            ) : null}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
