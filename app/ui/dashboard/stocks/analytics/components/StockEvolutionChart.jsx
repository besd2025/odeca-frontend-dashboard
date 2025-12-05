"use client";

import { useState } from "react";
import { AreaChart, CartesianGrid, Area, XAxis } from "recharts";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const stockDataByPeriod = {
  mois: [
    { date: "Jan", amount: 40 },
    { date: "Feb", amount: 45 },
    { date: "Mar", amount: 35 },
    { date: "Apr", amount: 50 },
    { date: "May", amount: 55 },
    { date: "Jun", amount: 58.2 },
  ],
  annee: [
    { date: "2020", amount: 120 },
    { date: "2021", amount: 150 },
    { date: "2022", amount: 180 },
    { date: "2023", amount: 210 },
    { date: "2024", amount: 250 },
  ],
};

const chartConfig = {
  amount: {
    label: "Stock (T)",
    color: "hsl(var(--primary))",
  },
};

export function StockEvolutionChart() {
  const [period, setPeriod] = useState("mois");

  return (
    <Card className="lg:col-span-4">
      <CardHeader className="flex flex-col gap-y-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <CardTitle>Évolution du Stock</CardTitle>
          <CardDescription>Tendance du volume stocké</CardDescription>
        </div>
        <Tabs
          defaultValue="mois"
          value={period}
          onValueChange={setPeriod}
          className="w-full lg:w-[200px]"
        >
          <TabsList className="grid w-full grid-cols-2">
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
            data={stockDataByPeriod[period]}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="fillStock" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-amount)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-amount)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="amount"
              type="natural"
              fill="url(#fillStock)"
              fillOpacity={0.4}
              stroke="var(--color-amount)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
