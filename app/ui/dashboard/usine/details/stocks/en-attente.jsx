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
import { Clock, CheckCircle2, Warehouse, MoreHorizontal, Package } from "lucide-react";
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

export default function EnAttenteStocks({ searchQuery = "" }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedLot, setSelectedLot] = useState(null);

  const DEFAULT_STOCKS_ATTENTE = [
    {
      id: "STOCK-ATT-001",
      societe: "COCOCA",
      sdls: ["SDL Gitega", "SDL Karusi"],
      usine: "Usine Gitega",
      dateEntree: "2026-05-28",
      nombreSacs: 576,
      poidsNet: 34560.0,
      status: "en attente",
      emplacementVise: "Hangar 2 - Zone Café Vert",
      observation: "Lot issu de l'étape de triage, en cours d'attribution des numéros de lot et d'empilage.",
      qualites: [
        { qualite: "ROBUSTA NATURAL CLEAN SUPER", nombre_sacs: 58, poidsNet: 3480, status: "Prêt à stocker" },
        { qualite: "FW NGOMA MILD-SDL", nombre_sacs: 420, poidsNet: 25200, status: "Prêt à stocker" },
        { qualite: "FW AA", nombre_sacs: 78, poidsNet: 4680, status: "Prêt à stocker" },
        { qualite: "W ABC", nombre_sacs: 20, poidsNet: 1200, status: "Prêt à stocker" },
      ],
    },
    {
      id: "STOCK-ATT-002",
      societe: "SOGESTAL Kayanza",
      sdls: ["SDL Kayanza"],
      usine: "Usine Kayanza",
      dateEntree: "2026-05-27",
      nombreSacs: 60,
      poidsNet: 3600.0,
      status: "en attente",
      emplacementVise: "Hangar 1 - Zone Spéciale",
      observation: "Prêt pour mise en palettes et enregistrement dans le stock permanent.",
      qualites: [
        { qualite: "FW AA", nombre_sacs: 40, poidsNet: 2400, status: "Prêt à stocker" },
        { qualite: "15+", nombre_sacs: 20, poidsNet: 1200, status: "Prêt à stocker" },
      ],
    },
  ];

  const filteredLots = DEFAULT_STOCKS_ATTENTE.filter((lot) => {
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

  return (
    <div className="grid w-full [&>div]:border [&>div]:rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="pl-4">Actions</TableHead>
            <TableHead>Société & SDLs</TableHead>
            <TableHead>Usine</TableHead>
            <TableHead>Date Prêt Stock</TableHead>
            <TableHead className="text-right">Sacs Prêts</TableHead>
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
                Aucun lot en attente de stockage trouvé.
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
                  {lot.nombreSacs} sacs
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {lot.poidsNet?.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}
                </TableCell>
                <TableCell className="text-center lowercase">
                  <div className="gap-2 flex items-center justify-center">
                    <Badge
                      variant="secondary"
                      className="gap-1 bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400"
                    >
                      <Clock size={16} />
                      <span>Prêt à stocker</span>
                    </Badge>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <PaginationContent />

      {/* Dialog Détails Stock Attente */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Warehouse className="h-5 w-5 text-primary" />
              Détails du Lot en Attente de Stockage ({selectedLot?.id})
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
                    <Label className="text-xs text-muted-foreground">Emplacement Prévu</Label>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {selectedLot.emplacementVise}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Total à Stocker</Label>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {selectedLot.nombreSacs} sacs ({selectedLot.poidsNet?.toLocaleString("fr-FR")} kg)
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

                {/* Ventilation des Qualités */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                    <Package className="h-4 w-4" /> Qualités de Café Vert à Enregistrer
                  </h4>
                  <div className="w-full overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Qualité / Grade</TableHead>
                          <TableHead className="text-right">Nombre de Sacs</TableHead>
                          <TableHead className="text-right">Poids Net (kg)</TableHead>
                          <TableHead className="text-center">Statut</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedLot.qualites?.map((item, idx) => (
                          <TableRow className="odd:bg-muted/50" key={idx}>
                            <TableCell className="font-semibold text-slate-800 dark:text-slate-200">
                              {item.qualite}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {item.nombre_sacs} sacs
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
