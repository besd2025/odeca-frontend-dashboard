import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Scale, Tag, Wallet } from "lucide-react";

const kpiData = [
  // {
  //   title: "Qualité (Cerise A)",
  //   value: "78%",
  //   trend: "+2.4%",
  //   trendUp: true,
  //   icon: Scale,
  //   color: "text-blue-500",
  //   bgColor: "bg-blue-500/10",
  // },
  {
    title: "Prix Achat CA",
    value: "2800",
    trend: "+50 FBU",
    trendUp: true,
    icon: Tag,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    title: "Prix Achat CB",
    value: "1850",
    trend: "+50 FBU",
    trendUp: true,
    icon: Tag,
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  // {
  //   title: "Prix Vente",
  //   value: "1,250 FBU",
  //   trend: "-10 FBU",
  //   trendUp: false,
  //   icon: Wallet,
  //   color: "text-green-500",
  //   bgColor: "bg-green-500/10",
  // },
  // {
  //   title: "Marge Brute",
  //   value: "32%",
  //   trend: "+1.2%",
  //   trendUp: true,
  //   icon: TrendingUp,
  //   color: "text-purple-500",
  //   bgColor: "bg-purple-500/10",
  // },
];

export function KPIGrid() {
  return (
    <div className="grid grid-rows-2 gap-4">
      {kpiData.map((kpi, index) => (
        <Card key={index} className="shadow-sm">
          <CardContent className=" flex flex-col justify-between h-full gap-2">
            <div className="flex justify-between items-start">
              <div className={`p-2 rounded-md ${kpi.bgColor}`}>
                <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
              </div>
              {kpi.trend && (
                <div
                  className={`flex items-center text-xs font-medium ${
                    kpi.trendUp ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {kpi.trendUp ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
                  {kpi.trend}
                </div>
              )}
            </div>
            <div>
              <div className="text-2xl font-bold tabular-nums">
                {kpi.value} <span className="text-lg">FBU/Kg</span>{" "}
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
