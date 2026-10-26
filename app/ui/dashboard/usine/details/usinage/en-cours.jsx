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
import { Eye, AlertCircle, Factory, MoreHorizontal, Pencil } from "lucide-react";
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
export default function EnCoursUsinage({ searchQuery = "" }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedLot, setSelectedLot] = useState(null);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [pointer, setPointer] = useState(0);
  const [limit, setLimit] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [usinageEnCoursList, setUsinageEnCoursList] = React?.useState([]);

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
        const response = await fetchData("get", `cafe/transfert_sdl_usine_detail_comfimation/get_transfert_comfirmed_par_societe/`, { params: { usine_deparchage_id: id, etat_selection: "EN_COURS", offset: pointer, limit: limit } });

        const mappedData = response?.results?.map((item) => ({
          id: item?.id,
          code_societe: item?.code_societe,
          societe: item?.nom_societe,
          sdls: item?.sdls,
          usinageQuantitiesTotal: item?.total_quantite_confirme - item?.total_quantite_confirme_tare,
          status: item?.status,
          dateTransfert: item?.dateTransfert,
          dateDebut: item?.dateDebut,
          observation: item?.observation,
          intrants: [
            { grade: "B1", quantite: 2500, poidsNet: 2500, status: "En cours" },
            { grade: "B2", quantite: 1200, poidsNet: 1200, status: "En cours" },
          ],
        })) || [];
        setUsinageEnCoursList(mappedData);
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
              <TableHead>Quantité en Traitement</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right sticky right-0 bg-sidebar shadow-2xl border-l">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-slate-500 font-medium">
                  Chargement...
                </TableCell>
              </TableRow>
            ) : usinageEnCoursList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-slate-500 font-medium">
                  <div className="flex flex-col items-center gap-1.5">
                    <AlertCircle className="h-6 w-6 text-slate-400" />
                    <span>Aucun lot en cours d'usinage.</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              usinageEnCoursList.map((lot, index) => (
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
                        {lot.sdls?.map((sdlNom, i) => (
                          <span
                            key={i}
                            className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded"
                          >
                            {sdlNom}
                          </span>
                        ))}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="text-xs flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300 flex-col">
                        {lot.usinageQuantitiesTotal?.toLocaleString("fr-FR")} kg
                        <span className='font-normal italic text-xs text-slate-600 dark:text-slate-400'>{lot.usinageQuantitiesTotal >= 1000 ? "≈ " + (lot.usinageQuantitiesTotal / 1000).toLocaleString("fr-FR", { minimumFractionDigits: 2 }) + " T" : ""}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800 flex items-center gap-1 w-max"
                    >
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                      </span>
                      En cours
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

      <PaginationContent />

      {/* Details Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Factory className="h-5 w-5 text-primary" />
              Détails du lot en cours d'usinage ({selectedLot?.id})
            </DialogTitle>

            {selectedLot && (
              <div className="space-y-4 mt-4 text-left">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3.5 bg-primary/5 rounded-lg border border-primary/10">
                  <div>
                    <Label className="text-xs text-muted-foreground">Société / Propriétaire</Label>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {selectedLot.societe}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">SDLs Associées</Label>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {selectedLot.sdls?.join(", ") || "-"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Date de Lancement</Label>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {selectedLot.dateDebut || selectedLot.dateTransfert || "-"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Poids Total Entré</Label>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {selectedLot.usinageQuantitiesTotal?.toLocaleString("fr-FR")} kg
                    </p>
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
                    Intrants en Cours de Traitement
                  </h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Grade / Qualité</TableHead>
                        <TableHead className="text-right">Poids Net (kg)</TableHead>
                        <TableHead className="text-center">Statut</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedLot.intrants?.map((item, idx) => (
                        <TableRow key={idx} className="odd:bg-muted/50">
                          <TableCell className="font-semibold text-slate-800 dark:text-slate-200">
                            {item.grade}
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            {item.poidsNet?.toLocaleString("fr-FR")} kg
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline" className="text-xs">
                              {item.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Dialog Modifier Usinage en cours */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold flex items-center gap-2">
              <Pencil className="h-4 w-4 text-primary" />
              Modifier l'usinage en cours
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
              <Label className="text-xs text-muted-foreground">SDLs associées</Label>
              <Input value={selectedLot?.sdls?.join(", ") ?? ""} readOnly />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Date de Lancement</Label>
              <Input type="date" defaultValue={selectedLot?.dateDebut ?? selectedLot?.dateTransfert ?? ""} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Observation</Label>
              <Input defaultValue={selectedLot?.observation ?? ""} />
            </div>
          </div>

          {/* Intrants en cours modifiables */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Intrants en cours de traitement</h3>
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
                            type="number" min="0" step="0.01"
                            defaultValue={item.poidsNet}
                            className="text-right"
                          />
                        </TableCell>
                        <TableCell>
                          <Select defaultValue={item.status ?? "En cours"}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Statut" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="En cours">En cours</SelectItem>
                              <SelectItem value="Terminé">Terminé</SelectItem>
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

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setOpenEdit(false)}>Annuler</Button>
            <Button>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
