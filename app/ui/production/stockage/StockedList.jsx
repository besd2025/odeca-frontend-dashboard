import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, PackageCheck, AlertCircle } from "lucide-react";
import PaginationContent from "@/components/ui/pagination-content";

export default function StockedList({ lots, onViewDetails }) {
  return (
    <Card className="shadow-xs dark:bg-slate-950 border-slate-200 dark:border-slate-800">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <PackageCheck className="h-5 w-5 text-primary" /> Lots Stockés & Étiquetés
        </CardTitle>
        <CardDescription>
          Liste des lots de café finalisés, étiquetés et disponibles en entrepôt.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {lots.length === 0 ? (
          <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center bg-slate-50/50 dark:bg-slate-900/30">
            <AlertCircle className="h-8 w-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Aucun lot stocké pour le moment. Les lots étiquetés après triage apparaissent ici.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Numéro de Lot</TableHead>
                <TableHead>Propriétaire / Société</TableHead>
                <TableHead>Grade / Qualité</TableHead>
                <TableHead className="text-right">Nombre de Sacs</TableHead>
                <TableHead>Date de Stockage</TableHead>
                <TableHead className="text-right sticky right-0 bg-sidebar shadow-2xl">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lots.map((lot) => (
                <TableRow key={lot.id}>
                  <TableCell className="font-bold text-slate-900 dark:text-white whitespace-nowrap">
                    {lot.id}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {lot.societe}
                      </span>
                      {lot.sdls && lot.sdls.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {lot.sdls.map((sdl) => (
                            <span
                              key={sdl}
                              className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded"
                            >
                              {sdl}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1.5">
                      {lot.grades &&
                        Object.keys(lot.grades).map((grade) => (
                          <Badge
                            key={grade}
                            variant="secondary"
                            className="text-xs bg-secondary/10 text-secondary dark:bg-secondary/30 dark:text-secondary dark:border-secondary/30"
                          >
                            {grade}
                          </Badge>
                        ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-semibold text-slate-900 dark:text-white">
                    {lot.nombreSacs ?? "—"}
                  </TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    {lot.dateStockage || "—"}
                  </TableCell>
                  <TableCell className="text-right sticky right-0 bg-background shadow-2xl border-l border-slate-200 dark:border-slate-800">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewDetails(lot)}
                      className="h-8 text-xs flex items-center gap-1.5 ml-auto bg-sidebar"
                    >
                      <Eye className="h-3.5 w-3.5" /> Détails
                    </Button>
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
