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
import { Separator } from "@/components/ui/separator";

export function LabSectionCards() {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3 dark:*:data-[slot=card]:bg-card">

      {/* 1. Échantillons Reçus */}
      <Card className="@container/card">
        <CardHeader>
          <CardTitle className="text-xl font-bold tabular-nums text-foreground">
            147
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
                14
              </CardTitle>
            </div>
            <div className="border-l border-primary/50 pl-2">
              <CardDescription className="text-muted-foreground text-xs">En cours d'analyse</CardDescription>
              <CardTitle className="font-bold tabular-nums text-foreground">
                4
              </CardTitle>
            </div>
          </div>
          <div>
            <CardDescription className="text-muted-foreground text-xs">Analysés & Rapports émis</CardDescription>
            <CardTitle className="font-bold tabular-nums text-foreground">
              133
            </CardTitle>
          </div>
        </CardContent>
      </Card>

      {/* 2. Granulométrie */}
      <Card className="@container/card">
        <CardHeader>
          <CardTitle className="text-xl font-bold tabular-nums text-foreground">
            45
          </CardTitle>
          <CardDescription className="text-muted-foreground text-sm">Analyses Granulométriques</CardDescription>

        </CardHeader>
        <Separator />
        <CardContent className="grid gap-3">
          <div className="grid grid-cols-2 border border-primary/50 rounded-md p-2">
            <div >
              <CardDescription className="text-muted-foreground text-xs">Prêts à analyser</CardDescription>
              <CardTitle className="font-bold tabular-nums text-foreground">
                8
              </CardTitle>
            </div>
            <div className="border-l border-primary/50 pl-2">
              <CardDescription className="text-muted-foreground text-xs">En cours</CardDescription>
              <CardTitle className="font-bold tabular-nums text-foreground">
                37
              </CardTitle>
            </div>
          </div>
          <div>
            <CardDescription className="text-muted-foreground text-xs">Analyses complétées (total)</CardDescription>
            <CardTitle className="font-bold tabular-nums text-foreground">
              37
            </CardTitle>
          </div>
        </CardContent>
      </Card>

      {/* 3. Triage Manuel */}
      <Card className="@container/card">
        <CardHeader>
          <CardTitle className="text-xl font-bold tabular-nums text-foreground">
            32
          </CardTitle>
          <CardDescription className="text-muted-foreground text-sm">Triages Manuels</CardDescription>

        </CardHeader>
        <Separator />
        <CardContent className="grid gap-3">
          <div className="grid grid-cols-2 border border-primary/50 rounded-md p-2">
            <div >
              <CardDescription className="text-muted-foreground text-xs">En attente de triage</CardDescription>
              <CardTitle className="font-bold tabular-nums text-foreground">
                6
              </CardTitle>
            </div>
            <div className="border-l border-primary/50 pl-2">
              <CardDescription className="text-muted-foreground text-xs">En cours</CardDescription>
              <CardTitle className="font-bold tabular-nums text-foreground">
                26
              </CardTitle>
            </div>
          </div>
          <CardDescription className="text-muted-foreground text-xs">Triages complétés</CardDescription>
          <CardTitle className="font-bold tabular-nums text-foreground">
            26
          </CardTitle>
        </CardContent>
      </Card>


      {/* 5. Rapports de Taxation */}
      <Card className="@container/card">
        <CardHeader>
          <CardTitle className="text-xl font-bold tabular-nums text-foreground">
            45
          </CardTitle>
          <CardDescription className="text-muted-foreground text-sm">Rapports de Taxation Émis</CardDescription>

        </CardHeader>
        <Separator />
        <CardContent className="grid gap-1 pt-3">
          <CardDescription className="text-muted-foreground text-xs">Rapports liés à un contrat</CardDescription>
          <CardTitle className="font-bold tabular-nums text-foreground">
            38
          </CardTitle>
          <CardDescription className="text-muted-foreground text-xs">Rapports en attente de liaison</CardDescription>
          <CardTitle className="font-bold tabular-nums text-amber-600 dark:text-amber-400">
            7
          </CardTitle>
        </CardContent>
      </Card>

    </div>
  );
}
