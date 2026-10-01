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
import { Eye, AlertCircle, Warehouse } from "lucide-react";
import PaginationContent from "@/components/ui/pagination-content";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function TabStockNonPreleves({ searchQuery = "" }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedLot, setSelectedLot] = useState(null);

  const LOTS_NON_PRELEVES = [
    {
      id: "SNP-001",
      societe: "SOGESTAL Kayanza",
      numero_lot: "LOT-KAY-01",
      sdls: ["SDL Kayanza"],
      dateEntree: "2026-05-27",
      nombreSacs: 60,
      poidsNet: 3600,
      grades: {
        "FW AA": 40,
        "15+": 20,
      },
      status: "Non prélevé",
      observation: "Lot en attente d'échantillonnage laboratoire.",
    },
    {
      id: "SNP-002",
      societe: "SOGESTAL Mumirwa",
      numero_lot: "LOT-MUM-03",
      sdls: ["SDL Muramvya"],
      dateEntree: "2026-05-28",
      nombreSacs: 18,
      poidsNet: 1080,
      grades: {
        "GRADE 1": 18,
      },
      status: "Non prélevé",
      observation: "Micro-lot en attente de validation qualité.",
    },
  ];

  const filtered = LOTS_NON_PRELEVES.filter((lot) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      lot.societe.toLowerCase().includes(q) ||
      lot.id.toLowerCase().includes(q) ||
      lot.numero_lot.toLowerCase().includes(q)
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
              <TableHead>Numéro Lot</TableHead>
              <TableHead>Propriétaire / Société</TableHead>
              <TableHead>Qualités</TableHead>
              <TableHead className="text-right">Sacs Disponibles</TableHead>
              <TableHead>Date d'Entrée</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right sticky right-0 bg-sidebar shadow-2xl border-l">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-slate-500 font-medium">
                  Chargement...
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-slate-500 font-medium">
                  <div className="flex flex-col items-center gap-1.5">
                    <AlertCircle className="h-6 w-6 text-slate-400" />
                    <span>Aucun stock non prélevé pour le moment.</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((lot, index) => (
                <TableRow key={lot.id} className="odd:bg-muted/50">
                  <TableCell className="font-bold text-slate-900 dark:text-white">
                    {index + 1}
                  </TableCell>
                  <TableCell className="font-semibold text-primary">
                    {lot.numero_lot}
                  </TableCell>
                  <TableCell className="font-medium text-slate-800 dark:text-slate-200">
                    {lot.societe}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {lot.grades &&
                        Object.keys(lot.grades).map((g) => (
                          <Badge key={g} variant="secondary" className="text-xs">
                            {g}
                          </Badge>
                        ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-semibold text-slate-900 dark:text-white">
                    {lot.nombreSacs} sacs
                  </TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-400">
                    {lot.dateEntree}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
                      {lot.status}
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
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Warehouse className="h-5 w-5 text-primary" />
              Détails du Stock Non Prélevé ({selectedLot?.numero_lot})
            </DialogTitle>
          </DialogHeader>
          {selectedLot && (
            <div className="space-y-4 pt-2">
              <div className="p-3.5 bg-primary/5 border border-primary/10 rounded-lg text-sm space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-primary">{selectedLot.societe}</span>
                  <Badge variant="outline">{selectedLot.numero_lot}</Badge>
                </div>
                <div className="text-xs text-slate-500">
                  SDLs : {selectedLot.sdls?.join(", ")} • Total : {selectedLot.nombreSacs} sacs ({selectedLot.poidsNet?.toLocaleString("fr-FR")} kg)
                </div>
              </div>

              {selectedLot.observation && (
                <div className="p-3 bg-muted/40 rounded-lg border text-xs text-slate-700 dark:text-slate-300">
                  <span className="font-semibold block mb-1">Observation :</span>
                  {selectedLot.observation}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
