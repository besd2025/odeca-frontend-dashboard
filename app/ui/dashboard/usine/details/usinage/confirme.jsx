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
import { CheckCircle2, Factory, MoreHorizontal, Coffee, Pencil } from "lucide-react";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import PaginationContent from "@/components/ui/pagination-content";

export default function ConfirmedUsinage({ searchQuery = "" }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedLot, setSelectedLot] = useState(null);

  const CONFIRMED_USINAGES = [
    {
      id: "USIN-2026-001",
      societe: "SOGESTAL Ngozi",
      sdls: ["SDL Ngozi", "SDL Gitega"],
      usine: "Usine Ngozi",
      dateTransfert: "2026-05-14",
      dateUsinage: "2026-05-15",
      dateSortie: "2026-05-18",
      quantiteIntrants: 15000.0,
      poidsNet: 13200.0,
      rendement: 88.0,
      status: "confirmé",
      observation: "Usinage excellent, bon rendement global. Conversion du café déparché A1/A2 en café vert (FW/W).",
      intrants: [
        { grade: "A1 Déparché", poidsNet: 9000, status: "Traité" },
        { grade: "A2 Déparché", poidsNet: 6000, status: "Traité" },
      ],
      qualitesProduites: [
        { nom_qualite: "FW NGOMA MILD-SDL", quantite_sortie: 7200, nombre_sacs: 120, categorie: "Café Vert (FW)" },
        { nom_qualite: "FW AA", quantite_sortie: 4800, nombre_sacs: 80, categorie: "Café Vert (FW)" },
        { nom_qualite: "W ABC", quantite_sortie: 1200, nombre_sacs: 20, categorie: "Café Vert (W)" },
      ],
    },
    {
      id: "USIN-2026-005",
      societe: "COCOCA",
      sdls: ["SDL Ngozi"],
      usine: "Usine Ngozi",
      dateTransfert: "2026-05-10",
      dateUsinage: "2026-05-11",
      dateSortie: "2026-05-13",
      quantiteIntrants: 10000.0,
      poidsNet: 8600.0,
      rendement: 86.0,
      status: "confirmé",
      observation: "Usinage finalisé avec validation du contrôle qualité laboratoire.",
      intrants: [
        { grade: "B1 Déparché", poidsNet: 10000, status: "Traité" },
      ],
      qualitesProduites: [
        { nom_qualite: "FW AA", quantite_sortie: 5200, nombre_sacs: 87, categorie: "Café Vert (FW)" },
        { nom_qualite: "FW TT", quantite_sortie: 3400, nombre_sacs: 56, categorie: "Café Vert (FW)" },
      ],
    },
  ];

  const filteredLots = CONFIRMED_USINAGES.filter((lot) => {
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
  const handleEditDialog = (lot) => {
    setSelectedLot(lot);
    setOpenEdit(true);
  };

  return (
    <div className="grid w-full [&>div]:border [&>div]:rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="pl-4">Actions</TableHead>
            <TableHead>Société & SDLs</TableHead>
            <TableHead>Usine</TableHead>
            <TableHead>Date Usinage</TableHead>
            <TableHead>Date Sortie</TableHead>
            <TableHead className="text-right">Extrants Café Vert (kg)</TableHead>
            <TableHead className="text-right">Rendement</TableHead>
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
                Aucun lot d'usinage confirmé trouvé.
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
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => handleEditDialog(lot)}
                        >
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
                <TableCell>{lot.dateUsinage}</TableCell>
                <TableCell>{lot.dateSortie || "-"}</TableCell>
                <TableCell className="text-right font-semibold">
                  {lot.poidsNet?.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}
                </TableCell>
                <TableCell className="text-right font-bold text-emerald-600 dark:text-emerald-400">
                  {lot.rendement ? `${lot.rendement}%` : "-"}
                </TableCell>
                <TableCell className="text-center lowercase">
                  <div className="gap-2 flex items-center justify-center">
                    <Badge
                      variant="default"
                      className="gap-1 bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400"
                    >
                      <CheckCircle2 size={16} />
                      <span>Confirmé</span>
                    </Badge>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <PaginationContent />

      {/* Dialog Détails Usinage */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Factory className="h-5 w-5 text-primary" />
              Fiche Récapitulative d'Usinage ({selectedLot?.id})
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
                    <Label className="text-xs text-muted-foreground">Date Usinage & Fin</Label>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Du {selectedLot.dateUsinage} au {selectedLot.dateSortie}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Rendement Global</Label>
                    <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      {selectedLot.rendement}% ({selectedLot.poidsNet?.toLocaleString("fr-FR")} kg obtenus)
                    </p>
                  </div>
                </div>

                {/* Observation */}
                {selectedLot.observation && (
                  <div className="p-3 bg-muted/40 rounded-lg border text-xs text-slate-700 dark:text-slate-300">
                    <span className="font-semibold block mb-1">Observation / Notes d'usinage :</span>
                    {selectedLot.observation}
                  </div>
                )}

                {/* Extrants Café Vert */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                    <Coffee className="h-4 w-4" /> Qualités Obtenues en Sortie (Café Vert)
                  </h4>
                  <div className="w-full overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Qualité / Grade</TableHead>
                          <TableHead>Catégorie</TableHead>
                          <TableHead className="text-right">Nombre de Sacs</TableHead>
                          <TableHead className="text-right">Poids Sortie (kg)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedLot.qualitesProduites?.map((prod, idx) => (
                          <TableRow className="odd:bg-muted/50" key={idx}>
                            <TableCell className="font-semibold text-slate-800 dark:text-slate-200">
                              {prod.nom_qualite}
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {prod.categorie || "Café Vert"}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {prod.nombre_sacs} sacs
                            </TableCell>
                            <TableCell className="text-right font-semibold text-slate-900 dark:text-white">
                              {prod.quantite_sortie?.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}
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

      {/* Dialog Modifier Usinage */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold flex items-center gap-2">
              <Pencil className="h-4 w-4 text-primary" />
              Modifier l'usinage confirmé
            </DialogTitle>
            <DialogDescription>
              Modifiez les informations de cet usinage ci-dessous.
            </DialogDescription>
          </DialogHeader>

          {/* Informations générales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-lg border p-4 bg-muted/30">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Société / Propriétaire</Label>
              <Input value={selectedLot?.societe ?? ""} readOnly />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Usine & SDLs</Label>
              <Input value={selectedLot ? `${selectedLot.usine} (${selectedLot.sdls?.join(", ")})` : ""} readOnly />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Date Usinage</Label>
              <Input type="date" defaultValue={selectedLot?.dateUsinage ?? ""} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Date Sortie</Label>
              <Input type="date" defaultValue={selectedLot?.dateSortie ?? ""} />
            </div>
          </div>

          {/* Intrants modifiables */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Intrants de déparchage</h3>
              <span className="text-xs text-muted-foreground">{selectedLot?.intrants?.length ?? 0} intrant(s)</span>
            </div>
            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Grade / Qualité</TableHead>
                    <TableHead className="min-w-[150px] text-right">Poids Net (kg)</TableHead>
                    <TableHead className="min-w-[160px] text-center">Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!selectedLot?.intrants || selectedLot.intrants.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="py-6 text-center text-muted-foreground">
                        Aucun intrant trouvé.
                      </TableCell>
                    </TableRow>
                  ) : (
                    selectedLot.intrants.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{item.grade}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            defaultValue={item.poidsNet}
                            className="text-right"
                          />
                        </TableCell>
                        <TableCell>
                          <Select defaultValue={item.status}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Choisir le statut" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Traité">Traité</SelectItem>
                              <SelectItem value="En cours">En cours</SelectItem>
                              <SelectItem value="En attente">En attente</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Qualités produites modifiables */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Qualités produites (café vert)</h3>
              <span className="text-xs text-muted-foreground">{selectedLot?.qualitesProduites?.length ?? 0} qualité(s)</span>
            </div>
            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Qualité / Grade</TableHead>
                    <TableHead className="min-w-[120px] text-right">Nb Sacs</TableHead>
                    <TableHead className="min-w-[150px] text-right">Poids Sortie (kg)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!selectedLot?.qualitesProduites || selectedLot.qualitesProduites.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="py-6 text-center text-muted-foreground">
                        Aucune qualité produite.
                      </TableCell>
                    </TableRow>
                  ) : (
                    selectedLot.qualitesProduites.map((prod, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{prod.nom_qualite}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            step="1"
                            defaultValue={prod.nombre_sacs}
                            className="text-right"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            defaultValue={prod.quantite_sortie}
                            className="text-right"
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setOpenEdit(false)}>Annuler</Button>
            <Button>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
