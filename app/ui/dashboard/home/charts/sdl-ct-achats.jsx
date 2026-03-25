"use client";
import React, { useState } from "react";
import { AreaChart, CartesianGrid, XAxis, Area, LabelList, LineChart } from "recharts";
import { TrendingUp } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchData } from "@/app/_utils/api";
import { ChartSkeleton } from "@/components/ui/skeletons";

const chartConfig = {
  ceriseA: { label: "Cerise A", color: "var(--chart-5)" },
  ceriseB: { label: "Cerise B", color: "var(--secondary)" },
};

export function ChartLineAchats() {
  const [period, setPeriod] = useState("mois");
  const [dataByPeriod, setDataByPeriod] = useState({});
  const [isLoading, setIsLoading] = React.useState(true);

  const handleTimePeriodChange = (value) => {
    setPeriod(value);
  };

  React.useEffect(() => {
    async function getData() {
      setIsLoading(true);
      try {
        const periodParam =
          period === "jour"
            ? "day"
            : period === "semaine"
              ? "week"
              : period === "annee"
                ? "year"
                : "month";
        const results = await fetchData(
          "get",
          `/cafe/stationslavage/get_recent_total_7_cultivators_per_days_or_weeks_or_months_for_line_chart?period=${periodParam}`,
          { params: {}, additionalHeaders: {}, body: {} },
        );
        if (!Array.isArray(results)) return;

        const chartData = results.map((item) => ({
          time: item.period,
          day: item.period,
          month: item.period,
          year: item.period,
          ceriseA: item.quantite_cerise_a || 0,
          ceriseB: item.quantite_cerise_b || 0,
        }));

        setDataByPeriod((prev) => ({
          ...prev,
          [period]: chartData,
        }));
      } catch (error) {
        console.error("Erreur API :", error);
      } finally {
        setIsLoading(false);
      }
    }

    getData();
  }, [period]);

  if (isLoading && !dataByPeriod[period]) {
    return (
      <div className=" w-full">
        <ChartSkeleton className="h-[500px]" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Achats du café</CardTitle>
        <CardDescription>Filtrer par période</CardDescription>

        <Tabs
          value={period}
          onValueChange={handleTimePeriodChange}
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
            data={dataByPeriod[period] || []}
            margin={{
              top: 24,
              left: 12,
              right: 20,
            }}

          >
            <defs>
              <linearGradient id="fillCeriseA" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-ceriseA)"
                  stopOpacity={0.5}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-ceriseA)"
                  stopOpacity={0}
                />
              </linearGradient>
              <linearGradient id="fillCeriseB" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-ceriseB)"
                  stopOpacity={0.5}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-ceriseB)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
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
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="ceriseA"
              type="natural"
              fill="url(#fillCeriseA)"
              stroke="var(--color-ceriseA)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-ceriseA)",
              }}
              activeDot={{
                r: 6,
              }}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground font-medium"
                fontSize={12}
              />
            </Area>
            <Area
              dataKey="ceriseB"
              type="natural"
              fill="url(#fillCeriseB)"
              stroke="var(--color-ceriseB)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-ceriseB)",
              }}
              activeDot={{
                r: 6,
              }}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground font-medium"
                fontSize={12}
              />
            </Area>
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Affichage des achats par {period} <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  );
}
