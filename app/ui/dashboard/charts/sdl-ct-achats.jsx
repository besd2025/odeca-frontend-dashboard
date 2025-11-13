"use client";

import { useState } from "react";
import { TrendingUp } from "lucide-react";
import { AreaChart, CartesianGrid, Area, LineChart, XAxis } from "recharts";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const description = "A multiple line chart";

// Données pour différentes périodes
const charDataByPeriod = {
  jour: [
    { time: "00:00", desktop: 40, mobile: 24 },
    { time: "04:00", desktop: 30, mobile: 13 },
    { time: "08:00", desktop: 20, mobile: 98 },
    { time: "12:00", desktop: 27, mobile: 39 },
    { time: "16:00", desktop: 20, mobile: 20 },
    { time: "20:00", desktop: 30, mobile: 35 },
    { time: "23:59", desktop: 10, mobile: 26 },
  ],
  semaine: [
    { day: "Lun", desktop: 186, mobile: 80 },
    { day: "Mar", desktop: 305, mobile: 200 },
    { day: "Mer", desktop: 237, mobile: 120 },
    { day: "Jeu", desktop: 73, mobile: 190 },
    { day: "Ven", desktop: 209, mobile: 130 },
    { day: "Sam", desktop: 214, mobile: 140 },
    { day: "Dim", desktop: 150, mobile: 100 },
  ],
  mois: [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
  ],
  annee: [
    { year: "2020", desktop: 1000, mobile: 500 },
    { year: "2021", desktop: 1500, mobile: 800 },
    { year: "2022", desktop: 1800, mobile: 900 },
    { year: "2023", desktop: 2100, mobile: 1200 },
    { year: "2024", desktop: 2500, mobile: 1400 },
  ],
};

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
};

export function ChartLineAchats() {
  const [period, setPeriod] = useState("mois");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Achats du cafe</CardTitle>
        <CardDescription>Filtrer par période</CardDescription>

        <Tabs
          defaultValue="mois"
          value={period}
          onValueChange={setPeriod}
          className="w-full mt-4"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="jour">Jour</TabsTrigger>
            <TabsTrigger value="semaine">Semaine</TabsTrigger>
            <TabsTrigger value="mois">Mois</TabsTrigger>
            <TabsTrigger value="annee">Année</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          {/* <LineChart
            accessibilityLayer
            data={charDataByPeriod[period]}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={
                period === "jour"
                  ? "time"
                  : period === "semaine"
                  ? "day"
                  : period === "mois"
                  ? "month"
                  : "year"
              }
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                if (
                  period === "jour" ||
                  period === "semaine" ||
                  period === "annee"
                ) {
                  return value;
                }
                return value.slice(0, 3);
              }}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="desktop"
              type="monotone"
              stroke="var(--color-desktop)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="mobile"
              type="monotone"
              stroke="var(--color-mobile)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart> */}
          <AreaChart
            accessibilityLayer
            data={charDataByPeriod[period]}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={
                period === "jour"
                  ? "time"
                  : period === "semaine"
                  ? "day"
                  : period === "mois"
                  ? "month"
                  : "year"
              }
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                if (
                  period === "jour" ||
                  period === "semaine" ||
                  period === "annee"
                ) {
                  return value;
                }
                return value.slice(0, 3);
              }}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="mobile"
              type="natural"
              fill="url(#fillMobile)"
              fillOpacity={0.4}
              stroke="var(--color-mobile)"
              stackId="a"
            />
            <Area
              dataKey="desktop"
              type="natural"
              fill="url(#fillDesktop)"
              fillOpacity={0.4}
              stroke="var(--color-desktop)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
