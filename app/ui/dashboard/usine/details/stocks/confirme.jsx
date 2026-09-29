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
import { CheckCircle2, Warehouse, MoreHorizontal, PackageCheck } from "lucide-react";
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

export default function ConfirmedStocks({ searchQuery = "" }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedLot, setSelectedLot] = useState(null);

  const CONFIRMED_STOCKS = [
    {
      id: "STOCK-2026-001",
      numeroLot: "LOT-VERT-2026-01",
      societe: "SOGESTAL Ngozi",
      sdls: ["SDL Ngozi", "SDL Gitega"],
      usine: "Usine Ngozi",
      dateStockage: "2026-05-20",
      dateReception: "2026-05-18",
      nombreSacs: 216,
      poidsNet: 12960.0,
      emplacement: "Hangar 1 - Allée B & C",
      status: "confirmé",
      observation: "Lot stocké sous sacs GrainPro hermétiques. Contrôle d'humidité certifié à 11.4%.",
      grades: [
        { qualite: "FW NGOMA MILD-SDL", nombre_sacs: 118, poidsNet: 7080, emplacement: "Hangar 1 - Allée B" },
        { qualite: "FW AA", nombre_sacs: 78, poidsNet: 4680, emplacement: "Hangar 1 - Allée C" },
        { qualite: "W ABC", nombre_sacs: 20, poidsNet: 1200, emplacement: "Hangar 2 - Allée A" },
      ],
    },
    {
      id: "STOCK-2026-004",
      numeroLot: "LOT-VERT-2026-04",
      societe: "SOGESTAL Mumirwa",
      sdls: ["SDL Muramvya"],
      usine: "Usine Muramvya",
      dateStockage: "2026-05-28",
      dateReception: "2026-05-28",
      nombreSacs: 18,
      poidsNet: 1080.0,
      emplacement: "Hangar 3 - Zone Micro-Lots",
      status: "confirmé",
      observation: "Micro-lot stocké prêt pour échantillonnage et vente aux enchères.",
      grades: [
        { qualite: "GRADE 1", nombre_sacs: 18, poidsNet: 1080, emplacement: "Hangar 3 - Rack 4" },
      ],
    },
    {
      id: "STOCK-2026-005",
      numeroLot: "LOT-VERT-2026-05",
      societe: "SOGESTAL Ngozi",
      sdls: ["SDL Gitega"],
      usine: "Usine Ngozi",
      dateStockage: "2026-05-28",
      dateReception: "2026-05-28",
      nombreSacs: 3,
      poidsNet: 180.0,
      emplacement: "Hangar 2 - Allée A",
      status: "confirmé",
      observation: "Stockage direct après usinage sans retriage requis.",
      grades: [
        { qualite: "W ABC", nombre_sacs: 3, poidsNet: 180, emplacement: "Hangar 2 - Rack 1" },
      ],
    },
  ];

  const filteredLots = CONFIRMED_STOCKS.filter((lot) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      lot.societe.toLowerCase().includes(query) ||
      lot.id.toLowerCase().includes(query) ||
      lot.numeroLot?.toLowerCase().includes(query) ||
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
            <TableHead>N° Lot / Société</TableHead>
            <TableHead>Usine</TableHead>
            <TableHead>Date Stockage</TableHead>
            <TableHead>Emplacement</TableHead>
            <TableHead className="text-right">Sacs Stockés</TableHead>
            <TableHead className="text-right">Poids Net (kg)</TableHead>
            <TableHead className="text-center">Statut</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-slate-500 font-medium">
                Chargement des données...
              </TableCell>
            </TableRow>
          ) : filteredLots.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-slate-500 dark:text-slate-400 font-medium">
                Aucun lot stocké confirmé trouvé.
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
                    <span className="font-semibold text-primary">
                      {lot.numeroLot}
                    </span>
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
                <TableCell>{lot.dateStockage}</TableCell>
                <TableCell className="text-slate-600 dark:text-slate-400 text-xs">
                  {lot.emplacement || "-"}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {lot.nombreSacs} sacs
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {lot.poidsNet?.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}
                </TableCell>
                <TableCell className="text-center lowercase">
                  <div className="gap-2 flex items-center justify-center">
                    <Badge
                      variant="default"
                      className="gap-1 bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400"
                    >
                      <CheckCircle2 size={16} />
                      <span>Stocké</span>
                    </Badge>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <PaginationContent />

      {/* Dialog Détails Stock Confirmé */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Warehouse className="h-5 w-5 text-primary" />
              Fiche de Stock - {selectedLot?.numeroLot} ({selectedLot?.id})
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
                    <Label className="text-xs text-muted-foreground">Usine & Emplacement</Label>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {selectedLot.usine} — {selectedLot.emplacement}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Date de Stockage</Label>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Enregistré le {selectedLot.dateStockage}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Volume Total en Stock</Label>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {selectedLot.nombreSacs} sacs ({selectedLot.poidsNet?.toLocaleString("fr-FR")} kg)
                    </p>
                  </div>
                </div>

                {/* Observation */}
                {selectedLot.observation && (
                  <div className="p-3 bg-muted/40 rounded-lg border text-xs text-slate-700 dark:text-slate-300">
                    <span className="font-semibold block mb-1">Observation / Normes :</span>
                    {selectedLot.observation}
                  </div>
                )}

                {/* Qualités stockées */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                    <PackageCheck className="h-4 w-4" /> Qualités de Café Vert en Entrepôt
                  </h4>
                  <div className="w-full overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Qualité / Grade</TableHead>
                          <TableHead>Emplacement Précis</TableHead>
                          <TableHead className="text-right">Nombre de Sacs</TableHead>
                          <TableHead className="text-right">Poids Net (kg)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedLot.grades?.map((item, idx) => (
                          <TableRow className="odd:bg-muted/50" key={idx}>
                            <TableCell className="font-semibold text-slate-800 dark:text-slate-200">
                              {item.qualite}
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {item.emplacement}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {item.nombre_sacs} sacs
                            </TableCell>
                            <TableCell className="text-right font-semibold text-slate-900 dark:text-white">
                              {item.poidsNet?.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}
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
