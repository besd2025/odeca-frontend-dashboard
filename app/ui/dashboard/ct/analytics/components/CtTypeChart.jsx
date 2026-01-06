"use client";
import { LabelList, Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { type: "Privée", count: 55, fill: "var(--color-privee)" },
  { type: "Publique", count: 30, fill: "var(--color-publique)" },
];

const chartConfig = {
  count: {
    label: "CTs",
  },
  privee: {
    label: "Privée",
    color: "var(--chart-3)",
  },
  publique: {
    label: "Publique",
    color: "var(--chart-5)",
  },
};

export function CtTypeChart() {
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Type de CT</CardTitle>
        <CardDescription>Privées vs Publiques</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="[&_.recharts-text]:fill-black mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="count" hideLabel />}
            />
            <Pie data={chartData} dataKey="count">
              <LabelList
                dataKey="type"
                className="fill-black"
                stroke="none"
                fontSize={12}
                formatter={(value) =>
                  chartConfig[value.toLowerCase().replace("é", "e")]?.label ||
                  value
                }
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
