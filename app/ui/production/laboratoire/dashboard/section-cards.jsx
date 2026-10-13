"use client";
import { IconTrendingUp, IconTrendingDown } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import * as React from "react";
import { Separator } from "@/components/ui/separator";
import { fetchData } from "@/app/_utils/api";
export function LabSectionCards() {
  const [data, setData] = React.useState([
    {
      total_receptionne: "",
      total_analyse_echantillon: "",
      total_encours_analyse_echantillon: "",
      total_en_attente_analyse_echantillon: "",
      total_analyse_granulometrie: "",
      total_encours_analyse_granulometrie: "",
      total_en_attente_analyse_granulometrie: "",
      total_deja_analyse_granulometrie: "",
      total_analyse_trie: "",
      total_encours_analyse_trie: "",
      total_en_attente_analyse_trie: "",
      total_deja_analyse_trie: "",
      total_cafe_taxe: "",
      total_cafe_exporte: "",
      total_sac_restant: ""
    }
  ])
  React.useEffect(() => {
    const fetch = async () => {
      const response = await fetchData('get', 'cafe/echantillonage/echantionnage_stats/')
      console.log(" echantillonage :", response)
      const granulometries = await fetchData('get', 'cafe/echantillonage/granulometrie-stats-complete/')
      console.log(" granulometrie :", granulometries)
      const tries = await fetchData('get', 'cafe/echantillonage/triage-stats-complete/')
      const taxes = await fetchData('get', 'cafe/stock_cafe/rapports_taxation_stats/')
      console.log(" taxes :", taxes)
      const newData = {
        total_receptionne: response?.total,
        total_analyse_echantillon: response?.analyses_terminees,
        total_encours_analyse_echantillon: response?.en_cours,
        total_en_attente_analyse_echantillon: response?.en_attente,
        total_analyse_granulometrie: granulometries?.total_analyses,
        total_encours_analyse_granulometrie: granulometries?.en_cours,
        total_en_attente_analyse_granulometrie: granulometries?.prets_analyser,
        total_deja_analyse_granulometrie: granulometries?.analyses_completees,
        total_analyse_trie: tries?.total_triages,
        total_encours_analyse_trie: tries?.en_cours,
        total_en_attente_analyse_trie: tries?.en_attente,
        total_deja_analyse_trie: tries?.triages_completes,
        total_rapport_taxation: taxes?.total_rapports,
        total_rapport_attente_liaison: taxes?.rapports_attente,
        total_rapport_lies: taxes?.rapports_lies,

      }
      setData(newData)

    }
    fetch()
  }, [])
  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3 dark:*:data-[slot=card]:bg-card">

      {/* 1. Échantillons Reçus */}
      <Card className="@container/card">
        <CardHeader>
          <CardTitle className="text-xl font-bold tabular-nums text-foreground">
            {data?.total_receptionne}
          </CardTitle>
          <CardDescription className="text-muted-foreground text-sm">Échantillons Reçus</CardDescription>
          <CardAction>
            <Badge variant="outline" className="bg-sky-50 text-sky-700 dark:bg-sky-950/20 dark:text-sky-400 border-sky-200 text-xs">
              Total Labo
            </Badge>
          </CardAction>
        </CardHeader>
        <Separator />
        <CardContent className="grid gap-3">
          <div className="grid grid-cols-2 gap-2 border border-primary/50 rounded-md p-2">
            <div >
              <CardDescription className="text-muted-foreground text-xs">En attente d'analyse</CardDescription>
              <CardTitle className="font-bold tabular-nums text-foreground">
                {data?.total_en_attente_analyse_echantillon}
              </CardTitle>
            </div>
            <div className="border-l border-primary/50 pl-2">
              <CardDescription className="text-muted-foreground text-xs">En cours d'analyse</CardDescription>
              <CardTitle className="font-bold tabular-nums text-foreground">
                {data?.total_encours_analyse_echantillon}
              </CardTitle>
            </div>
          </div>
          <div>
            <CardDescription className="text-muted-foreground text-xs">Analysés & Rapports émis</CardDescription>
            <CardTitle className="font-bold tabular-nums text-foreground">
              {data?.total_analyse_echantillon}
            </CardTitle>
          </div>
        </CardContent>
      </Card>

      {/* 2. Granulométrie */}
      <Card className="@container/card">
        <CardHeader>
          <CardTitle className="text-xl font-bold tabular-nums text-foreground">
            {data?.total_analyse_granulometrie}
          </CardTitle>
          <CardDescription className="text-muted-foreground text-sm">Analyses Granulométriques</CardDescription>

        </CardHeader>
        <Separator />
        <CardContent className="grid gap-3">
          <div className="grid grid-cols-2 border border-primary/50 rounded-md p-2">
            <div >
              <CardDescription className="text-muted-foreground text-xs">Prêts à analyser</CardDescription>
              <CardTitle className="font-bold tabular-nums text-foreground">
                {data?.total_en_attente_analyse_granulometrie}
              </CardTitle>
            </div>
            <div className="border-l border-primary/50 pl-2">
              <CardDescription className="text-muted-foreground text-xs">En cours</CardDescription>
              <CardTitle className="font-bold tabular-nums text-foreground">
                {data?.total_encours_analyse_granulometrie}
              </CardTitle>
            </div>
          </div>
          <div>
            <CardDescription className="text-muted-foreground text-xs">Analyses complétées (total)</CardDescription>
            <CardTitle className="font-bold tabular-nums text-foreground">
              {data?.total_deja_analyse_granulometrie}
            </CardTitle>
          </div>
        </CardContent>
      </Card>

      {/* 3. Triage Manuel */}
      <Card className="@container/card">
        <CardHeader>
          <CardTitle className="text-xl font-bold tabular-nums text-foreground">
            {data?.total_analyse_trie}
          </CardTitle>
          <CardDescription className="text-muted-foreground text-sm">Triages Manuels</CardDescription>

        </CardHeader>
        <Separator />
        <CardContent className="grid gap-3">
          <div className="grid grid-cols-2 border border-primary/50 rounded-md p-2">
            <div >
              <CardDescription className="text-muted-foreground text-xs">En attente de triage</CardDescription>
              <CardTitle className="font-bold tabular-nums text-foreground">
                {data?.total_en_attente_analyse_trie}
              </CardTitle>
            </div>
            <div className="border-l border-primary/50 pl-2">
              <CardDescription className="text-muted-foreground text-xs">En cours</CardDescription>
              <CardTitle className="font-bold tabular-nums text-foreground">
                {data?.total_encours_analyse_trie}
              </CardTitle>
            </div>
          </div>
          <CardDescription className="text-muted-foreground text-xs">Triages complétés</CardDescription>
          <CardTitle className="font-bold tabular-nums text-foreground">
            {data?.total_deja_analyse_trie}
          </CardTitle>
        </CardContent>
      </Card>


      {/* 5. Rapports de Taxation */}
      <Card className="@container/card">
        <CardHeader>
          <CardTitle className="text-xl font-bold tabular-nums text-foreground">
            {data?.total_rapport_taxation}
          </CardTitle>
          <CardDescription className="text-muted-foreground text-sm">Rapports de Taxation Émis</CardDescription>

        </CardHeader>
        <Separator />
        <CardContent className="grid gap-1 pt-3">
          <CardDescription className="text-muted-foreground text-xs">Rapports liés à un contrat</CardDescription>
          <CardTitle className="font-bold tabular-nums text-foreground">
            {data?.total_rapport_lies}
          </CardTitle>
          <CardDescription className="text-muted-foreground text-xs">Rapports en attente de liaison</CardDescription>
          <CardTitle className="font-bold tabular-nums text-amber-600 dark:text-amber-400">
            {data?.total_rapport_attente_liaison}
          </CardTitle>
        </CardContent>
      </Card>

    </div>
  );
}
