import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Eye,
  ClipboardList,
  AlertCircle,
  CheckCircle2,
  PackageCheck,
  Play,
  Tag,
  MoreHorizontal,
  Layers,
} from "lucide-react";
import PaginationContent from "@/components/ui/pagination-content";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Status helpers
const STATUS_CONFIG = {
  "Prêt à trier": {
    badge: (
      <Badge
        variant="outline"
        className="border-blue-200 bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800 flex items-center gap-1 whitespace-nowrap"
      >
        <ClipboardList className="h-3 w-3" />
        Prêt à trier
      </Badge>
    ),
  },
  "En cours de triage": {
    badge: (
      <Badge
        variant="outline"
        className="border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800 flex items-center gap-1 whitespace-nowrap"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
        </span>
        En cours de triage
      </Badge>
    ),
  },
  "Trié & Stocké": {
    badge: (
      <Badge
        variant="outline"
        className="border-secondary/20 bg-secondary/10 text-secondary dark:bg-secondary/30 dark:text-secondary dark:border-secondary/30 flex items-center gap-1 whitespace-nowrap"
      >
        <CheckCircle2 className="h-3.5 w-3.5" />
        Trié & Stocké
      </Badge>
    ),
  },
  "Trié & Stocké (Direct)": {
    badge: (
      <Badge
        variant="outline"
        className="border-secondary/20 bg-secondary/10 text-secondary dark:bg-secondary/30 dark:text-secondary dark:border-secondary/30 flex items-center gap-1 whitespace-nowrap"
      >
        <PackageCheck className="h-3.5 w-3.5" />
        Stocké (Direct)
      </Badge>
    ),
  },
};

