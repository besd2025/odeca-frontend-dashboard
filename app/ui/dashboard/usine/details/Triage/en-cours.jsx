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
import { Eye, AlertCircle, Search, MoreHorizontal, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
export default function EnCoursTriage({ searchQuery = "" }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedLot, setSelectedLot] = useState(null);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [pointer, setPointer] = useState(0);
  const [limit, setLimit] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [enCoursTriageList, setEnCoursTriageList] = React?.useState([]);
  const totalPages = Math.ceil(totalCount / limit) || 1;

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setPointer((page - 1) * limit);
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPointer(0);
    setCurrentPage(1);
  };
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
        const response = await fetchData("get", `cafe/triage/get_en_cours_triage/`, { params: { usine_deparchage_id: id, offset: pointer, limit: limit } });
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
        setEnCoursTriageList(mappedData);
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
    <div className="space-y-4">
      <div className="grid w-full [&>div]:border [&>div]:rounded-md overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Société & SDLs</TableHead>
              <TableHead>Quantités à trier</TableHead>
              <TableHead>Date Entrée</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right sticky right-0 bg-sidebar shadow-2xl border-l">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-slate-500 font-medium">
                  Chargement...
                </TableCell>
              </TableRow>
            ) : enCoursTriageList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-slate-500 font-medium">
                  <div className="flex flex-col items-center gap-1.5">
                    <AlertCircle className="h-6 w-6 text-slate-400" />
                    <span>Aucun lot en cours de triage trouvé.</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              enCoursTriageList?.map((lot, index) => (
                <TableRow key={lot.id} className="odd:bg-muted/50">
                  <TableCell className="font-bold text-slate-900 dark:text-white">
                    {pointer + index + 1}
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
                    <div className="flex flex-col gap-1">
                      <div className="text-xs flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                        {lot.quantite_trie?.toLocaleString("fr-FR")} kg / {lot.nombre_sacs} sacs
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    {lot.dateEntree || "—"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800 flex items-center gap-1 whitespace-nowrap w-max"
                    >
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                      </span>
                      En cours de triage
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right sticky right-0 bg-background shadow-2xl border-l border-slate-200 dark:border-slate-800">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer ml-auto flex">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="cursor-pointer" onClick={() => handleOpenDetails(lot)}>
                          Détails
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer" onClick={() => handleEditDialog(lot)}>
                          Modifier
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <PaginationContent
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        pointer={pointer}
        totalCount={totalCount}
        limit={limit}
        onLimitChange={handleLimitChange}
      />

      {/* Details Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              Fiche Récapitulative du Triage ({selectedLot?.id})
            </DialogTitle>
            <DialogDescription className="text-slate-500 text-xs">
              Détail complet du lot en cours de triage.
            </DialogDescription>
          </DialogHeader>

          {selectedLot && (
            <div className="space-y-4 pt-2">
              <div className="p-3.5 bg-primary/5 border border-primary/10 rounded-lg text-sm space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-primary">Lot ID : {selectedLot.id}</span>
                  <span className="text-xs bg-primary/10 px-2.5 py-0.5 rounded-full font-semibold">
                    {selectedLot.societe}
                  </span>
                </div>
                <div className="text-xs text-slate-500">
                  SDLs : {selectedLot.sdls?.join(", ")} • Date début : {selectedLot.dateEntree}
                </div>
              </div>

              {selectedLot.observation && (
                <div className="p-3 bg-muted/40 rounded-lg border text-xs text-slate-700 dark:text-slate-300">
                  <span className="font-semibold block mb-1">Observation :</span>
                  {selectedLot.observation}
                </div>
              )}

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-primary uppercase tracking-wider">
                  Qualités et Volumes
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedLot.grades?.map((g, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-50 dark:bg-slate-900 rounded-md border text-xs flex justify-between items-center">
                      <span className="font-semibold">{g.qualite}</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {g.nombre_sacs} sacs ({g.quantite_kg?.toLocaleString("fr-FR")} kg)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog Modifier Triage en cours */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold flex items-center gap-2">
              <Pencil className="h-4 w-4 text-primary" />
              Modifier le lot en cours de triage
            </DialogTitle>
            <DialogDescription>
              Modifiez les informations de ce lot ci-dessous.
            </DialogDescription>
          </DialogHeader>

          {/* Informations générales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-lg border p-4 bg-muted/30">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Société / Propriétaire</Label>
              <Input value={selectedLot?.societe ?? ""} readOnly />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">SDLs</Label>
              <Input value={selectedLot?.sdls?.join(", ") ?? ""} readOnly />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Date d'entrée</Label>
              <Input type="date" defaultValue={selectedLot?.dateUsinage ?? ""} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Quantité totale (kg)</Label>
              <Input type="number" min="0" step="0.01" defaultValue={selectedLot?.usinageQuantitiesTotal ?? ""} />
            </div>
            <div className="space-y-1 col-span-2">
              <Label className="text-xs text-muted-foreground">Observation</Label>
              <Input defaultValue={selectedLot?.observation ?? ""} />
            </div>
          </div>

          {/* Productions modifiables */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Qualités en cours de triage</h3>
              <span className="text-xs text-muted-foreground">{selectedLot?.productions?.length ?? 0} qualité(s)</span>
            </div>
            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Qualité</TableHead>
                    <TableHead className="min-w-[120px] text-right">Nb Sacs</TableHead>
                    <TableHead className="min-w-[150px] text-right">Quantité (kg)</TableHead>
                    <TableHead className="min-w-[150px] text-center">Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!selectedLot?.productions || selectedLot.productions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="py-6 text-center text-muted-foreground">
                        Aucune production trouvée.
                      </TableCell>
                    </TableRow>
                  ) : (
                    selectedLot.productions.map((prod, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{prod.nom_qualite}</TableCell>
                        <TableCell>
                          <Input type="number" min="0" step="1" defaultValue={prod.nombre_sacs} className="text-right" />
                        </TableCell>
                        <TableCell>
                          <Input type="number" min="0" step="0.01" defaultValue={prod.quantite_sortie} className="text-right" />
                        </TableCell>
                        <TableCell>
                          <Select defaultValue="EN_COURS">
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Statut" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="EN_COURS">En cours</SelectItem>
                              <SelectItem value="TERMINE">Terminé</SelectItem>
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
