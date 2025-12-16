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
import { fetchData } from "@/app/_utils/api";
const paymentConfig = {
  visitors: { label: "Paiements" },
  mobile: { label: "Mobile Money", color: "var(--chart-2)" },
  bancaire: { label: "Bancaire", color: "var(--chart-1)" },
  sans_compte: { label: "Sans compte", color: "var(--chart-5)" },
};

export function PaymentChart() {
  const [data, setData] = React.useState({});
  React.useEffect(() => {
    const getCultivators = async () => {
      try {
        const response = await fetchData(
          "get",
          `/cafe/stationslavage/cultivateurs_par_moyen_paiement/`,
          {
            params: {},
            additionalHeaders: {},
            body: {},
          }
        );
        const chartData = response.map((item) => ({
          mode: item?.cultivator_payment_type,
          visitors: item?.count,
          fill:
            item?.cultivator_payment_type === "mobile_money"
              ? "var(--color-mobile)"
              : item?.cultivator_payment_type === "bank_transfer"
              ? "var(--color-bancaire)"
              : "var(--color-sans_compte)",
        }));
        setData(chartData);
      } catch (error) {
        console.error("Error fetching cultivators data:", error);
      }
    };

    getCultivators();
  }, []);
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
              data={data}
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
