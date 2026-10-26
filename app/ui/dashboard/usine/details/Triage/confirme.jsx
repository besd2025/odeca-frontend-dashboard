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
import { CheckCircle2, Search, MoreHorizontal, Layers, PackageCheck, Pencil } from "lucide-react";
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
import { fetchData } from "@/app/_utils/api";
import { useSearchParams } from "next/navigation";
export default function ConfirmedTriage({ searchQuery = "" }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedLot, setSelectedLot] = useState(null);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [pointer, setPointer] = useState(0);
  const [limit, setLimit] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [confirmeTriageList, setConfirmeTriageList] = React?.useState([]);

  const handleOpenDetails = (lot) => {
    setSelectedLot(lot);
    setOpen(true);
  };
  const handleEditDialog = (lot) => {
    setSelectedLot(lot);
    setOpenEdit(true);
  };

  React?.useEffect(() => {
    const handleFetchData = async () => {
      //setLoading(true);
      try {
        const response = await fetchData("get", `cafe/triage/get_termine_triage/`, { params: { usine_deparchage_id: id, offset: pointer, limit: limit } });

        const mappedData = response?.results?.map((item) => ({
          id: item?.id,
          code_societe: item?.code_societe,
          societe: item?.nom_societe,
          sdls: item?.sdls,
          nombre_sacs: item?.nombre_sacs_total,
          usinageQuantitiesTotal: item?.quantite_total,
          status: item?.processing_status,
          dateUsinage: item?.date_debut,
          dateSortie: item?.date_fin,
          observation: item?.observation,
          productions: item?.productions
        })) || [];
        setConfirmeTriageList(mappedData);
        setTotalCount(response?.count || 0);
      } catch (error) {
        console.error(`Error fetching data for tab pretes usinage:`, error);
      } finally {
        setLoading(false);
      }
    };
    handleFetchData();

  }, [limit, pointer, id]);

  return (
    <div className="grid w-full [&>div]:border [&>div]:rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="pl-4">Actions</TableHead>
            <TableHead>Société & SDLs</TableHead>
            <TableHead>Usine</TableHead>
            <TableHead>Date Début</TableHead>
            <TableHead>Date Fin Triage</TableHead>
            <TableHead className="text-right">Sacs Triés</TableHead>
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
          ) : confirmeTriageList?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-slate-500 dark:text-slate-400 font-medium">
                Aucun lot de triage confirmé trouvé.
              </TableCell>
            </TableRow>
          ) : (
            confirmeTriageList?.map((lot, index) => (
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
                <TableCell>{lot.dateEntree}</TableCell>
                <TableCell>{lot.dateSortie || "-"}</TableCell>
                <TableCell className="text-right font-medium">
                  {lot.totalSacs} sacs
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

      {/* Dialog Détails Triage */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              Fiche Récapitulative du Triage ({selectedLot?.id})
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
                    <Label className="text-xs text-muted-foreground">Période de Triage</Label>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Du {selectedLot.dateEntree} au {selectedLot.dateSortie}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Quantité Totale Triée</Label>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {selectedLot.totalSacs} sacs ({selectedLot.poidsNet?.toLocaleString("fr-FR")} kg)
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

                {/* Grades Triés & Qualités */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                    <PackageCheck className="h-4 w-4" /> Qualités Triées & Prêtes à Stocker
                  </h4>
                  <div className="w-full overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Grade / Qualité</TableHead>
                          <TableHead>Type de Traitement</TableHead>
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
                              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                                {item.type}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {item.nombre_sacs} sacs
                            </TableCell>
                            <TableCell className="text-right font-semibold text-slate-900 dark:text-white">
                              {item.quantite_kg?.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}
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

      {/* Dialog Modifier Triage confirmé */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold flex items-center gap-2">
              <Pencil className="h-4 w-4 text-primary" />
              Modifier le triage confirmé
            </DialogTitle>
            <DialogDescription>
              Modifiez les informations de ce lot trié ci-dessous.
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
              <Input value={selectedLot ? `${selectedLot.usine ?? ""} (${selectedLot.sdls?.join(", ") ?? ""})` : ""} readOnly />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Date Début Triage</Label>
              <Input type="date" defaultValue={selectedLot?.dateEntree ?? ""} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Date Fin Triage</Label>
              <Input type="date" defaultValue={selectedLot?.dateSortie ?? ""} />
            </div>
          </div>

          {/* Grades triés modifiables */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Qualités triées</h3>
              <span className="text-xs text-muted-foreground">{selectedLot?.grades?.length ?? 0} grade(s)</span>
            </div>
            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Grade / Qualité</TableHead>
                    <TableHead className="min-w-[120px] text-right">Nb Sacs</TableHead>
                    <TableHead className="min-w-[150px] text-right">Poids Net (kg)</TableHead>
                    <TableHead className="min-w-[150px] text-center">Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!selectedLot?.grades || selectedLot.grades.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="py-6 text-center text-muted-foreground">
                        Aucun grade trouvé.
                      </TableCell>
                    </TableRow>
                  ) : (
                    selectedLot.grades.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{item.qualite}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            step="1"
                            defaultValue={item.nombre_sacs}
                            className="text-right"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            defaultValue={item.quantite_kg}
                            className="text-right"
                          />
                        </TableCell>
                        <TableCell>
                          <Select defaultValue={item.type ?? "TRIE"}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="TRIE">Trié</SelectItem>
                              <SelectItem value="STOCK_DIRECT">Stock direct</SelectItem>
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

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setOpenEdit(false)}>Annuler</Button>
            <Button>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
