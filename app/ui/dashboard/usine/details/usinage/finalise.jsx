"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Eye, AlertCircle, Factory, Coffee, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import PaginationContent from "@/components/ui/pagination-content";
import { fetchData } from "@/app/_utils/api";
import { useSearchParams } from "next/navigation";
import { TableRowsSkeleton } from '@/components/ui/skeletons';

export default function FinaliseUsinage({ searchQuery = "" }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedLot, setSelectedLot] = useState(null);
  const [pointer, setPointer] = useState(0);
  const [limit, setLimit] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [usinageFinaliseList, setUsinageFinaliseList] = useState([]);
  const totalPages = Math.ceil(totalCount / limit) || 1;

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setPointer((page - 1) * limit);
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPointer(0);
    setCurrentPage(1);
  };
  const handleOpenDetails = (lot) => {
    setSelectedLot(lot);
    setOpen(true);
  };

  React?.useEffect(() => {
    const handleFetchData = async () => {
      //setLoading(true);
      try {
        const response = await fetchData("get", `cafe/usinages/`, { params: { responsable_responsable_usineusine_id: id, processing_status: "TERMINE", offset: pointer, limit: limit } });
        const mappedData = response?.results?.map((item) => ({
          id: item?.id,
          code_societe: item?.code_societe,
          societe: item?.nom_societe,
          sdls: item?.sdls,
          nombre_sacs: item?.nombre_sacs_total,
          usinageQuantitiesTotal: item?.quantite_total,
          status: item?.processing_status,
          dateUsinage: item?.date_debut,
          dateSortie: item?.date_fin,
          observation: item?.observation,
          productions: item?.productions
        })) || [];

        setUsinageFinaliseList(mappedData);
        setTotalCount(response?.count || 0);
      } catch (error) {
        console.error(`Error fetching data for tab pretes usinage:`, error);
      } finally {
        setLoading(false);
      }
    };
    handleFetchData();

  }, [limit, pointer, id]);

  return (
    <div className="space-y-4">
      <div className="grid w-full [&>div]:border [&>div]:rounded-md overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Société & SDLs</TableHead>
              <TableHead>Date d'Usinage</TableHead>
              <TableHead>Quantité</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date Sortie</TableHead>
              <TableHead className="text-right sticky right-0 bg-sidebar shadow-2xl border-l">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-slate-500 font-medium">
                  Chargement...
                </TableCell>
              </TableRow>
            ) : usinageFinaliseList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-slate-500 font-medium">
                  <div className="flex flex-col items-center gap-1.5">
                    <AlertCircle className="h-6 w-6 text-slate-400" />
                    <span>Aucun lot d'usinage finalisé trouvé.</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              usinageFinaliseList.map((lot, index) => (
                <TableRow key={lot.id} className="odd:bg-muted/50">
                  <TableCell className="font-bold text-slate-900 dark:text-white">
                    {pointer + index + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {lot.societe}
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {lot.sdls?.map((sdlNom, i) => (
                          <span
                            key={i}
                            className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded"
                          >
                            {sdlNom}
                          </span>
                        ))}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-400">
                    {new Date(lot.dateUsinage).toLocaleDateString("fr-FR")}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="text-xs flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                        {lot.usinageQuantitiesTotal?.toLocaleString("fr-FR")} kg
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800 flex items-center gap-1 w-max"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Finalisé
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-400">
                    {new Date(lot.dateSortie).toLocaleDateString("fr-FR")}
                  </TableCell>
                  <TableCell className="text-right sticky right-0 bg-background shadow-2xl border-l border-slate-200 dark:border-slate-800">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDetails(lot)}
                      className="h-8 text-xs flex items-center gap-1.5 ml-auto bg-sidebar"
                    >
                      <Eye className="h-3.5 w-3.5" /> Détails
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <PaginationContent
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        pointer={pointer}
        totalCount={totalCount}
        limit={limit}
        onLimitChange={handleLimitChange}
      />

      {/* Fiche Récapitulative Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-4xl md:max-w-3xl lg:max-w-[80vw] bg-sidebar border border-slate-200 dark:border-slate-800 shadow-xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Factory className="h-5 w-5 text-primary" />
              Fiche Récapitulative d'Usinage ({selectedLot?.id})
            </DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-slate-400 text-xs">
              Détail complet des intrants, extrants et métadonnées d'usinage associés à ce lot.
            </DialogDescription>
          </DialogHeader>

          {selectedLot && (
            <div className="space-y-5 pt-2">
              {/* Header Info Banner */}
              <div className="p-3.5 bg-primary/5 border border-primary/10 rounded-lg text-sm text-slate-700 dark:text-slate-300 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-primary">SOCIÉTÉ ID : {selectedLot.code_societe || selectedLot.id}</span>
                  <span className="text-xs bg-primary/10 px-2.5 py-0.5 rounded-full font-semibold">{selectedLot.societe}</span>
                </div>
                <div className="text-xs text-slate-500">
                  • Période : du {new Date(selectedLot.dateUsinage).toLocaleDateString("fr-FR")} au {new Date(selectedLot.dateSortie).toLocaleDateString("fr-FR")}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Left Column: Sorties & Notes */}
                <div className="lg:col-span-1 space-y-4">
                  <Card className="shadow-none dark:bg-slate-950 border-slate-200 dark:border-slate-800">
                    <CardHeader className="py-4">
                      <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <FileText className="h-4.5 w-4.5 text-primary" /> Sorties & Notes
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 py-0 pb-4">
                      <div className="space-y-1.5">
                        <Label className="font-semibold text-slate-700 dark:text-slate-300 text-xs">
                          Date de Sortie d'Usinage
                        </Label>
                        <div className="p-2 border rounded-md bg-slate-50 dark:bg-slate-900/50 text-sm text-slate-800 dark:text-slate-200">
                          {new Date(selectedLot.dateSortie).toLocaleDateString("fr-FR")}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="font-semibold text-slate-700 dark:text-slate-300 text-xs">
                          Observations / Remarques
                        </Label>
                        <div className="p-2.5 border rounded-md bg-slate-50 dark:bg-slate-900/50 text-xs text-slate-700 dark:text-slate-300 min-h-[100px] whitespace-pre-wrap">
                          {selectedLot.observation || "Aucune observation."}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column: Détails des Quantités Sorties */}
                <div className="lg:col-span-2">
                  <Card className="shadow-none dark:bg-slate-950 border-slate-200 dark:border-slate-800 h-full flex flex-col justify-between">
                    <CardHeader className="py-4">
                      <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <Coffee className="h-4.5 w-4.5 text-primary" /> Détails des Quantités Sorties (Café Vert)
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 py-0 pb-4">
                      <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-lg border border-slate-100 dark:border-slate-900 space-y-2">
                        <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Qualités produites</h4>
                        <div className="space-y-2">
                          {selectedLot.productions?.map((prod, idx) => (
                            <div key={idx} className="flex justify-between items-center text-xs text-slate-700 dark:text-slate-300 border-b border-slate-100/50 dark:border-slate-900/50 pb-1.5 last:border-0 last:pb-0">
                              <span className="font-medium text-sm">{prod.nom_qualite}</span>
                              <div className="flex items-center gap-3">
                                <span className="font-bold text-slate-900 dark:text-white">
                                  {prod.quantite_sortie?.toLocaleString("fr-FR")} kg
                                </span>
                                <span className="text-slate-500 dark:text-slate-400">({prod.nombre_sacs} sacs)</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                      <Button type="button" size="sm" onClick={() => setOpen(false)} className="h-9">
                        Fermer
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
