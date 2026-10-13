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
import { Clock, CheckCircle2, Factory, MoreHorizontal, Settings } from "lucide-react";
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
import { useSearchParams } from "next/navigation";
import { fetchData } from '@/app/_utils/api';
export default function EnAttenteUsinage({ searchQuery = "" }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedLot, setSelectedLot] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [pointer, setPointer] = useState(0);
  const [limit, setLimit] = useState(10);
  const currentPage = Math.floor(pointer / limit) + 1;
  const totalPages = Math.max(1, Math.ceil(totalCount / limit));
  const [receptionsEnAttenteList, setReceptionsEnAttenteList] = React?.useState([])
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const DEFAULT_USINAGES = [
    {
      id: "USIN-2026-002",
      societe: "SOGESTAL Kayanza",
      sdls: ["SDL Kayanza"],
      usine: "Usine Kayanza",
      dateTransfert: "2026-05-25",
      dateUsinage: "2026-05-27",
      poidsNet: 3700.0,
      quantiteIntrants: 3700.0,
      status: "en cours",
      observation: "Usinage en cours de traitement pour le déparchage du lot B1 et B2.",
      intrants: [
        { grade: "B1", poidsNet: 2500, status: "En cours" },
        { grade: "B2", poidsNet: 1200, status: "En cours" },
      ],
      qualitesProduites: [],
    },
    {
      id: "USIN-2026-003",
      societe: "SOGESTAL Muramvya",
      sdls: ["SDL Muramvya", "SDL Bururi"],
      usine: "Usine Muramvya",
      dateTransfert: "2026-05-26",
      dateUsinage: "2026-05-27",
      poidsNet: 5200.0,
      quantiteIntrants: 5200.0,
      status: "en attente",
      observation: "Lot prêt pour la file d'usinage. En attente de lancement machine.",
      intrants: [
        { grade: "C1", poidsNet: 3500, status: "En attente" },
        { grade: "C2", poidsNet: 1700, status: "En attente" },
      ],
      qualitesProduites: [],
    },
    {
      id: "USIN-2026-004",
      societe: "COCOCA",
      sdls: ["SDL Gitega", "SDL Karusi"],
      usine: "Usine Gitega",
      dateTransfert: "2026-05-27",
      dateUsinage: "2026-05-28",
      poidsNet: 4800.0,
      quantiteIntrants: 4800.0,
      status: "en attente",
      observation: "Lot réceptionné en usine, déparchage programmé.",
      intrants: [
        { grade: "A1", poidsNet: 3000, status: "En attente" },
        { grade: "A2", poidsNet: 1800, status: "En attente" },
      ],
      qualitesProduites: [],
    },
  ];

  const filteredLots = DEFAULT_USINAGES.filter((lot) => {
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
      //setLoading(true);
      try {
        const response = await fetchData("get", `cafe/transfert_sdl_usine_detail_comfimation/get_transfert_comfirmed_par_societe/?usine_deparchage_id=${id}`, { params: { etat_selection: "PRET_USINE", offset: pointer, limit: limit } });
        const mappedData = response?.results?.map((item) => ({
          id: item?.id,
          societe: item?.nom_societe,
          sdls: item?.sdl_cafes?.map((sdl) => sdl?.nom_sdl),
          usine: item?.nom_usine,
          dateTransfert: "2026-05-27",
          dateUsinage: "2026-05-28",
          poidsNet: 4800.0,
          quantiteIntrants: 4800.0,
          status: "en attente",
          observation: "Lot réceptionné en usine, déparchage programmé.",
          status: "en attente",
        })) || [];
        setReceptionsEnAttenteList(mappedData);
        setTotalCount(response?.count || 0);
      } catch (error) {
        console.error(`Error fetching data for tab ${tab}:`, error);
      } finally {
        setLoading(false);
      }
    };
    handleFetchData();

  }, [limit, pointer]);

  return (
    <div className="grid w-full [&>div]:border [&>div]:rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="pl-4">Actions</TableHead>
            <TableHead>Société & SDLs</TableHead>
            <TableHead>Usine</TableHead>
            <TableHead>Date Transfert</TableHead>
            <TableHead>Date Usinage</TableHead>
            <TableHead className="text-right">Poids Intrant (kg)</TableHead>
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
                Aucun lot en attente d'usinage trouvé.
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
                <TableCell>{lot.dateTransfert || "-"}</TableCell>
                <TableCell>{lot.dateUsinage || "-"}</TableCell>
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
                        <span>En attente</span>
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

      {/* Dialog Détails Usinage */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Factory className="h-5 w-5 text-primary" />
              Détails du lot en Usinage ({selectedLot?.id})
            </DialogTitle>

            {selectedLot && (
              <div className="space-y-4 mt-4 text-left">
                {/* Meta summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 bg-primary/5 rounded-lg border border-primary/10">
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
                    <Label className="text-xs text-muted-foreground">Date Transfert / Entrée</Label>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {selectedLot.dateTransfert}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Date Usinage</Label>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {selectedLot.dateUsinage}
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

                {/* Intrants Déparchage */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-primary uppercase tracking-wider">
                    Intrants de Déparchage (Café Déparché)
                  </h4>
                  <div className="w-full overflow-x-auto">
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
                          <TableRow className="odd:bg-muted/50" key={idx}>
                            <TableCell className="font-semibold text-slate-800 dark:text-slate-200">
                              {item.grade}
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
