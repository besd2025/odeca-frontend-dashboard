"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { entity: "Caféiculteurs", active: 1850, inactive: 380 },
  { entity: "SDLs", active: 1200, inactive: 300 },
  { entity: "CTs", active: 650, inactive: 200 },
];

const chartConfig = {
  active: {
    label: "Actif",
    color: "var(--chart-1)",
  },
  inactive: {
    label: "Inactif",
    color: "var(--chart-5)",
  },
};

export function ChartPieSdlCtActive() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparaison d'Activité</CardTitle>
        <CardDescription>Actifs vs Inactifs par Entité</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="entity"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="active"
              stackId="a"
              fill="var(--color-active)"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="inactive"
              stackId="a"
              fill="var(--color-inactive)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
