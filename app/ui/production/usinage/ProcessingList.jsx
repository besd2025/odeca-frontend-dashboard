import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Eye, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import PaginationContent from "@/components/ui/pagination-content";

export default function ProcessingList({ lots, onFinalize, onViewDetails }) {
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
      <CardContent>
        {lots.length === 0 ? (
          <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center bg-slate-50/50 dark:bg-slate-900/30">
            <AlertCircle className="h-8 w-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Aucun lot enregistré pour le moment. Utilisez le formulaire ci-dessus pour lancer un usinage.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code Lot</TableHead>
                <TableHead>Société & SDLs</TableHead>
                <TableHead>Date d'Usinage</TableHead>
                <TableHead>Grades Entrée (Quantité)</TableHead>
                <TableHead >Statut</TableHead>
                <TableHead>Date Sortie</TableHead>
                <TableHead className="text-right sticky right-0 bg-sidebar shadow-2xl ">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lots.map((lot) => {
                const isFinished = lot.status === "Finalisé";
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
                    <TableCell className="text-slate-600 dark:text-slate-400">
                      {lot.dateUsinage}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {Object.entries(lot.usinageQuantities).map(([grade, qty]) => (
                          <div key={grade} className="text-xs flex items-center gap-1.5">
                            <span className="font-semibold text-slate-700 dark:text-slate-300">
                              {grade}:
                            </span>
                            <span className="text-slate-600 dark:text-slate-400">
                              {qty} kg
                            </span>
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      {isFinished ? (
                        <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800 flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Finalisé
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800 flex items-center gap-1">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                          </span>
                          En cours
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-slate-600 dark:text-slate-400">
                      {isFinished ? lot.dateSortie : <span className="text-slate-400">—</span>}
                    </TableCell>
                    <TableCell className="text-right sticky right-0 bg-background shadow-2xl border-l border-slate-200 dark:border-slate-800">
                      {isFinished ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onViewDetails(lot)}
                          className="h-8 text-xs flex items-center gap-1.5 ml-auto bg-sidebar"
                        >
                          <Eye className="h-3.5 w-3.5" /> Détails
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => onFinalize(lot)}
                          className="h-8 text-xs bg-amber-600 hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-500 text-white flex items-center gap-1.5 ml-auto"
                        >
                          <Play className="h-3.5 w-3.5" /> Finaliser
                        </Button>
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
