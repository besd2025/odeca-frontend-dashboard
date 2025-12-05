"use client";
import { TrendingUp } from "lucide-react";
import { LabelList, Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
export const description = "A pie chart with a label list";
const chartData = [
  { browser: "Homme", visitors: 275, fill: "var(--color-hommes)" },
  { browser: "Femme", visitors: 200, fill: "var(--color-femmes)" },
];
const chartConfig = {
  visitors: {
    label: "Cafeiculteurs :",
  },
  hommes: {
    label: "Hommes",
    color: "var(--chart-1)",
  },
  femmes: {
    label: "Femmes",
    color: "var(--chart-5)",
  },
};

export function GenreChart() {
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Répartition par Genre</CardTitle>
        <CardDescription>Hommes vs Femmes</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="[&_.recharts-text]:fill-background mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="visitors" hideLabel />}
            />
            <Pie data={chartData} dataKey="visitors">
              <LabelList
                dataKey="browser"
                className="fill-background"
                stroke="none"
                fontSize={12}
                formatter={(value) => chartConfig[value]?.label}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
