"use client"
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"
import React from "react";
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator";
import { fetchData } from "@/app/_utils/api";
export function SectionCards() {
  const [data, setData] = React.useState([
    {
      total_receptionne: 0,
      total_cafe_usine: 0,
      total_cafe_trie: 0,
      total_cafe_taxe: 0,
      total_cafe_exporte: 0,
      total_sac_restant: 0
    }
  ])
  React.useEffect(() => {
    const fetch = async () => {
      const response = await fetchData('get', 'cafe/transfert_sdl_usine_detail_comfimation/get_total_receptionne/')
      const usinees = await fetchData('get', 'cafe/usinages/get_total_quantite_usine_et_encours_usinage/')
      const tries = await fetchData('get', 'cafe/triage/get_total_quantite_usine_et_encours_triage/')
      const taxe = await fetchData('get', 'cafe/stock_cafe/cafe-taxation-stats-detail/')
      const pretExport = await fetchData('get', 'cafe/stock_cafe/societe-stock-stats-detail/')
      const StockInitial = await fetchData('get', 'cafe/prestockage_apres_usinage/get_total_quantite_and_sacs_initial/')
      console.log("StockInitial : ", StockInitial)
      const newData = {
        total_receptionne: response?.total_net,
        total_cafe_usine: usinees?.total_quantite_termine,
        total_encours_usinage: usinees?.total_encours,
        total_en_attente_usinage: usinees?.total - usinees?.total_quantite_termine - usinees?.total_encours,
        total_cafe_trie: tries?.total_quantite_termine,
        total_encours_trie: tries?.total_encours,
        total_en_attente_trie: tries?.total - tries?.total_quantite_termine - tries?.total_encours,
        total_cafe_taxe: usinees?.total_cafe_taxe,
        total_cafe_exporte: response?.total_cafe_exporte,
        total_sac_restant: response?.total_sac_restant,
        total_cafe_taxe: taxe?.cafe_taxe,
        total_cafe_non_taxe: taxe?.cafe_non_taxe,
        nombre_sac_initial: StockInitial?.total_sacs,
        quantite_initial: StockInitial?.total_poids,
        // total_cafe_exporte: pretExport?.total_exportable,
        // total_cafe_en_stock: pretExport?.total

      }
      setData(newData)

    }
    fetch()
  }, [])
  return (
    <div
      className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3 dark:*:data-[slot=card]:bg-card">

      {/* 1. Café Parche Apporté */}
      <Card className="@container/card">
        <CardHeader className="gap-2">
          <CardTitle className="text-xl font-bold tabular-nums text-foreground">
            {(() => {
              const kg = Number(data.total_receptionne || 0);
              const isTonne = kg >= 1000;
              const value = isTonne ? kg / 1000 : kg;
              const unit = isTonne ? "T" : "Kg";

              return `${value.toLocaleString("fr-FR")} ${unit}`;
            })()}
          </CardTitle>
          <CardDescription className="text-muted-foreground text-sm">Café Parche Receptionné</CardDescription>
          <Separator />

          <CardAction>
            <Badge variant="outline" className="bg-sky-50 text-sky-700 dark:bg-sky-950/20 dark:text-sky-400 border-sky-200 text-xs">
              Total Entrées
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>

      {/* 2. Café Parche Usiné */}
      <Card className="@container/card">
        <CardHeader>

          <CardTitle className="text-xl font-bold tabular-nums text-foreground">
            {(() => {
              const kg = Number(data.total_cafe_usine || 0);
              const isTonne = kg >= 1000;
              const value = isTonne ? kg / 1000 : kg;
              const unit = isTonne ? "T" : "Kg";

              return `${value.toLocaleString("fr-FR")} ${unit}`;
            })()}
          </CardTitle>
          <CardDescription className="text-muted-foreground text-sm">Café Parche Usiné</CardDescription>
          <CardAction>
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border-emerald-200">
              {data.total_cafe_usine / data.total_receptionne * 100} % du total
            </Badge>
          </CardAction>
        </CardHeader>
        <Separator />
        <CardContent className="grid gap-1">
          <CardDescription className="text-muted-foreground text-xs">En cours d'usinage</CardDescription>
          <CardTitle className="font-bold tabular-nums text-foreground">
            {(() => {
              const kg = Number(data.total_encours_usinage || 0);
              const isTonne = kg >= 1000;
              const value = isTonne ? kg / 1000 : kg;
              const unit = isTonne ? "T" : "Kg";

              return `${value.toLocaleString("fr-FR")} ${unit}`;
            })()}
          </CardTitle>
          <CardDescription className="text-muted-foreground text-xs">En attente d'usinage</CardDescription>
          <CardTitle className="font-bold tabular-nums text-foreground">
            {(() => {
              const kg = Number(data.total_en_attente_usinage || 0);
              const isTonne = kg >= 1000;
              const value = isTonne ? kg / 1000 : kg;
              const unit = isTonne ? "T" : "Kg";

              return `${value.toLocaleString("fr-FR")} ${unit}`;
            })()}
          </CardTitle>
        </CardContent>
      </Card>

      {/* 3. Café Parche Trié */}
      <Card className="@container/card">
        <CardHeader>
          <CardTitle className="text-xl font-bold tabular-nums text-foreground">
            {(() => {
              const kg = Number(data.total_cafe_trie || 0);
              const isTonne = kg >= 1000;
              const value = isTonne ? kg / 1000 : kg;
              const unit = isTonne ? "T" : "Kg";

              return `${value.toLocaleString("fr-FR")} ${unit}`;
            })()}
          </CardTitle>
          <CardDescription className="text-muted-foreground text-sm">Café Trié</CardDescription>
          <CardAction>
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border-emerald-200">
              Rendement: {data.total_cafe_trie / data.total_receptionne * 100} %
            </Badge>
          </CardAction>
        </CardHeader>
        <Separator />
        <CardContent className="grid gap-1">
          <CardDescription className="text-muted-foreground text-xs">En cours de tri</CardDescription>
          <CardTitle className="font-bold tabular-nums text-foreground">
            {(() => {
              const kg = Number(data.total_encours_trie || 0);
              const isTonne = kg >= 1000;
              const value = isTonne ? kg / 1000 : kg;
              const unit = isTonne ? "T" : "Kg";

              return `${value.toLocaleString("fr-FR")} ${unit}`;
            })()}
          </CardTitle>
          <CardDescription className="text-muted-foreground text-xs">En attente de tri</CardDescription>
          <CardTitle className="font-bold tabular-nums text-foreground">
            {(() => {
              const kg = Number(data.total_en_attente_trie || 0);
              const isTonne = kg >= 1000;
              const value = isTonne ? kg / 1000 : kg;
              const unit = isTonne ? "T" : "Kg";

              return `${value.toLocaleString("fr-FR")} ${unit}`;
            })()}
          </CardTitle>
        </CardContent>
      </Card>

      {/* 4. Café Taxé */}
      <Card className="@container/card">
        <CardHeader>

          <CardTitle className="text-xl font-bold tabular-nums text-foreground">
            {(() => {
              const kg = Number(data.total_cafe_taxe || 0);
              const isTonne = kg >= 1000;
              const value = isTonne ? kg / 1000 : kg;
              const unit = isTonne ? "T" : "Kg";

              return `${value.toLocaleString("fr-FR")} ${unit}`;
            })()}
          </CardTitle>
          <CardDescription className="text-muted-foreground text-sm">Café Taxé</CardDescription>
          <CardAction>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 dark:bg-purple-950/20 dark:text-purple-400 border-purple-200">
              Rapports Labo Liés
            </Badge>
          </CardAction>
        </CardHeader>
        <Separator />
        <CardContent className="grid gap-1">
          <CardTitle className="text-xl font-bold tabular-nums text-foreground">
            {(() => {
              const kg = Number(data.total_cafe_non_taxe || 0);
              const isTonne = kg >= 1000;
              const value = isTonne ? kg / 1000 : kg;
              const unit = isTonne ? "T" : "Kg";

              return `${value.toLocaleString("fr-FR")} ${unit}`;
            })()}
          </CardTitle>
          <CardDescription className="text-muted-foreground text-sm">Café Non Taxé</CardDescription>
          <CardAction>
            <Badge variant="outline" className="bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border-amber-200">
              En file d'attente
            </Badge>
          </CardAction>
        </CardContent>
      </Card>


      {/* 6. Café Exporté */}
      <Card className="@container/card">
        <CardHeader>
          <CardTitle className="text-xl font-bold tabular-nums text-foreground">
            45,000 Kg
          </CardTitle>
          <CardDescription className="text-muted-foreground text-sm">Café Pret a Exporter</CardDescription>
          <CardAction>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400 border-blue-200">
              Swift Validés
            </Badge>
          </CardAction>
        </CardHeader>
        <Separator />
        <CardContent className="grid gap-1">
          {/* <CardDescription className="text-muted-foreground text-xs">Café Parche Restant</CardDescription>
          <CardTitle className="font-bold tabular-nums text-foreground">
            129,600 Kg
          </CardTitle> */}
          <CardDescription className="text-muted-foreground text-xs">Café Exporté</CardDescription>
          <CardTitle className="font-bold tabular-nums text-foreground">
            129,600 Kg
          </CardTitle>
        </CardContent>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardTitle className="text-xl font-bold tabular-nums text-foreground">
            {(() => {
              const kg = Number(data.quantite_initial || 0);
              const isTonne = kg >= 1000;
              const value = isTonne ? kg / 1000 : kg;
              const unit = isTonne ? "T" : "Kg";

              return `${value.toLocaleString("fr-FR")} ${unit}`;
            })()}
          </CardTitle>
          <CardDescription className="text-muted-foreground text-sm">Stock Initiale</CardDescription>
        </CardHeader>
        <Separator />
      </Card>
    </div>
  );
}
