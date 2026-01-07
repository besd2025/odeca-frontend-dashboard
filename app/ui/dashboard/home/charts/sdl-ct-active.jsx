"use client";
import React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { fetchData } from "@/app/_utils/api";
import { ChartSkeleton } from "@/components/ui/skeletons";

const chartConfig = {
  active: {
    label: "Actif",
    color: "var(--chart-1)",
  },
  inactive: {
    label: "Inactif",
    color: "var(--chart-5)",
  },
};

export function ChartPieSdlCtActive() {
  const [data, setData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  React.useEffect(() => {
    const getDatas = async () => {
      setIsLoading(true);
      try {
        const response = await fetchData(
          "get",
          `/cafe/stationslavage/get_sdl_ct_usine_avec_achat_ou_enregistrement_cultivateurs/`,
          {
            params: {},
            additionalHeaders: {},
            body: {},
          }
        );
        const chartData = [
          {
            entity: "UDPs",
            active: response?.usine_active,
            inactive: response?.total_usine - response?.usine_active,
          },
          {
            entity: "SDLs",
            active: response?.achat_cafes_sdl,
            inactive: response?.total_sdl - response?.achat_cafes_sdl,
          },
          {
            entity: "CTs",
            active: response?.achat_cafes_ct,
            inactive: response?.total_ct - response?.achat_cafes_ct,
          },
        ];

        setData(chartData);
      } catch (error) {
        console.error("Error fetching cultivators data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getDatas();
  }, []);

  if (isLoading) {
    return <ChartSkeleton />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparaison d'Activité</CardTitle>
        <CardDescription>Actifs vs Inactifs par Entité</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="entity"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="active"
              stackId="a"
              fill="var(--color-active)"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="inactive"
              stackId="a"
              fill="var(--color-inactive)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