export default function TriageList({ lots, onStartTriage, onLabelDirect, onFinalize, onViewDetails }) {
  const [activeTab, setActiveTab] = React.useState("all");

  const filteredLots = lots.filter((lot) => {
    if (activeTab === "all") return true;
    return lot.status.toLowerCase() === activeTab.toLowerCase();
  });

  const isStocked = (lot) =>
    lot.status === "Trié & Stocké" || lot.status === "Trié & Stocké (Direct)";
  const isInProgress = (lot) => lot.status === "En cours de triage";
  const isReady = (lot) => lot.status === "Prêt à trier";

  return (
    <Card className="shadow-xs dark:bg-slate-950 border-slate-200 dark:border-slate-800">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-primary" /> Suivi des Lots de Triage
        </CardTitle>
        <CardDescription>
          Liste des lots prêts à trier, en cours de triage et étiquetés/stockés.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {lots.length > 0 && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="flex w-full overflow-x-auto justify-start h-10 p-1 bg-slate-100 dark:bg-slate-900 select-none mb-4 gap-1">
              <TabsTrigger value="all" className="flex items-center gap-1.5 px-3 py-1 text-xs md:text-sm">
                <Layers className="h-3.5 w-3.5 text-slate-500" />
                <span>Tous ({lots.length})</span>
              </TabsTrigger>
              <TabsTrigger value="Prêt à trier" className="flex items-center gap-1.5 px-3 py-1 text-xs md:text-sm">
                <ClipboardList className="h-3.5 w-3.5 text-blue-500" />
                <span>Prêt à trier ({lots.filter(l => l.status === "Prêt à trier").length})</span>
              </TabsTrigger>
              <TabsTrigger value="En cours de triage" className="flex items-center gap-1.5 px-3 py-1 text-xs md:text-sm">
                <Play className="h-3.5 w-3.5 text-amber-500" />
                <span>En cours de triage ({lots.filter(l => l.status === "En cours de triage").length})</span>
              </TabsTrigger>
              <TabsTrigger value="Trié & Stocké" className="flex items-center gap-1.5 px-3 py-1 text-xs md:text-sm">
                <CheckCircle2 className="h-3.5 w-3.5 text-indigo-500" />
                <span>Trié & Stocké ({lots.filter(l => l.status === "Trié & Stocké").length})</span>
              </TabsTrigger>
              <TabsTrigger value="Trié & Stocké (Direct)" className="flex items-center gap-1.5 px-3 py-1 text-xs md:text-sm">
                <PackageCheck className="h-3.5 w-3.5 text-violet-500" />
                <span>Stocké (Direct) ({lots.filter(l => l.status === "Trié & Stocké (Direct)").length})</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}

        {lots.length === 0 ? (
          <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center bg-slate-50/50 dark:bg-slate-900/30">
            <AlertCircle className="h-8 w-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Aucun lot à trier pour le moment. Les lots finalisés en usinage apparaissent ici.
            </p>
          </div>
        ) : filteredLots.length === 0 ? (
          <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center bg-slate-50/50 dark:bg-slate-900/30">
            <AlertCircle className="h-8 w-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Aucun lot avec le statut "{activeTab === "Trié & Stocké (Direct)" ? "Stocké (Direct)" : activeTab}" pour le moment.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code Lot</TableHead>
                <TableHead>Société & SDLs</TableHead>
                <TableHead>Grade / Poids Initial</TableHead>
                <TableHead>Date Entrée</TableHead>
                <TableHead>Date Sortie</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right sticky right-0 bg-sidebar shadow-2xl">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLots.map((lot) => (
                <TableRow key={lot.id}>
                  {/* Code Lot */}
                  <TableCell className="font-bold text-slate-900 dark:text-white whitespace-nowrap">
                    {lot.id}
                  </TableCell>

                  {/* Société & SDLs */}
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {lot.societe}
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {lot.sdls?.map((sdl) => (
                          <span
                            key={sdl}
                            className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded"
                          >
                            {sdl}
                          </span>
                        ))}
                      </div>
                    </div>
                  </TableCell>

                  {/* Grade / Poids */}
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {Object.entries(lot.grades).map(([grade, qty]) => (
                        <div key={grade} className="text-xs flex items-center gap-1.5">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {grade}:
                          </span>
                          <span className="text-slate-600 dark:text-slate-400">{qty} sacs</span>
                        </div>
                      ))}
                    </div>
                  </TableCell>

                  {/* Date Entrée */}
                  <TableCell className="text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    {lot.dateEntree || <span className="text-slate-400">—</span>}
                  </TableCell>

                  {/* Date Sortie */}
                  <TableCell className="text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    {lot.dateSortie || <span className="text-slate-400">—</span>}
                  </TableCell>

                  {/* Statut */}
                  <TableCell>
                    {STATUS_CONFIG[lot.status]?.badge ?? (
                      <Badge variant="outline">{lot.status}</Badge>
                    )}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right sticky right-0 bg-background shadow-2xl border-l border-slate-200 dark:border-slate-800">

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel className="text-muted-foreground font-normal text-xs">
                          Actions
                        </DropdownMenuLabel>
                        {isStocked(lot) ? (
                          <DropdownMenuItem>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onViewDetails(lot)}
                              className="h-8 text-xs flex items-center gap-1.5 w-full"
                            >
                              <Eye className="h-3.5 w-3.5" /> Détails
                            </Button>
                          </DropdownMenuItem>
                        ) : isInProgress(lot) ? (
                          <DropdownMenuItem>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => onFinalize(lot)}
                              className="h-8 text-xs  flex items-center gap-1.5 w-full"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5 text-white" /> Finaliser le triage
                            </Button>
                          </DropdownMenuItem>
                        ) : isReady(lot) ? (
                          <DropdownMenuItem>
                            <div className="flex flex-col gap-2">
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => onStartTriage(lot)}
                                className="h-8 text-xs flex items-center gap-1.5"
                              >
                                <Play className="h-3.5 w-3.5 text-white" /> Trier
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onLabelDirect(lot)}
                                className="h-8 text-xs flex items-center gap-1.5"
                              >
                                <Tag className="h-3.5 w-3.5" /> Stocker(Direct)
                              </Button>
                            </div>
                          </DropdownMenuItem>
                        ) : null}

                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        <PaginationContent />
      </CardContent>
    </Card>
  );
}
