import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export default function PaymentStats() {
  const chartData = [
    {
      browser: "chrome",
      type: " Pas encore paye",
      cafeiculteurs: 275,
      fill: "var(--chart-1)",
      taux: "11% ",
    },

    {
      browser: "firefox",
      type: " Paye en moyenne",
      cafeiculteurs: 287,
      fill: "var(--chart-3)",
      taux: "28.6% ",
    },
    {
      browser: "other",
      type: " Paye en totalite",
      cafeiculteurs: 190,
      fill: "var(--chart-5)",
      taux: "63.9% ",
    },
  ];
  const chartConfig = {
    cafeiculteurs: {
      label: "Cafeiculteurs",
    },
    chrome: {
      label: "Pas encore paye:",
      color: "var(--chart-1)",
    },
    firefox: {
      label: "Paye en moyenne:",
      color: "var(--chart-3)",
    },
    other: {
      label: "Paye en totalite:",
      color: "var(--chart-5)",
    },
  };

  const totalCafeiculteurs = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.cafeiculteurs, 0);
  }, []);
  return (
    <>
      {/* Storage usage */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Statut des paiements</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="cafeiculteurs"
                nameKey="browser"
                innerRadius={60}
                strokeWidth={5}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {totalCafeiculteurs.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Cafeiculteurs
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>

          <div className="space-y-4">
            {chartData.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-lg">
                  <Users className="text-muted-foreground h-4 w-4" />
                </div>
                <div
                  className="size-3 rounded-full"
                  style={{ backgroundColor: item.fill }}
                ></div>
                <div className="flex-1">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium">{item.type}</span>
                  </div>
                  <div className="text-muted-foreground text-xs">
                    {item.taux} | {item.cafeiculteurs} Cafeiculteurs
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
