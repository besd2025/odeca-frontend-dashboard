import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Eye, FileText, CheckCircle2, AlertCircle, Layers, ClipboardList, PackageCheck, List, Settings } from "lucide-react";
import PaginationContent from "@/components/ui/pagination-content";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InputForm from "./InputForm";

export default function ProcessingList({ lots, onFinalize, onViewDetails }) {
  const [activeTab, setActiveTab] = React.useState("Reception");

  const filteredLots = lots.filter((lot) => {
    if (activeTab === "all") return true;
    return lot.status.toLowerCase() === activeTab.toLowerCase();
  });

  return (
    <Card className="shadow-xs dark:bg-slate-950 border-slate-200 dark:border-slate-800">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" /> Suivi des Lots en Usinage
        </CardTitle>
        <CardDescription>
          Liste des lots en cours d'usinage et historique des lots finalisés.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {lots.length > 0 && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="flex w-full overflow-x-auto justify-start h-10 p-1 bg-slate-100 dark:bg-slate-900 select-none mb-4 gap-1">

              <TabsTrigger value="Reception" className="flex items-center gap-1.5 px-3 py-1 text-xs md:text-sm">
                <Layers className="h-3.5 w-3.5 text-slate-500" />
                <span>Pretes à l'usinage ({lots.length})</span>
              </TabsTrigger>
              <TabsTrigger value="En cours" className="flex items-center gap-1.5 px-3 py-1 text-xs md:text-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                <span>En cours ({lots.filter(l => l.status === "En cours").length})</span>
              </TabsTrigger>
              <TabsTrigger value="Finalisé" className="flex items-center gap-1.5 px-3 py-1 text-xs md:text-sm">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                <span>Finalisé ({lots.filter(l => l.status === "Finalisé").length})</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}

        {lots.length === 0 ? (
          <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center bg-slate-50/50 dark:bg-slate-900/30">
            <AlertCircle className="h-8 w-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Aucun lot enregistré pour le moment. Utilisez le formulaire ci-dessus pour lancer un usinage.
            </p>
          </div>
        ) : filteredLots.length === 0 ? (
          <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center bg-slate-50/50 dark:bg-slate-900/30">
            <AlertCircle className="h-8 w-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Aucun lot "{activeTab === "Trié & Stocké (Direct)" ? "Stocké (Direct)" : activeTab}" pour le moment.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Société & SDLs</TableHead>
                {activeTab === "Finalisé" && (
                  <TableHead>Date d'Usinage</TableHead>
                )}
                <TableHead>Quantité</TableHead>
                <TableHead >Statut</TableHead>
                {activeTab === "Finalisé" && (
                  <TableHead>Date Sortie</TableHead>
                )}
                <TableHead className="text-right bg-red-900 sticky right-0 bg-side/bar shadow-2xl">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLots.map((lot) => {
                const isFinished = lot.status === "Finalisé";
                const isReadyForUsinage = lot.status === "Reception";
                const isInProcess = lot.status === "En cours";
                return (
                  <TableRow key={lot.id}>
                    <TableCell className="font-bold text-slate-900 dark:text-white">
                      {lot.id}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          {lot.societe}
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {lot.selectedSDLs.map((sdl) => (
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
                    {isFinished && (
                      <TableCell className="text-slate-600 dark:text-slate-400">
                        {lot.dateUsinage}
                      </TableCell>
                    )}
                    <TableCell>
                      <div className="flex flex-col gap-1">

                        <div className="text-xs flex items-center gap-1.5">
                          <span className="text-slate-600 dark:text-slate-400">
                            {lot.usinageQuantitiesTotal} kg
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {isFinished && (
                        <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800 flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Finalisé
                        </Badge>
                      )}
                      {isInProcess && (
                        <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800 flex items-center gap-1">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                          </span>
                          En cours
                        </Badge>
                      )}
                      {isReadyForUsinage && (
                        <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800 flex items-center gap-1">
                          <Settings className="h-3.5 w-3.5" />
                          Pretes à l'usinage
                        </Badge>
                      )}
                    </TableCell>
                    {isFinished && (
                      <TableCell className="text-slate-600 dark:text-slate-400">
                        {lot.dateSortie}
                      </TableCell>
                    )}
                    <TableCell className="text-right sticky right-0 bg-background shadow-2xl border-l border-slate-200 dark:border-slate-800">
                      {isFinished && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onViewDetails(lot)}
                          className="h-8 text-xs flex items-center gap-1.5 ml-auto bg-sidebar"
                        >
                          <Eye className="h-3.5 w-3.5" /> Détails
                        </Button>
                      )}
                      {isInProcess && (
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => onFinalize(lot)}
                          className="h-8 text-xs flex items-center gap-1.5 ml-auto"
                        >
                          <Play className="h-3.5 w-3.5" /> Finaliser
                        </Button>
                      )}
                      {isReadyForUsinage && (
                        <InputForm
                        />
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

        )}
        <PaginationContent
        // datapaginationlimit={() => { }}
        // currentPage={datapagination.currentPage}
        // totalPages={datapagination.totalPages}
        // onPageChange={datapagination.onPageChange}
        // pointer={datapagination.pointer}
        // totalCount={datapagination.totalCount}
        // onLimitChange={datapagination.onLimitChange}
        // limit={datapagination.limit}
        />
      </CardContent>
    </Card>
  );
}
