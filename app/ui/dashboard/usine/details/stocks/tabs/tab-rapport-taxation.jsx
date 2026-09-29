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
import { Eye, Banknote, AlertCircle, CheckCircle2 } from "lucide-react";
import PaginationContent from "@/components/ui/pagination-content";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function TabRapportTaxation({ searchQuery = "" }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedLot, setSelectedLot] = useState(null);

  const LOTS_TAXES = [
    {
      id: "TAX-001",
      numero_lot: "LOT-VERT-2026-01",
      societe: "SOGESTAL Ngozi",
      sdls: ["SDL Ngozi", "SDL Gitega"],
      qualite_validee: "FW NGOMA MILD-SDL / AA",
      nombreSacs: 216,
      dateTaxation: "2026-05-20",
      montantTaxe: "2 160 000 BIF",
      status: "Taxé & Validé",
      grades: {
        "FW NGOMA MILD-SDL": 118,
        "FW AA": 78,
        "W ABC": 20,
      },
    },
    {
      id: "TAX-002",
      numero_lot: "LOT-VERT-2026-04",
      societe: "SOGESTAL Mumirwa",
      sdls: ["SDL Muramvya"],
      qualite_validee: "GRADE 1",
      nombreSacs: 18,
      dateTaxation: "2026-05-28",
      montantTaxe: "180 000 BIF",
      status: "Taxé & Validé",
      grades: {
        "GRADE 1": 18,
      },
    },
  ];

  const filtered = LOTS_TAXES.filter((lot) => {
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
              <TableHead>Grade / Qualité Validée</TableHead>
              <TableHead className="text-right">Nombre de Sacs</TableHead>
              <TableHead>Date Taxation</TableHead>
              <TableHead className="text-center">Statut</TableHead>
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
                    <span>Aucun rapport de taxation trouvé.</span>
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
                    <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
                      {lot.qualite_validee}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-semibold text-slate-900 dark:text-white">
                    {lot.nombreSacs} sacs
                  </TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-400">
                    {lot.dateTaxation}
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
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Banknote className="h-5 w-5 text-primary" />
              Fiche de Taxation du Lot ({selectedLot?.numero_lot})
            </DialogTitle>
          </DialogHeader>
          {selectedLot && (
            <div className="space-y-4 pt-2">
              <div className="p-3.5 bg-primary/5 border border-primary/10 rounded-lg text-sm space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-primary">{selectedLot.societe}</span>
                  <span className="font-bold text-emerald-600">{selectedLot.montantTaxe}</span>
                </div>
                <div className="text-xs text-slate-500">
                  SDLs : {selectedLot.sdls?.join(", ")} • Date taxation : {selectedLot.dateTaxation}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-primary uppercase tracking-wider">
                  Détail des Quantités Taxées
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedLot.grades &&
                    Object.entries(selectedLot.grades).map(([g, q]) => (
                      <div key={g} className="p-2.5 bg-slate-50 dark:bg-slate-900 rounded-md border text-xs flex justify-between items-center">
                        <span className="font-semibold">{g}</span>
                        <span className="font-bold text-slate-900 dark:text-white">{q} sacs</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
