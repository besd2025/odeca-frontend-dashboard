"use client";

import { useState } from "react";
import { AreaChart, CartesianGrid, Area, XAxis } from "recharts";

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
    { time: "00:00", ceriseA: 40, ceriseB: 24 },
    { time: "04:00", ceriseA: 30, ceriseB: 13 },
    { time: "08:00", ceriseA: 20, ceriseB: 98 },
    { time: "12:00", ceriseA: 27, ceriseB: 39 },
    { time: "16:00", ceriseA: 20, ceriseB: 20 },
    { time: "20:00", ceriseA: 30, ceriseB: 35 },
    { time: "23:59", ceriseA: 10, ceriseB: 26 },
  ],
  semaine: [
    { day: "Lun", ceriseA: 186, ceriseB: 80 },
    { day: "Mar", ceriseA: 305, ceriseB: 200 },
    { day: "Mer", ceriseA: 237, ceriseB: 120 },
    { day: "Jeu", ceriseA: 73, ceriseB: 190 },
    { day: "Ven", ceriseA: 209, ceriseB: 130 },
    { day: "Sam", ceriseA: 214, ceriseB: 140 },
    { day: "Dim", ceriseA: 150, ceriseB: 100 },
  ],
  mois: [
    { month: "January", ceriseA: 186, ceriseB: 80 },
    { month: "February", ceriseA: 305, ceriseB: 200 },
    { month: "March", ceriseA: 237, ceriseB: 120 },
    { month: "April", ceriseA: 73, ceriseB: 190 },
    { month: "May", ceriseA: 209, ceriseB: 130 },
    { month: "June", ceriseA: 214, ceriseB: 140 },
  ],
  annee: [
    { year: "2020", ceriseA: 1000, ceriseB: 500 },
    { year: "2021", ceriseA: 1500, ceriseB: 800 },
    { year: "2022", ceriseA: 1800, ceriseB: 900 },
    { year: "2023", ceriseA: 2100, ceriseB: 1200 },
    { year: "2024", ceriseA: 2500, ceriseB: 1400 },
  ],
};

const chartConfig = {
  ceriseA: {
    label: "Cerise A",
    color: "var(--chart-5)",
  },
  ceriseB: {
    label: "Cerise B",
    color: "var(--secondary)",
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
          className="w-full max-w-sm mt-4"
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
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[300px] w-full"
        >
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
                  stopColor="var(--color-ceriseA)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-ceriseA)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-ceriseB)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-ceriseB)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="ceriseB"
              type="natural"
              fill="url(#fillMobile)"
              fillOpacity={0.4}
              stroke="var(--color-ceriseB)"
              stackId="a"
            />
            <Area
              dataKey="ceriseA"
              type="natural"
              fill="url(#fillDesktop)"
              fillOpacity={0.4}
              stroke="var(--color-ceriseA)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
