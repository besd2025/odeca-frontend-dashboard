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
  { grade: "Grade A1", amount: 45.2, fill: "var(--color-gradeA1)" },
  { grade: "Grade A2", amount: 12.8, fill: "var(--color-gradeA2)" },
  { grade: "Grade B1", amount: 50.2, fill: "var(--color-gradeB1)" },
  { grade: "Grade B2", amount: 10.8, fill: "var(--color-gradeB2)" },
];

const chartConfig = {
  amount: {
    label: "Quantité (T)",
  },
  gradeA1: {
    label: "Grade A1",
    color: "var(--chart-5)",
  },
  gradeA2: {
    label: " Grade A2",
    color: "var(--chart-4)",
  },
  gradeB1: {
    label: "Grade B1",
    color: "var(--chart-3)",
  },
  gradeB2: {
    label: "Grade B2",
    color: "var(--chart-2)",
  },
};

export function StockTypeChart() {
  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle>Répartition par Grade</CardTitle>
        <CardDescription>Comparaison des grades de cerises</CardDescription>
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
              dataKey="grade"
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
              fill="url(#fillStock)"
              layout="vertical"
              radius={4}
              barSize={40}
            >
              <LabelList
                dataKey="grade"
                position="insideLeft"
                offset={8}
                className="fill-white"
                fontSize={12}
              />
              <LabelList
                dataKey="amount"
                position="right"
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
