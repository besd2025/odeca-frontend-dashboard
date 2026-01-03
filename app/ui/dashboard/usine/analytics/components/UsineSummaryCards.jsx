"use client";

import React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Building2,
  Grape,
  ArrowDownToLine,
  Factory,
  Leaf,
  Truck,
} from "lucide-react";
import { fetchData } from "@/app/_utils/api";

export function UsineSummaryCards() {
  const [data, setData] = React.useState({
    total_usine: 0,
    qty_recu: 0,
    total_traite: 0,
    total_produit: 0,
    total_sorti: 0,
    stock_cafe_vert: 0,
  });

  React.useEffect(() => {
    const getData = async () => {
      try {
        const responseUsines = await fetchData("get", "cafe/usines/", {});
        const totalUsines = responseUsines?.count || 0;

        // Mock data for new KPIs as global endpoints might not exist yet
        setData({
          total_usine: totalUsines,
          qty_recu: 45000,
          total_traite: 35000,
          total_produit: 28000,
          total_sorti: 15000,
          stock_cafe_vert: 12500,
        });
      } catch (error) {
        console.error("Error fetching usine stats:", error);
      }
    };

    getData();
  }, []);

  const cards = [
    {
      title: "Effectif Total des Usines",
      value: data.total_usine,
      icon: Building2,
      color: "bg-primary",
      unit: "",
      desc: "Nombre d'usines",
    },
    {
      title: "Qte. Réceptionnée",
      value: data.qty_recu,
      icon: ArrowDownToLine,
      color: "bg-blue-600",
      unit: "Kg",
      desc: "Depuis les SDLs",
    },
    {
      title: "Qte. Usinée",
      value: data.total_traite,
      icon: Factory,
      color: "bg-orange-500",
      unit: "Kg",
      desc: "Total traité",
    },
    {
      title: "Qte. Café Vert Produit",
      value: data.total_produit,
      icon: Leaf,
      color: "bg-green-600",
      unit: "Kg",
      desc: "Production nette",
    },
    {
      title: "Qte. Café Vert Sorti",
      value: data.total_sorti,
      icon: Truck,
      color: "bg-red-500",
      unit: "Kg",
      desc: "Expéditions",
    },
    {
      title: "Stock Café Vert",
      value: data.stock_cafe_vert,
      icon: Grape,
      color: "bg-emerald-600",
      unit: "Kg",
      desc: "Global",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {cards.map((card, index) => (
        <Card key={index} className="@container/card">
          <CardHeader>
            <div className="flex flex-row gap-x-2 items-center">
              <div className={`${card.color} p-2 rounded-md`}>
                <card.icon className="text-white w-5 h-5" />
              </div>
              <CardTitle className="text-xl font-semibold tracking-tight tabular-nums ml-1">
                {card.value.toLocaleString()}
                {card.unit && <span className="text-sm ml-1">{card.unit}</span>}
              </CardTitle>
            </div>
            <CardTitle className="text-base font-medium text-muted-foreground mt-2 ml-1">
              {card.title}
            </CardTitle>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
