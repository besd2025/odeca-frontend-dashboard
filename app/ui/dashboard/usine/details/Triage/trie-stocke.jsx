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
import { CheckCircle2, Eye, AlertCircle, Search, Layers, Calendar, Info } from "lucide-react";
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
export default function TrieStocke({ searchQuery = "" }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedLot, setSelectedLot] = useState(null);
  const [trieStockeList, setTrieStockeList] = useState([]);
  const [pointer, setPointer] = useState(0);
  const [limit, setLimit] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [confirmeTriageList, setConfirmeTriageList] = useState([]);
  const LOTS_TRIES = [
    {
      id: "TRI-2026-001",
      societe: "SOGESTAL Ngozi",
      sdls: ["SDL Ngozi", "SDL Gitega"],
      usine: "Usine Ngozi",
      quantite_trie: 12960,
      nombre_sacs: 216,
      dateEntree: "2026-05-18",
      dateSortie: "2026-05-20",
      status: "Trié & Stocké",
      observation: "Triage conforme aux spécifications café vert ODECA. Échantillons prélevés pour laboratoire.",
      gradesATrier: ["FW NGOMA MILD-SDL", "FW AA"],
      gradesStockesDirect: ["W ABC"],
      taxationQuantities: {
        "FW NGOMA MILD-SDL": 118,
        "FW AA": 78,
        "W ABC": 20,
      },
      taxationPoids: {
        "FW NGOMA MILD-SDL": 7080,
        "FW AA": 4680,
        "W ABC": 1200,
      },
    },
    {
      id: "TRI-2026-005",
      societe: "SOGESTAL Ngozi",
      sdls: ["SDL Gitega"],
      usine: "Usine Ngozi",
      quantite_trie: 180,
      nombre_sacs: 3,
      dateEntree: "2026-05-28",
      dateSortie: "2026-05-28",
      status: "Trié & Stocké",
      observation: "Lot trié sans défaut majeur. Directement étiqueté pour stockage.",
      gradesStockesDirect: ["W ABC"],
      taxationQuantities: {
        "W ABC": 3,
      },
      taxationPoids: {
        "W ABC": 180,
      },
    },
  ];

  const filteredLots = LOTS_TRIES.filter((lot) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      lot.societe.toLowerCase().includes(q) ||
      lot.id.toLowerCase().includes(q) ||
      lot.sdls.some((s) => s.toLowerCase().includes(q))
    );
  });

  const handleOpenDetails = (lot) => {
    setSelectedLot(lot);
    setOpen(true);
  };

  React?.useEffect(() => {
    const handleFetchData = async () => {
      //setLoading(true);
      try {
        const response = await fetchData("get", `cafe/triage/get_termine_triage/`, { params: { usine_deparchage_id: id, offset: pointer, limit: limit } });
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
        setConfirmeTriageList(mappedData);
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
              <TableHead>Quantités triées</TableHead>
              <TableHead>Date Entrée</TableHead>
              <TableHead>Date Sortie</TableHead>
              <TableHead>Statut</TableHead>
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
            ) : confirmeTriageList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-slate-500 font-medium">
                  <div className="flex flex-col items-center gap-1.5">
                    <AlertCircle className="h-6 w-6 text-slate-400" />
                    <span>Aucun lot trié trouvé.</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              confirmeTriageList?.map((lot, index) => (
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
                        {lot.quantite_trie?.toLocaleString("fr-FR")} kg / {lot.nombre_sacs} sacs
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    {lot.dateEntree || "—"}
                  </TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    {lot.dateSortie || "—"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800 flex items-center gap-1 whitespace-nowrap w-max"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Trié & Stocké
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

      {/* Details Dialog (matches TriageDialog from /odeca-production/usine/triage) */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-4xl md:max-w-4xl lg:max-w-[80vw] bg-sidebar border border-slate-200 dark:border-slate-800 shadow-xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              Fiche Récapitulative du Triage ({selectedLot?.id})
            </DialogTitle>
            <DialogDescription className="text-slate-500 text-xs">
              Détail complet du lot trié, des quantités taxables et de la chronologie du processus.
            </DialogDescription>
          </DialogHeader>

          {selectedLot && (
            <div className="space-y-5 pt-2">
              <div className="p-3.5 bg-primary/5 border border-primary/10 rounded-lg text-sm space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-primary">Lot ID : {selectedLot.id}</span>
                  <span className="text-xs bg-primary/10 px-2.5 py-0.5 rounded-full font-semibold">
                    {selectedLot.societe}
                  </span>
                </div>
                <div className="text-xs text-slate-500">
                  SDLs : {selectedLot.sdls?.join(", ")}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
                {/* Left: Chronologie */}
                <div className="lg:col-span-2">
                  <Card className="shadow-none dark:bg-slate-950 border-slate-200 dark:border-slate-800 h-full flex flex-col justify-between">
                    <CardHeader className="py-4">
                      <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" /> Chronologie
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 py-0 pb-4 flex-1">
                      <div className="space-y-1.5">
                        <Label className="font-semibold text-slate-700 dark:text-slate-300 text-xs">
                          Observation
                        </Label>
                        <div className="p-2 border rounded-md bg-slate-50 dark:bg-slate-900/50 text-xs text-slate-800 dark:text-slate-200">
                          {selectedLot.observation || "—"}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="font-semibold text-slate-700 dark:text-slate-300 text-xs">
                          Date de Sortie du Processus
                        </Label>
                        <div className="p-2 border rounded-md bg-slate-50 dark:bg-slate-900/50 text-xs text-slate-800 dark:text-slate-200">
                          {selectedLot.dateSortie || "—"}
                        </div>
                      </div>

                      <div className="flex items-start gap-2 p-3 bg-slate-50 dark:bg-slate-900/40 rounded-lg border border-slate-100 dark:border-slate-800 mt-auto">
                        <Info className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                        <span className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                          Lot validé avec succès pour taxation et mise en stock direct.
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Right: Quantités Triées */}
                <div className="lg:col-span-3">
                  <Card className="shadow-none dark:bg-slate-950 border-slate-200 dark:border-slate-800 h-full flex flex-col justify-between">
                    <CardHeader className="py-4">
                      <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <Layers className="h-4 w-4 text-primary" /> Quantités Triées & Prêtes à Taxer
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 py-0 pb-4 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        {selectedLot.taxationQuantities &&
                          Object.entries(selectedLot.taxationQuantities).map(([grade, sacs]) => (
                            <div
                              key={grade}
                              className="p-3 bg-blue-50/30 dark:bg-blue-950/10 rounded-lg border border-blue-100/30 dark:border-blue-900/20 flex flex-col gap-1"
                            >
                              <span className="text-xs font-bold text-blue-700 dark:text-blue-400 truncate">
                                {grade}
                              </span>
                              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                                {sacs} sacs {selectedLot.taxationPoids?.[grade] ? `— ${selectedLot.taxationPoids[grade]?.toLocaleString("fr-FR")} kg` : ""}
                              </span>
                            </div>
                          ))}
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
