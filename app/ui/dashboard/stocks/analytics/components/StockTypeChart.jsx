"use client";

import React from "react";
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
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
} from "recharts";

const stockData = [
  { type: "Cerise A", amount: 45.2, fill: "var(--color-ceriseA)" },
  { type: "Cerise B", amount: 12.8, fill: "var(--color-ceriseB)" },
];

const chartConfig = {
  amount: {
    label: "Quantité (T)",
  },
  ceriseA: {
    label: "Cerise A",
    color: "hsl(var(--chart-1))",
  },
  ceriseB: {
    label: "Cerise B",
    color: "hsl(var(--chart-2))",
  },
};

export function StockTypeChart() {
  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle>Répartition par Type</CardTitle>
        <CardDescription>Comparaison des types de cerises</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[300px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={stockData}
            layout="vertical"
            margin={{
              right: 16,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="type"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              hide
            />
            <XAxis dataKey="amount" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="amount"
              layout="vertical"
              radius={4}
              barSize={40}
            >
              <LabelList
                dataKey="type"
                position="insideLeft"
                offset={8}
                className="fill-white"
                fontSize={12}
              />
              <LabelList
                dataKey="amount"
                position="insideRight"
                offset={8}
                className="fill-white"
                fontSize={12}
                formatter={(value) => `${value} T`}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
