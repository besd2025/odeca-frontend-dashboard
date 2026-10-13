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
import { Button } from "@/components/ui/button";
import { Eye, CheckCircle2, Warehouse, AlertCircle } from "lucide-react";
import PaginationContent from "@/components/ui/pagination-content";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function TabLotsStockesTaxes({ searchQuery = "" }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedLot, setSelectedLot] = useState(null);

  const LOTS_STOCKES = [
    {
      id: "STOCK-2026-001",
      numeroLot: "LOT-VERT-2026-01",
      societe: "SOGESTAL Ngozi",
      sdls: ["SDL Ngozi", "SDL Gitega"],
      usine: "Usine Ngozi",
      dateStockage: "2026-05-20",
      nombreSacs: 216,
      poidsNet: 12960,
      emplacement: "Hangar 1 - Allée B & C",
      status: "Stocké & Taxé",
      observation: "Lot stocké sous sacs hermétiques GrainPro. Taux d'humidité conforme à 11.4%.",
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
      nombreSacs: 18,
      poidsNet: 1080,
      emplacement: "Hangar 3 - Zone Spéciale",
      status: "Stocké & Taxé",
      observation: "Micro-lot stocké prêt pour vente aux enchères.",
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
      nombreSacs: 3,
      poidsNet: 180,
      emplacement: "Hangar 2 - Allée A",
      status: "Stocké & Taxé",
      observation: "Stock direct sans retriage requis.",
      grades: [
        { qualite: "W ABC", nombre_sacs: 3, poidsNet: 180, emplacement: "Hangar 2 - Rack 1" },
      ],
    },
  ];

  const filtered = LOTS_STOCKES.filter((lot) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      lot.societe.toLowerCase().includes(q) ||
      lot.id.toLowerCase().includes(q) ||
      lot.numeroLot?.toLowerCase().includes(q)
    );
  });

  const handleOpen = (lot) => {
    setSelectedLot(lot);
    setOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="grid w-full [&>div]:border [&>div]:rounded-md overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Numéro Lot / Société</TableHead>
              <TableHead>Usine</TableHead>
              <TableHead>Date Stockage</TableHead>
              <TableHead>Emplacement</TableHead>
              <TableHead className="text-right">Sacs Stockés</TableHead>
              <TableHead className="text-right">Poids Net (kg)</TableHead>
              <TableHead className="text-center">Statut</TableHead>
              <TableHead className="text-right sticky right-0 bg-sidebar shadow-2xl border-l">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-slate-500 font-medium">
                  Chargement...
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-slate-500 font-medium">
                  <div className="flex flex-col items-center gap-1.5">
                    <AlertCircle className="h-6 w-6 text-slate-400" />
                    <span>Aucun lot stocké et taxé trouvé.</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((lot, index) => (
                <TableRow key={lot.id} className="odd:bg-muted/50">
                  <TableCell className="font-bold text-slate-900 dark:text-white">
                    {index + 1}
                  </TableCell>
                  <TableCell>
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
                  <TableCell className="font-semibold text-slate-800 dark:text-slate-200">
                    {lot.usine || "-"}
                  </TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-400">
                    {lot.dateStockage}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {lot.emplacement || "-"}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {lot.nombreSacs} sacs
                  </TableCell>
                  <TableCell className="text-right font-semibold text-slate-900 dark:text-white">
                    {lot.poidsNet?.toLocaleString("fr-FR")}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="default" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 gap-1">
                      <CheckCircle2 size={14} />
                      <span>{lot.status}</span>
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right sticky right-0 bg-background shadow-2xl border-l border-slate-200 dark:border-slate-800">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpen(lot)}
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
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Warehouse className="h-5 w-5 text-primary" />
              Fiche de Stock - {selectedLot?.numeroLot} ({selectedLot?.id})
            </DialogTitle>
          </DialogHeader>
          {selectedLot && (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3.5 bg-primary/5 rounded-lg border border-primary/10">
                <div>
                  <span className="text-xs text-muted-foreground block">Société / Propriétaire</span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{selectedLot.societe}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Emplacement Entrepôt</span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{selectedLot.emplacement}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Date de Stockage</span>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{selectedLot.dateStockage}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Total Stocké</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{selectedLot.nombreSacs} sacs ({selectedLot.poidsNet?.toLocaleString("fr-FR")} kg)</span>
                </div>
              </div>

              {selectedLot.observation && (
                <div className="p-3 bg-muted/40 rounded-lg border text-xs text-slate-700 dark:text-slate-300">
                  <span className="font-semibold block mb-1">Observation :</span>
                  {selectedLot.observation}
                </div>
              )}

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Qualités en Stock</h4>
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
                      <TableRow key={idx} className="odd:bg-muted/50">
                        <TableCell className="font-semibold">{item.qualite}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{item.emplacement}</TableCell>
                        <TableCell className="text-right font-medium">{item.nombre_sacs} sacs</TableCell>
                        <TableCell className="text-right font-semibold">{item.poidsNet?.toLocaleString("fr-FR")}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
