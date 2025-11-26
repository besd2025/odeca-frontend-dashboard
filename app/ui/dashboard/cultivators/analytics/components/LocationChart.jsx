"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

const locationData = {
  province: [
    { name: "Province A", count: 850 },
    { name: "Province B", count: 620 },
    { name: "Province C", count: 480 },
    { name: "Province D", count: 280 },
  ],
  region: [
    { name: "Region X", count: 320 },
    { name: "Region Y", count: 290 },
    { name: "Region Z", count: 240 },
    { name: "Region W", count: 210 },
    { name: "Region V", count: 180 },
  ],
};

const locationConfig = {
  count: {
    label: "Caféiculteurs",
    color: "var(--chart-5)",
  },
};

export function LocationChart() {
  const [locFilter, setLocFilter] = useState("province");

  return (
    <Card className="lg:col-span-1">
      <CardHeader className="flex flex-col gap-y-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <CardTitle>Répartition Géographique</CardTitle>
          <CardDescription>Par Province ou Région</CardDescription>
        </div>
        <Tabs
          defaultValue="province"
          onValueChange={setLocFilter}
          className="w-full lg:w-[250px]"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="province">Province</TabsTrigger>
            <TabsTrigger value="region">Région</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={locationConfig}
          className="aspect-auto h-[300px] w-full"
        >
          {/* <BarChart
            accessibilityLayer
            data={locationData[locFilter]}
            layout="vertical"
            margin={{
              left: 0,
            }}
          >
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <XAxis dataKey="count" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="count" fill="var(--color-count)" radius={4} />
          </BarChart> */}

          <BarChart
            accessibilityLayer
            data={locationData[locFilter]}
            layout="vertical"
            margin={{
              right: 16,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
              hide
            />
            <XAxis dataKey="count" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="count"
              layout="vertical"
              fill="var(--color-count)"
              barSize={40}
              radius={4}
            >
              <LabelList
                dataKey="name"
                position="insideLeft"
                offset={8}
                className="fill-white"
                fontSize={12}
              />
              <LabelList
                dataKey="count"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
