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
import { Eye, AlertCircle, Factory } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import PaginationContent from "@/components/ui/pagination-content";
import { fetchData } from "@/app/_utils/api";
import { useSearchParams } from "next/navigation";
import { TableRowsSkeleton } from '@/components/ui/skeletons';
export default function EnCoursUsinage({ searchQuery = "" }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedLot, setSelectedLot] = useState(null);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [pointer, setPointer] = useState(0);
  const [limit, setLimit] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [usinageEnCoursList, setUsinageEnCoursList] = React?.useState([]);

  const handleOpenDetails = (lot) => {
    setSelectedLot(lot);
    setOpen(true);
  };
  React?.useEffect(() => {
    const handleFetchData = async () => {
      //setLoading(true);
      try {
        const response = await fetchData("get", `cafe/transfert_sdl_usine_detail_comfimation/get_transfert_comfirmed_par_societe/`, { params: { usine_deparchage_id: id, etat_selection: "EN_COURS", offset: pointer, limit: limit } });

        const mappedData = response?.results?.map((item) => ({
          id: item?.id,
          code_societe: item?.code_societe,
          societe: item?.nom_societe,
          sdls: item?.sdls,
          usinageQuantitiesTotal: item?.total_quantite_confirme - item?.total_quantite_confirme_tare,
          status: item?.status,
          dateTransfert: item?.dateTransfert,
          dateDebut: item?.dateDebut,
          observation: item?.observation,
          intrants: [
            { grade: "B1", quantite: 2500, poidsNet: 2500, status: "En cours" },
            { grade: "B2", quantite: 1200, poidsNet: 1200, status: "En cours" },
          ],
        })) || [];
        setUsinageEnCoursList(mappedData);
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
              <TableHead>Quantité en Traitement</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right sticky right-0 bg-sidebar shadow-2xl border-l">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-slate-500 font-medium">
                  Chargement...
                </TableCell>
              </TableRow>
            ) : usinageEnCoursList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-slate-500 font-medium">
                  <div className="flex flex-col items-center gap-1.5">
                    <AlertCircle className="h-6 w-6 text-slate-400" />
                    <span>Aucun lot en cours d'usinage.</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              usinageEnCoursList.map((lot, index) => (
                <TableRow key={lot.id} className="odd:bg-muted/50">
                  <TableCell className="font-bold text-slate-900 dark:text-white">
                    {index + 1}
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
                      className="border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800 flex items-center gap-1 w-max"
                    >
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                      </span>
                      En cours
                    </Badge>
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

      <PaginationContent />

      {/* Details Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Factory className="h-5 w-5 text-primary" />
              Détails du lot en cours d'usinage ({selectedLot?.id})
            </DialogTitle>

            {selectedLot && (
              <div className="space-y-4 mt-4 text-left">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3.5 bg-primary/5 rounded-lg border border-primary/10">
                  <div>
                    <Label className="text-xs text-muted-foreground">Société / Propriétaire</Label>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {selectedLot.societe}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">SDLs Associées</Label>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {selectedLot.sdls?.join(", ") || "-"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Date de Lancement</Label>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {selectedLot.dateDebut || selectedLot.dateTransfert || "-"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Poids Total Entré</Label>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {selectedLot.usinageQuantitiesTotal?.toLocaleString("fr-FR")} kg
                    </p>
                  </div>
                </div>

                {selectedLot.observation && (
                  <div className="p-3 bg-muted/40 rounded-lg border text-xs text-slate-700 dark:text-slate-300">
                    <span className="font-semibold block mb-1">Observation :</span>
                    {selectedLot.observation}
                  </div>
                )}

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-primary uppercase tracking-wider">
                    Intrants en Cours de Traitement
                  </h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Grade / Qualité</TableHead>
                        <TableHead className="text-right">Poids Net (kg)</TableHead>
                        <TableHead className="text-center">Statut</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedLot.intrants?.map((item, idx) => (
                        <TableRow key={idx} className="odd:bg-muted/50">
                          <TableCell className="font-semibold text-slate-800 dark:text-slate-200">
                            {item.grade}
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            {item.poidsNet?.toLocaleString("fr-FR")} kg
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline" className="text-xs">
                              {item.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
