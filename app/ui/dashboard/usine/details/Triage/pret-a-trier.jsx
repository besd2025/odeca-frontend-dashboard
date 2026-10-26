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
import { ClipboardList, Eye, AlertCircle, Search, MoreHorizontal, Pencil } from "lucide-react";
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
import { TableRowsSkeleton } from '@/components/ui/skeletons';

export default function PretATrier({ searchQuery = "" }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedLot, setSelectedLot] = useState(null);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [pointer, setPointer] = useState(0);
  const [limit, setLimit] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const currentPage = Math.floor(pointer / limit) + 1;
  const totalPages = Math.max(1, Math.ceil(totalCount / limit));
  const [enAttenteTriageList, setEnAttenteTriageList] = useState([]);
  const [pretTrierList, setPreTrierList] = useState([]);
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
        const response = await fetchData("get", `cafe/usinages/get_pret_pour_triage/`, { params: { usine_deparchage_id: id, offset: pointer, limit: limit } });
        console.log("pret a trier", response);
        const mappedData = response?.results?.map((item) => ({
          id: item?.id,
          code_societe: item?.code_societe,
          societe: item?.nom_societe,
          grades: item?.productions,
          nombre_sacs: item?.nombre_sacs_total,
          usinageQuantitiesTotal: item?.quantite_total,
          status: item?.processing_status,
          dateEntree: item?.date_debut,
          dateSortie: item?.date_fin,
          observation: item?.observation,
          productions: item?.productions
        })) || [];
        setPreTrierList(mappedData);
        console.log("mappedData", mappedData);
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
              <TableHead>Grade / Poids Initial</TableHead>
              <TableHead>Date Entrée</TableHead>
              <TableHead>Date Sortie</TableHead>
              <TableHead>Statut</TableHead>
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
            ) : pretTrierList?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-slate-500 font-medium">
                  <div className="flex flex-col items-center gap-1.5">
                    <AlertCircle className="h-6 w-6 text-slate-400" />
                    <span>Aucun lot prêt à trier trouvé.</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              pretTrierList?.map((lot, index) => (
                <TableRow key={lot.id} className="odd:bg-muted/50">
                  <TableCell className="font-bold text-slate-900 dark:text-white">
                    {pointer + index + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {lot.societe}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {lot.grades && lot?.grades.map((grade, qty) => (
                        <div key={grade?.id} className="text-xs flex items-center gap-1.5">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {grade?.nom_qualite}:
                          </span>
                          <span className="text-slate-600 dark:text-slate-400">{grade?.nombre_sacs} sacs: </span>
                          <span className="text-slate-600 dark:text-slate-400">{grade?.quantite_sortie} kg</span>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    {new Date(lot.dateEntree).toLocaleDateString("fr-FR") || "—"}
                  </TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    {new Date(lot.dateSortie).toLocaleDateString("fr-FR") || "—"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="border-blue-200 bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800 flex items-center gap-1 whitespace-nowrap w-max"
                    >
                      <ClipboardList className="h-3 w-3" />
                      Prêt à trier
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
        pointer={pointer}
        totalCount={totalCount}
        limit={limit}
        onPageChange={(page) => setPointer((page - 1) * limit)}
        onLimitChange={(newLimit) => {
          setLimit(newLimit);
          setPointer(0);
        }}
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
              Détail du lot de café vert prêt à être trié.
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
                  Date d'entrée : {new Date(selectedLot.dateEntree).toLocaleDateString(
                    {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                    }
                  )}
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
                  Grades et Sacs en Entrée
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedLot.grades && selectedLot.grades.length > 0 ? selectedLot.grades.map((grade, index) => (
                    <div key={index} className="p-2.5 bg-slate-50 dark:bg-slate-900 rounded-md border text-xs flex justify-between items-center">
                      <span className="font-semibold">{grade.nom_qualite}</span>
                      <span className="font-bold text-slate-900 dark:text-white">{grade.nombre_sacs} sacs</span>
                    </div>
                  )) : (
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-900 rounded-md border text-xs flex justify-between items-center">
                      <span className="font-semibold">{selectedLot.qualite}</span>
                      <span className="font-bold text-slate-900 dark:text-white">{selectedLot.nombre_sacs} sacs</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog Modifier Prêt à trier */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold flex items-center gap-2">
              <Pencil className="h-4 w-4 text-primary" />
              Modifier le lot prêt à trier
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
              <Label className="text-xs text-muted-foreground">Date d'entrée</Label>
              <Input type="date" defaultValue={selectedLot?.dateEntree ?? ""} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Date de sortie</Label>
              <Input type="date" defaultValue={selectedLot?.dateSortie ?? ""} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Observation</Label>
              <Input defaultValue={selectedLot?.observation ?? ""} />
            </div>
          </div>

          {/* Grades/productions modifiables */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Grades et productions</h3>
              <span className="text-xs text-muted-foreground">{selectedLot?.grades?.length ?? 0} grade(s)</span>
            </div>
            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Qualité</TableHead>
                    <TableHead className="min-w-[120px] text-right">Nb Sacs</TableHead>
                    <TableHead className="min-w-[150px] text-right">Quantité (kg)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!selectedLot?.grades || selectedLot.grades.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="py-6 text-center text-muted-foreground">
                        Aucun grade trouvé.
                      </TableCell>
                    </TableRow>
                  ) : (
                    selectedLot.grades.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{item.nom_qualite}</TableCell>
                        <TableCell>
                          <Input
                            type="number" min="0" step="1"
                            defaultValue={item.nombre_sacs}
                            className="text-right"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number" min="0" step="0.01"
                            defaultValue={item.quantite_sortie}
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
