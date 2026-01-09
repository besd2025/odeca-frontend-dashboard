"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Scale, Tag, Wallet } from "lucide-react";
import { fetchData } from "@/app/_utils/api";
import { StatsCardSkeleton } from "@/components/ui/skeletons";
export function KPIGrid() {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    const getDatas = async () => {
      try {
        const response = await fetchData("get", `cafe/cafe_prices/current/`, {
          params: {},
          additionalHeaders: {},
          body: {},
        });

        const kpiData = [
          {
            title: "Prix Achat CA",
            value: response?.cerise_a,
            trendUp: true,
            icon: Tag,
            color: "text-orange-500",
            bgColor: "bg-orange-500/10",
          },
          {
            title: "Prix Achat CB",
            value: response?.cerise_b,
            trendUp: true,
            icon: Tag,
            color: "text-secondary",
            bgColor: "bg-secondary/10",
          },
        ];

        setData(kpiData);
      } catch (error) {
        console.error("Error fetching cultivators data:", error);
      } finally {
        setLoading(false);
      }
    };

    getDatas();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-rows-2 gap-4">
        <StatsCardSkeleton />
        <StatsCardSkeleton />
      </div>
    );
  }

  return (
    <div className="grid grid-rows-2 gap-4">
      {data.map((kpi, index) => (
        <Card key={index} className="shadow-sm">
          <CardContent className=" flex flex-col justify-between h-full gap-2">
            <div className="flex justify-between items-start">
              <div className={`p-2 rounded-md ${kpi.bgColor}`}>
                <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold tabular-nums">
                {kpi.value} <span className="text-base">FBU/Kg</span>{" "}
              </div>
              <div className="text-muted-foreground font-medium mt-1">
                {kpi.title}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
