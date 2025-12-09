"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Package, DollarSign, TrendingUp } from "lucide-react";
import { fetchData } from "@/app/_utils/api";

export function StockSummaryCard() {
  const [data, setData] = React.useState({});
  React.useEffect(() => {
    const getDatas = async () => {
      try {
        const response = await fetchData(
          "get",
          `/cafe/achat_cafe/get_total_achat/`,
          {
            params: {},
            additionalHeaders: {},
            body: {},
          }
        );

        setData(response);
        console.log("Cultivators data fetched:", response);
      } catch (error) {
        console.error("Error fetching cultivators data:", error);
      }
    };

    getDatas();
  }, []);
  return (
    <Card className="@container/stock h-full">
      <CardHeader>
        <div className="flex flex-row gap-x-2 items-center">
          <div className="bg-destructive p-2 rounded-md">
            <Package className="text-white" />
          </div>
          <CardTitle className="text-lg font-semibold">Stock Actuel</CardTitle>
        </div>
        <CardDescription>État des stocks en temps réel</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1 p-3 bg-primary/10 rounded-lg">
            <span className="font-medium text-muted-foreground">Cerise A</span>
            <span className="text-2xl font-bold text-primary">
              {data?.total_cerise_a_achat >= 1000 ? (
                <>
                  {(data?.total_cerise_a_achat / 1000).toLocaleString("fr-FR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  <span className="text-base">T</span>
                </>
              ) : (
                <>
                  {data?.total_cerise_a_achat?.toLocaleString("fr-FR") || 0}{" "}
                  <span className="text-base">Kg</span>
                </>
              )}
            </span>
            <span className="text-xs text-muted-foreground">
              {(data?.total_montant_cerise_a_achat ?? 0)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}
              FBU
            </span>
          </div>
          <div className="flex flex-col gap-1 p-3 bg-secondary/10 rounded-lg">
            <span className="font-medium text-muted-foreground">Cerise B</span>
            <span className="text-2xl font-bold text-secondary">
              {" "}
              {data?.total_cerise_b_achat >= 1000 ? (
                <>
                  {(data?.total_cerise_b_achat / 1000).toLocaleString("fr-FR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  <span className="text-base">T</span>
                </>
              ) : (
                <>
                  {data?.total_cerise_b_achat?.toLocaleString("fr-FR") || 0}{" "}
                  <span className="text-base">Kg</span>
                </>
              )}
            </span>
            <span className="text-xs text-muted-foreground">
              {(data?.total_montant_cerise_b_achat ?? 0)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}
              FBU
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1 p-3 border rounded">
            <span className="font-medium text-muted-foreground">Grades A</span>
            <div className="flex flex-col gap-1 text-sm font-medium text-muted-foreground">
              <span>A1 : 30T</span>
              <span>A2 : 15.2T</span>
            </div>
          </div>
          <div className="flex flex-col gap-1 p-3 border rounded">
            <span className="font-medium text-muted-foreground">Grades B</span>
            <div className="flex flex-col gap-1 text-sm font-medium text-muted-foreground">
              <span>B1 : 8T</span>
              <span>B2 : 4.8T</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 justify-between p-3 border/5 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="bg-green-100 p-1.5 rounded-full dark:bg-green-900">
              <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Valeur Totale</span>
              <span className="text-xs text-muted-foreground">Estimée</span>
            </div>
          </div>
          <span className="text-xl font-bold tabular-nums">53M FBU</span>
        </div>
      </CardContent>
    </Card>
  );
}
