import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

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

export function SectionCards() {
  return (
    <div
      className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3 dark:*:data-[slot=card]:bg-card">

      {/* 1. Café Parche Apporté */}
      <Card className="@container/card">
        <CardHeader>

          <CardTitle className="text-xl font-bold tabular-nums text-foreground">
            450,000 Kg
          </CardTitle>
          <CardDescription className="text-muted-foreground text-sm">Café Parche Receptionné</CardDescription>
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
            320,400 Kg
          </CardTitle>
          <CardDescription className="text-muted-foreground text-sm">Café Parche Usiné</CardDescription>
          <CardAction>
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border-emerald-200">
              71.2% du total
            </Badge>
          </CardAction>
        </CardHeader>
        <Separator />
        <CardContent className="grid gap-1">
          <CardDescription className="text-muted-foreground text-xs">En cours d'usinage</CardDescription>
          <CardTitle className="font-bold tabular-nums text-foreground">
            200,000 Kg
          </CardTitle>
          <CardDescription className="text-muted-foreground text-xs">En attente d'usinage</CardDescription>
          <CardTitle className="font-bold tabular-nums text-foreground">
            120,400 Kg
          </CardTitle>
        </CardContent>
      </Card>

      {/* 3. Café Parche Trié */}
      <Card className="@container/card">
        <CardHeader>
          <CardTitle className="text-xl font-bold tabular-nums text-foreground">
            259,524 Kg
          </CardTitle>
          <CardDescription className="text-muted-foreground text-sm">Café Trié</CardDescription>
          <CardAction>
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border-emerald-200">
              Rendement: 81%
            </Badge>
          </CardAction>
        </CardHeader>
        <Separator />
        <CardContent className="grid gap-1">
          <CardDescription className="text-muted-foreground text-xs">En cours de tri</CardDescription>
          <CardTitle className="font-bold tabular-nums text-foreground">
            200,000 Kg
          </CardTitle>
          <CardDescription className="text-muted-foreground text-xs">En attente de tri</CardDescription>
          <CardTitle className="font-bold tabular-nums text-foreground">
            120,400 Kg
          </CardTitle>
        </CardContent>
      </Card>

      {/* 4. Café Taxé */}
      <Card className="@container/card">
        <CardHeader>

          <CardTitle className="text-xl font-bold tabular-nums text-foreground">
            180,000 Kg
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
            79,524 Kg
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
          <CardDescription className="text-muted-foreground text-sm">Café Stocké</CardDescription>
          <CardAction>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400 border-blue-200">
              Swift Validés
            </Badge>
          </CardAction>
        </CardHeader>
        <Separator />
        <CardContent className="grid gap-1">
          <CardDescription className="text-muted-foreground text-xs">Café Parche Restant</CardDescription>
          <CardTitle className="font-bold tabular-nums text-foreground">
            129,600 Kg
          </CardTitle>
          <CardDescription className="text-muted-foreground text-xs">Café Exporté</CardDescription>
          <CardTitle className="font-bold tabular-nums text-foreground">
            129,600 Kg
          </CardTitle>
        </CardContent>
      </Card>
    </div>
  );
}
