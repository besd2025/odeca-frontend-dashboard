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
import { Eye, Package, AlertCircle } from "lucide-react";
import PaginationContent from "@/components/ui/pagination-content";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function TabStocksInitiaux({ searchQuery = "", onViewDetails }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const STOCKS_INITIAUX = [
    {
      id: "INIT-001",
      societe: "SOGESTAL Ngozi",
      qualite: "FW AA",
      nombre_sacs: 150,
      poids_net: 9000,
      date_enregistrement: "2026-05-01",
      observation: "Stock initial d'ouverture de campagne.",
      grades: {
        "FW AA": 150,
      },
    },
    {
      id: "INIT-002",
      societe: "COCOCA",
      qualite: "ROBUSTA NATURAL",
      nombre_sacs: 80,
      poids_net: 4800,
      date_enregistrement: "2026-05-02",
      observation: "Report de stock usine saison précédente.",
      grades: {
        "ROBUSTA NATURAL": 80,
      },
    },
  ];

  const filtered = STOCKS_INITIAUX.filter((item) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.societe.toLowerCase().includes(q) ||
      item.qualite.toLowerCase().includes(q) ||
      item.id.toLowerCase().includes(q)
    );
  });

  const handleOpen = (item) => {
    setSelectedItem(item);
    setOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="grid w-full [&>div]:border [&>div]:rounded-md overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Propriétaire / Société</TableHead>
              <TableHead>Qualité (Café Vert)</TableHead>
              <TableHead className="text-right">Nombre de Sacs</TableHead>
              <TableHead className="text-right">Poids Net (kg)</TableHead>
              <TableHead>Date d'Enregistrement</TableHead>
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
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-slate-500 font-medium">
                  <div className="flex flex-col items-center gap-1.5">
                    <AlertCircle className="h-6 w-6 text-slate-400" />
                    <span>Aucun stock initial enregistré.</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((item, idx) => (
                <TableRow key={item.id} className="odd:bg-muted/50">
                  <TableCell className="font-bold text-slate-900 dark:text-white">
                    {idx + 1}
                  </TableCell>
                  <TableCell className="font-medium text-slate-800 dark:text-slate-200">
                    {item.societe}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      {item.qualite}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-semibold text-slate-900 dark:text-white">
                    {item.nombre_sacs} sacs
                  </TableCell>
                  <TableCell className="text-right font-semibold text-slate-900 dark:text-white">
                    {item.poids_net?.toLocaleString("fr-FR")} kg
                  </TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-400">
                    {item.date_enregistrement}
                  </TableCell>
                  <TableCell className="text-right sticky right-0 bg-background shadow-2xl border-l border-slate-200 dark:border-slate-800">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpen(item)}
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
              <Package className="h-5 w-5 text-primary" />
              Détails du Stock Initial ({selectedItem?.id})
            </DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4 pt-2">
              <div className="p-3.5 bg-primary/5 border border-primary/10 rounded-lg text-sm space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-primary">{selectedItem.societe}</span>
                  <Badge variant="secondary">{selectedItem.qualite}</Badge>
                </div>
                <div className="text-xs text-slate-500">
                  Enregistré le : {selectedItem.date_enregistrement} • Volume : {selectedItem.nombre_sacs} sacs ({selectedItem.poids_net?.toLocaleString("fr-FR")} kg)
                </div>
              </div>
              {selectedItem.observation && (
                <div className="p-3 bg-muted/40 rounded-lg border text-xs text-slate-700 dark:text-slate-300">
                  <span className="font-semibold block mb-1">Observation :</span>
                  {selectedItem.observation}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
