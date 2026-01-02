"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Grape, ArrowDownToLine } from "lucide-react";
import { fetchData } from "@/app/_utils/api";

export function UsineSummaryCards() {
  const [data, setData] = React.useState({
    total_usine: 0,
    stock_cafe_vert: 0,
    qty_recu_transfert: 0,
  });

  React.useEffect(() => {
    const getData = async () => {
      try {
        // Trying to fetch global Usine stats.
        // Assuming endpoint or calculating from list locally if global endpoint doesn't exist.
        // For now, I'll try to fetch a summary endpoint if it exists, roughly mirroring SDL.
        // If specific endpoints for these totals don't exist, we might need to aggregate or mocking for now.

        // Placeholder implementation for "Cafe Vert" and "Transfert Recu" as these are new requirements
        // and might not have a dedicated global endpoint yet.
        // Using `cafe/usines/get_stats/` as a hypothetical endpoint or similar.

        // Retaining the 'active/inactive' fetch structure from SDL but adapting to Usine if needed
        // For this specific request "Cafe Vert" and "Quantite recu", I will add cards for them.

        // const response = await fetchData("get", `cafe/usines/get_global_stats/`, {});

        // Since I don't have the backend, I will set dummy data structure to request from backend
        // or attempt to fetch and fallback.

        // Replicating SDL fetch for total Count first:
        const responseUsines = await fetchData("get", "cafe/usines/", {});
        const totalUsines = responseUsines?.count || 0;

        setData((prev) => ({ ...prev, total_usine: totalUsines }));

        // Hypothetical fetch for Cafe Vert Stock and Transfer Received
        // const stockResponse = await fetchData("get", "cafe/usines/get_total_stock_cafe_vert/", {});
        // const transferResponse = await fetchData("get", "cafe/usines/get_total_transfer_received/", {});

        // Setting mock/placeholder data for visualization as requested
        setData((prev) => ({
          ...prev,
          stock_cafe_vert: 12500, // Placeholder
          qty_recu_transfert: 45000, // Placeholder
        }));
      } catch (error) {
        console.error("Error fetching usine stats:", error);
      }
    };

    getData();
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="@container/card">
        <CardHeader>
          <div className="flex flex-row gap-x-2 items-center">
            <div className="bg-primary p-2 rounded-md">
              <Building2 className="text-white" />
            </div>
            <CardTitle className="text-2xl @[250px]/card:text-3xl font-semibold tracking-tight tabular-nums ml-2">
              {data.total_usine}
            </CardTitle>
          </div>
          <CardTitle className="text-lg font-semibold tabular-nums ml-2">
            Effectif Total des Usines
          </CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 ">
          <CardTitle className="font-medium">Stock Café Vert</CardTitle>
          <Grape className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {data.stock_cafe_vert.toLocaleString()}{" "}
            <span className="text-sm font-normal">Kg</span>
          </div>
          <p className="text-xs text-muted-foreground">Global</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 ">
          <CardTitle className="font-medium">Reçu (Transfert)</CardTitle>
          <ArrowDownToLine className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {data.qty_recu_transfert.toLocaleString()}{" "}
            <span className="text-sm font-normal">Kg</span>
          </div>
          <p className="text-xs text-muted-foreground">Depuis les SDLs</p>
        </CardContent>
      </Card>
    </div>
  );
}
