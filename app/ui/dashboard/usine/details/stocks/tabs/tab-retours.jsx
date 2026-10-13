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
import { Eye, RotateCcw, AlertCircle, AlertTriangle } from "lucide-react";
import PaginationContent from "@/components/ui/pagination-content";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function TabRetours({ searchQuery = "" }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedLot, setSelectedLot] = useState(null);

  const LOTS_RETOURS = [
    {
      id: "RET-2026-001",
      societe: "SOGESTAL Kayanza",
      sdls: ["SDL Kayanza"],
      dateRetour: "2026-05-22",
      nombreSacs: 12,
      poidsNet: 720,
      grade: "W TT",
      motifRetour: "Taux d'humidité trop élevé (>12%). Nécessite un séchage complémentaire et un re-triage.",
      status: "En retriage",
    },
    {
      id: "RET-2026-002",
      societe: "COCOCA",
      sdls: ["SDL Karusi"],
      dateRetour: "2026-05-25",
      nombreSacs: 8,
      poidsNet: 480,
      grade: "COQUE",
      motifRetour: "Défauts de triage constatés lors du contrôle qualité en laboratoire. Présence de fèves noires.",
      status: "Retourné",
    },
  ];

  const filtered = LOTS_RETOURS.filter((lot) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      lot.societe.toLowerCase().includes(q) ||
      lot.id.toLowerCase().includes(q) ||
      lot.grade.toLowerCase().includes(q)
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
              <TableHead>Société & SDLs</TableHead>
              <TableHead>Grades / Qualité</TableHead>
              <TableHead className="text-right">Nombre de Sacs</TableHead>
              <TableHead>Motif de Retour</TableHead>
              <TableHead>Date Retour</TableHead>
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
                    <span>Aucun retour enregistré.</span>
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
                  <TableCell>
                    <Badge variant="secondary" className="text-xs bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400">
                      {lot.grade}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-semibold text-slate-900 dark:text-white">
                    {lot.nombreSacs} sacs
                  </TableCell>
                  <TableCell className="text-xs text-slate-600 dark:text-slate-400 max-w-[200px] truncate">
                    {lot.motifRetour}
                  </TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    {lot.dateRetour}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="border-red-200 bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400">
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
              <RotateCcw className="h-5 w-5 text-red-500" />
              Fiche de Retour ({selectedLot?.id})
            </DialogTitle>
          </DialogHeader>
          {selectedLot && (
            <div className="space-y-4 pt-2">
              <div className="p-3.5 bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg text-sm space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-red-700 dark:text-red-400">{selectedLot.societe}</span>
                  <Badge variant="outline" className="text-red-600">{selectedLot.grade}</Badge>
                </div>
                <div className="text-xs text-slate-500">
                  SDLs : {selectedLot.sdls?.join(", ")} • Volume : {selectedLot.nombreSacs} sacs ({selectedLot.poidsNet} kg)
                </div>
              </div>

              <div className="p-3 bg-red-50/30 rounded-lg border border-red-100 text-xs text-red-800 dark:text-red-300">
                <span className="font-bold flex items-center gap-1.5 mb-1">
                  <AlertTriangle className="h-3.5 w-3.5 text-red-600" /> Motif du Retour :
                </span>
                <p className="leading-relaxed">{selectedLot.motifRetour}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
