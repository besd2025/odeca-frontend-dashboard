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
import { Clock, CheckCircle2, Search, MoreHorizontal, Layers } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

export default function EnAttenteTriage({ searchQuery = "" }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedLot, setSelectedLot] = useState(null);
  const [pointer, setPointer] = useState(0);
  const [limit, setLimit] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [enAttenteTriageList, setEnAttenteTriageList] = useState([]);
  const DEFAULT_TRIAGES = [
    {
      id: "TRI-2026-002",
      societe: "SOGESTAL Kayanza",
      sdls: ["SDL Kayanza"],
      usine: "Usine Kayanza",
      dateEntree: "2026-05-27",
      dateSortie: "-",
      totalSacs: 60,
      poidsNet: 3600.0,
      status: "en cours",
      observation: "Triage mécanique en cours sur tamis 15+ et FW AA.",
      grades: [
        { grade: "FW AA", sacs: 40, poidsNet: 2400, status: "En cours de triage" },
        { grade: "15+", sacs: 20, poidsNet: 1200, status: "En cours de triage" },
      ],
    },
    {
      id: "TRI-2026-003",
      societe: "COCOCA",
      sdls: ["SDL Gitega", "SDL Karusi"],
      usine: "Usine Gitega",
      dateEntree: "2026-05-28",
      dateSortie: "-",
      totalSacs: 576,
      poidsNet: 34560.0,
      status: "en attente",
      observation: "Lot issu de l'usinage, prêt pour la chaîne de triage gravimétrique et manuel.",
      grades: [
        { grade: "ROBUSTA NATURAL CLEAN SUPER", sacs: 58, poidsNet: 3480, status: "Prêt à trier" },
        { grade: "FW NGOMA MILD-SDL", sacs: 420, poidsNet: 25200, status: "Prêt à trier" },
        { grade: "FW AA", sacs: 78, poidsNet: 4680, status: "Prêt à trier" },
        { grade: "W ABC", sacs: 20, poidsNet: 1200, status: "Stock direct" },
      ],
    },
    {
      id: "TRI-2026-004",
      societe: "SOGESTAL Mumirwa",
      sdls: ["SDL Muramvya"],
      usine: "Usine Muramvya",
      dateEntree: "2026-05-29",
      dateSortie: "-",
      totalSacs: 18,
      poidsNet: 1080.0,
      status: "en attente",
      observation: "Petit lot de café vert spécial en attente de tri manuel.",
      grades: [
        { grade: "GRADE 1", sacs: 18, poidsNet: 1080, status: "Prêt à trier" },
      ],
    },
  ];

  const filteredLots = DEFAULT_TRIAGES.filter((lot) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      lot.societe.toLowerCase().includes(query) ||
      lot.id.toLowerCase().includes(query) ||
      lot.usine.toLowerCase().includes(query)
    );
  });

  const handleOpenDetails = (lot) => {
    setSelectedLot(lot);
    setOpen(true);
  };
  React?.useEffect(() => {
    const handleFetchData = async () => {
      console.log("pointer===================>", pointer)
      console.log("limit====================>", limit)
      //setLoading(true);
      try {
        const response = await fetchData("get", `cafe/triage/get_pret_pour_triage/`, { params: { usine_deparchage_id: id, offset: pointer, limit: limit } });
        console.log("response en attente triage===================>", response)
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
    <div className="grid w-full [&>div]:border [&>div]:rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="pl-4">Actions</TableHead>
            <TableHead>Société & SDLs</TableHead>
            <TableHead>Usine</TableHead>
            <TableHead>Date Entrée Triage</TableHead>
            <TableHead className="text-right">Nombre de Sacs</TableHead>
            <TableHead className="text-right">Poids Net (kg)</TableHead>
            <TableHead className="text-center">Statut</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-slate-500 font-medium">
                Chargement des données...
              </TableCell>
            </TableRow>
          ) : filteredLots.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-slate-500 dark:text-slate-400 font-medium">
                Aucun lot en attente de triage trouvé.
              </TableCell>
            </TableRow>
          ) : (
            filteredLots.map((lot, index) => (
              <TableRow className="odd:bg-muted/50" key={lot.id || index}>
                <TableCell className="pl-4 font-medium">
                  <div className="flex items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => handleOpenDetails(lot)}
                        >
                          Détails
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          Modifier
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
                <TableCell className="font-semibold">
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {lot.societe}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {lot.sdls?.map((sdl, i) => (
                        <span
                          key={i}
                          className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded"
                        >
                          {sdl}
                        </span>
                      ))}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-semibold">
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {lot.usine || "-"}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{lot.dateEntree}</TableCell>
                <TableCell className="text-right font-medium">
                  {lot.totalSacs} sacs
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {lot.poidsNet?.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}
                </TableCell>
                <TableCell className="text-center lowercase">
                  {lot.status === "en cours" ? (
                    <div className="gap-2 flex items-center justify-center">
                      <Badge
                        variant="secondary"
                        className="gap-1 bg-amber-100 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400"
                      >
                        <span className="relative flex h-2 w-2 mr-1">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                        </span>
                        <span>En cours</span>
                      </Badge>
                    </div>
                  ) : (
                    <div className="gap-2 flex items-center justify-center">
                      <Badge
                        variant="secondary"
                        className="gap-1 bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400"
                      >
                        <Clock size={16} />
                        <span>Prêt à trier</span>
                      </Badge>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <PaginationContent />

      {/* Dialog Détails Triage */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              Détails du Lot en Triage ({selectedLot?.id})
            </DialogTitle>

            {selectedLot && (
              <div className="space-y-4 mt-4 text-left">
                {/* Meta summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3.5 bg-primary/5 rounded-lg border border-primary/10">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Société / Propriétaire</Label>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {selectedLot.societe}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Usine & SDLs</Label>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {selectedLot.usine} ({selectedLot.sdls?.join(", ")})
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Date Entrée Triage</Label>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {selectedLot.dateEntree}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Volume Total</Label>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {selectedLot.totalSacs} sacs ({selectedLot.poidsNet?.toLocaleString("fr-FR")} kg)
                    </p>
                  </div>
                </div>

                {/* Observation */}
                {selectedLot.observation && (
                  <div className="p-3 bg-muted/40 rounded-lg border text-xs text-slate-700 dark:text-slate-300">
                    <span className="font-semibold block mb-1">Observation :</span>
                    {selectedLot.observation}
                  </div>
                )}

                {/* Ventilation des Grades */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="h-4 w-4" /> Grades et Qualités en Entrée de Triage
                  </h4>
                  <div className="w-full overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Grade / Qualité</TableHead>
                          <TableHead className="text-right">Sacs</TableHead>
                          <TableHead className="text-right">Poids Net (kg)</TableHead>
                          <TableHead className="text-center">Statut</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedLot.grades?.map((item, idx) => (
                          <TableRow className="odd:bg-muted/50" key={idx}>
                            <TableCell className="font-semibold text-slate-800 dark:text-slate-200">
                              {item.grade}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {item.sacs} sacs
                            </TableCell>
                            <TableCell className="text-right font-semibold">
                              {item.poidsNet?.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}
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
              </div>
            )}
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
