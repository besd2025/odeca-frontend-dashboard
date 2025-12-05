"use client";

import { Pie, PieChart, Cell, Legend, Tooltip } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { name: "Grade A1", value: 30, fill: "var(--color-a1)" },
  { name: "Grade A2", value: 15.2, fill: "var(--color-a2)" },
  { name: "Grade B1", value: 8, fill: "var(--color-b1)" },
  { name: "Grade B2", value: 5, fill: "var(--color-b2)" },
];

const chartConfig = {
  value: {
    label: "Quantité (T)",
  },
  a1: {
    label: "Grade A1",
    color: "var(--chart-5)",
  },
  a2: {
    label: "Grade A2",
    color: "var(--chart-4)",
  },
  b1: {
    label: "Grade B1",
    color: "var(--chart-1)",
  },
  b2: {
    label: "Grade B2",
    color: "var(--chart-2)",
  },
};

export function GradeDistributionChart() {
  return (
    <Card className="col-span-1 lg:col-span-3">
      <CardHeader>
        <CardTitle>Répartition par Grade</CardTitle>
        <CardDescription>Distribution du stock par qualité</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
            ></Pie>
            <Legend />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
