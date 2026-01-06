"use client";
import React, { useState } from "react";
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
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchData } from "@/app/_utils/api";

const chartConfig = {
  ceriseA: { label: "Cerise A", color: "var(--chart-5)" },
  ceriseB: { label: "Cerise B", color: "var(--secondary)" },
};

export function ChartLineAchats() {
  const [period, setPeriod] = useState("mois");
  const [dataByPeriod, setDataByPeriod] = useState({}); // ← nouveau nom

  const handleTimePeriodChange = (value) => {
    setPeriod(value);
  };

  React.useEffect(() => {
    async function getData() {
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
          { params: {}, additionalHeaders: {}, body: {} }
        );
        console.log("Fetching data for period:", results);
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
      }
    }

    getData();
  }, [period]);

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
            data={dataByPeriod[period] || []} // ← corrected
            margin={{ left: 12, right: 12 }}
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
            />

            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

            <defs>
              <linearGradient id="fillCeriseA" x1="0" y1="0" x2="0" y2="1">
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

              <linearGradient id="fillCeriseB" x1="0" y1="0" x2="0" y2="1">
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
              fill="url(#fillCeriseB)"
              stroke="var(--color-ceriseB)"
              stackId="a"
            />
            <Area
              dataKey="ceriseA"
              type="natural"
              fill="url(#fillCeriseA)"
              stroke="var(--color-ceriseA)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
