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
    { time: "00:00", count: 40 },
    { time: "04:00", count: 30 },
    { time: "08:00", count: 20 },
    { time: "12:00", count: 27 },
    { time: "16:00", count: 20 },
    { time: "20:00", count: 30 },
    { time: "23:59", count: 10 },
  ],
  semaine: [
    { day: "Lun", count: 186 },
    { day: "Mar", count: 305 },
    { day: "Mer", count: 237 },
    { day: "Jeu", count: 73 },
    { day: "Ven", count: 209 },
    { day: "Sam", count: 214 },
    { day: "Dim", count: 150 },
  ],
  mois: [
    { month: "January", count: 186 },
    { month: "February", count: 305 },
    { month: "March", count: 237 },
    { month: "April", count: 73 },
    { month: "May", count: 209 },
    { month: "June", count: 214 },
  ],
  annee: [
    { year: "2020", count: 1000 },
    { year: "2021", count: 1500 },
    { year: "2022", count: 1800 },
    { year: "2023", count: 2100 },
    { year: "2024", count: 2500 },
  ],
};

const chartConfig = {
  count: {
    label: "Enregistrements:",
    color: "var(--secondary)",
  },
};

export function RegistrationChart() {
  const [period, setPeriod] = useState("mois");

  return (
    <Card className="lg:col-span-5">
      <CardHeader className="flex flex-col gap-y-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <CardTitle>Enregistrements</CardTitle>
          <CardDescription>Nouveaux cultivateurs inscrits</CardDescription>
        </div>

        <Tabs
          defaultValue="mois"
          value={period}
          onValueChange={setPeriod}
          className="w-full lg:w-[250px]"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="jour">Jour</TabsTrigger>
            <TabsTrigger value="semaine">Semaine</TabsTrigger>
            <TabsTrigger value="mois">Mois</TabsTrigger>
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
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-count)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-count)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="count"
              type="natural"
              fill="url(#fillMobile)"
              fillOpacity={0.4}
              stroke="var(--color-count)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
