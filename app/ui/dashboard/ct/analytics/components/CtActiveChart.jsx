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
import React from "react";
import { fetchData } from "@/app/_utils/api";

const chartConfig = {
  count: {
    label: "CTs",
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

export function CtActiveChart() {
  const [data, setData] = React.useState([]);
  React.useEffect(() => {
    const getCts = async () => {
      try {
        const response = await fetchData(
          "get",
          `cafe/centres_transite/get_active_and_non_active_ct/`,
          {
            params: {},
            additionalHeaders: {},
            body: {},
          }
        );
        const chartData = [
          {
            status: "Actif",
            count: response?.achat_cafes_ct,
            fill: "var(--color-actif)",
          },
          {
            status: "Non Actif",
            count: response?.inactive_ct,
            fill: "var(--color-inactif)",
          },
        ];
        setData(chartData);
      } catch (error) {
        console.error("Error fetching cultivators data:", error);
      }
    };

    getCts();
  }, []);
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Statut des CTs</CardTitle>
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
            <Pie data={data} dataKey="count">
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
