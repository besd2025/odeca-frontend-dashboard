import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, RotateCcw, AlertCircle } from "lucide-react";
import PaginationContent from "@/components/ui/pagination-content";
const RETOUR_LOTS = [
    {
        id: "STOCK-2026-R01",
        societe: "SOGESTAL Kayanza",
        sdls: ["SDL Kayanza"],
        grades: { "W TT": 12 },
        motifRetour: "Taux d'humidité trop élevé (supérieur à 12%). Nécessite un séchage complémentaire et un re-triage.",
        dateRetour: "2026-05-22",
        status: "En retriage",
    },
    {
        id: "STOCK-2026-R02",
        societe: "COCOCA",
        sdls: ["SDL Karusi"],
        grades: { "COQUE": 8 },
        motifRetour: "Défauts de triage constatés lors du contrôle qualité en laboratoire. Présence de fèves noires.",
        dateRetour: "2026-05-25",
        status: "Retourné",
    },
];

export default function RetourList({ }) {
    const [isViewingDetails, setIsViewingDetails] = useState(false);
    const [selectedLot, setSelectedLot] = useState(null);
    const handleViewDetails = (lot) => {
        setSelectedLot(lot);
        setIsViewingDetails(true);
    };

    return (
        <Card className="shadow-xs dark:bg-slate-950 border-slate-200 dark:border-slate-800">
            <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <RotateCcw className="h-5 w-5 text-primary" /> LOTS Retournés pour Réusinage
                </CardTitle>
                <CardDescription>
                    Liste des LOTS renvoyés pour un cycle de ré-usinage suite à un défaut de qualité ou un problème identifié.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {RETOUR_LOTS.length === 0 ? (
                    <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center bg-slate-50/50 dark:bg-slate-900/30">
                        <AlertCircle className="h-8 w-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                            Aucun lot retourné pour réusinage. Les LOTS refusés après contrôle qualité apparaîtront ici.
                        </p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Numéro de Lot</TableHead>
                                <TableHead>Propriétaire / Société</TableHead>
                                <TableHead>Motif de Retour</TableHead>
                                <TableHead>Date de Retour</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead className="text-right sticky right-0 bg-sidebar shadow-2xl">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {RETOUR_LOTS.map((lot) => (
                                <TableRow key={lot.id}>
                                    <TableCell className="font-bold text-slate-900 dark:text-white whitespace-nowrap">
                                        {lot.id}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-0.5">
                                            <span className="font-medium text-slate-800 dark:text-slate-200">
                                                {lot.societe}
                                            </span>
                                            {lot.sdls && lot.sdls.length > 0 && (
                                                <div className="flex flex-wrap gap-1">
                                                    {lot.sdls.map((sdl) => (
                                                        <span
                                                            key={sdl}
                                                            className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded"
                                                        >
                                                            {sdl}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="max-w-[200px]">
                                        <span className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2">
                                            {lot.motifRetour || "—"}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-slate-600 dark:text-slate-400 whitespace-nowrap">
                                        {lot.dateRetour || "—"}
                                    </TableCell>
                                    <TableCell>
                                        {lot.status === "En retriage" ? (
                                            <Badge
                                                variant="outline"
                                                className="border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800 flex items-center gap-1 whitespace-nowrap"
                                            >
                                                <span className="relative flex h-2 w-2">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                                                </span>
                                                En retriage
                                            </Badge>
                                        ) : (
                                            <Badge
                                                variant="outline"
                                                className="border-red-200 bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800 flex items-center gap-1 whitespace-nowrap"
                                            >
                                                <RotateCcw className="h-3 w-3" />
                                                Retourné
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right sticky right-0 bg-background shadow-2xl border-l border-slate-200 dark:border-slate-800">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleViewDetails(lot)}
                                            className="h-8 text-xs flex items-center gap-1.5 ml-auto bg-sidebar"
                                        >
                                            <Eye className="h-3.5 w-3.5" /> Détails
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
                <PaginationContent />
                <Dialog open={isViewingDetails} onOpenChange={setIsViewingDetails}>
                    <DialogContent className="sm:max-w-2xl bg-sidebar border border-slate-200 dark:border-slate-800 shadow-xl overflow-y-auto max-h-[90vh]">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
                                Fiche du Lot {selectedLot?.id}
                            </DialogTitle>
                            <DialogDescription className="text-slate-500 dark:text-slate-400">
                                Informations détaillées sur le lot sélectionné.
                            </DialogDescription>
                        </DialogHeader>
                        {selectedLot && (
                            <div className="space-y-4">
                                {/* Lot info banner */}
                                <div className="p-3.5 bg-primary/5 border border-primary/10 rounded-lg text-sm space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-primary">Lot : {selectedLot.id}</span>
                                        <span className="text-xs bg-primary/10 px-2.5 py-0.5 rounded-full font-semibold">
                                            {selectedLot.societe}
                                        </span>
                                    </div>
                                    {selectedLot.sdls && (
                                        <div className="text-xs text-slate-500 dark:text-slate-400">
                                            SDLs : {selectedLot.sdls.join(", ")}
                                        </div>
                                    )}
                                </div>

                                {/* Info grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Grades */}
                                    <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-lg border border-slate-100 dark:border-slate-900 space-y-2">
                                        <span className="text-xs font-bold text-secondary uppercase tracking-wider">
                                            Grades / Qualité (Café Vert)
                                        </span>
                                        <div className="space-y-1.5 mt-2">
                                            {selectedLot.grades && Object.entries(selectedLot.grades).map(([grade, qty]) => (
                                                <div key={grade} className="flex justify-between items-center text-sm">
                                                    <span className="">{grade}</span>
                                                    <span className="font-bold text-slate-900 dark:text-white">{qty} sacs</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Metadata */}
                                    <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-lg border border-slate-100 dark:border-slate-900 space-y-3">
                                        {selectedLot.nombreSacs !== undefined && (
                                            <div>
                                                <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">
                                                    Nombre de Sacs
                                                </span>
                                                <span className="text-lg font-bold text-primary dark:text-white">
                                                    {selectedLot.nombreSacs} sacs
                                                </span>
                                            </div>
                                        )}
                                        {selectedLot.dateStockage && (
                                            <div>
                                                <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">
                                                    Date de Stockage
                                                </span>
                                                <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                                    {selectedLot.dateStockage}
                                                </span>
                                            </div>
                                        )}
                                        {selectedLot.dateRetour && (
                                            <div>
                                                <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">
                                                    Date de Retour
                                                </span>
                                                <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                                    {selectedLot.dateRetour}
                                                </span>
                                            </div>
                                        )}
                                        {selectedLot.status && (
                                            <div>
                                                <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">
                                                    Statut
                                                </span>
                                                <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                                    {selectedLot.status}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Motif retour if applicable */}
                                {selectedLot.motifRetour && (
                                    <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-100 dark:border-red-900 space-y-1">
                                        <span className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
                                            Motif de Retour
                                        </span>
                                        <p className="text-sm text-red-700 dark:text-red-300 leading-relaxed">
                                            {selectedLot.motifRetour}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    );
}
