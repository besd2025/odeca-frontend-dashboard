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
  { status: "Actif", count: 120, fill: "var(--color-actif)" },
  { status: "Non Actif", count: 30, fill: "var(--color-inactif)" },
];

const chartConfig = {
  count: {
    label: "SDLs",
  },
  actif: {
    label: "Actif",
    color: "var(--chart-2)",
  },
  inactif: {
    label: "Non Actif",
    color: "var(--chart-5)",
  },
};

export function SdlActiveChart() {
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Statut des SDLs</CardTitle>
        <CardDescription>Actif vs Non Actif</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="[&_.recharts-text]:fill-background mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="count" hideLabel />}
            />
            <Pie data={chartData} dataKey="count">
              <LabelList
                dataKey="status"
                className="fill-background"
                stroke="none"
                fontSize={12}
                formatter={(value) =>
                  chartConfig[value.toLowerCase().replace(" ", "")]?.label ||
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
