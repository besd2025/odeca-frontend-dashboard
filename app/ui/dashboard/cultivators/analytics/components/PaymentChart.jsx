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
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { PieChart, Pie, LabelList } from "recharts";

const paymentData = [
  { mode: "mobile", visitors: 1200, fill: "var(--color-mobile)" },
  { mode: "bancaire", visitors: 800, fill: "var(--color-bancaire)" },
  { mode: "sans_compte", visitors: 230, fill: "var(--color-sans_compte)" },
];

const paymentConfig = {
  visitors: { label: "Paiements" },
  mobile: { label: "Mobile Money", color: "var(--chart-2)" },
  bancaire: { label: "Bancaire", color: "var(--chart-1)" },
  sans_compte: { label: "Sans compte", color: "var(--chart-5)" },
};

export function PaymentChart() {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Modes de Paiement</CardTitle>
        <CardDescription>Préférences de paiement</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={paymentConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={paymentData}
              dataKey="visitors"
              nameKey="mode"
              innerRadius={40}
              strokeWidth={5}
            >
              <LabelList
                dataKey="mode"
                className="fill-sidebar-foreground"
                stroke="none"
                fontSize={12}
                formatter={(value) => paymentConfig[value]?.label}
              />
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="mode" />}
              className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
