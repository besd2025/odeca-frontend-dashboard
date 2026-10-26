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
import { Settings, Eye, AlertCircle, Factory, MoreHorizontal, Pencil } from "lucide-react";
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
export default function PretesUsinage({ searchQuery = "" }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedLot, setSelectedLot] = useState(null);
  const [pointer, setPointer] = useState(0);
  const [limit, setLimit] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [usinagePretList, setUsinagePretList] = useState([]);
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
        const response = await fetchData("get", `cafe/transfert_sdl_usine_detail_comfimation/get_transfert_comfirmed_par_societe/?usine_deparchage_id=${id}`, { params: { etat_selection: "PRET_USINE", offset: pointer, limit: limit } });
        const mappedData = response?.results?.map((item) => ({
          id: item?.id,
          code_societe: item?.code_societe,
          societe: item?.nom_societe,
          sdls: item?.sdls,
          usinageQuantitiesTotal: item?.total_quantite_confirme - item?.total_quantite_confirme_tare,
          status: item?.status,
          dateTransfert: item?.dateTransfert,
          observation: item?.observation,
          intrants: item?.details?.map((detail) => ({
            grade: detail?.grade,
            quantite: detail?.quantite,
            poidsNet: detail?.poids_net,
            status: detail?.status,
          })) || [],
        })) || [];
        setUsinagePretList(mappedData);
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
              <TableHead>Quantité Intrants</TableHead>
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
            ) : usinagePretList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-slate-500 font-medium">
                  <div className="flex flex-col items-center gap-1.5">
                    <AlertCircle className="h-6 w-6 text-slate-400" />
                    <span>Aucun lot prêt pour l'usinage trouvé.</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              usinagePretList.map((lot, index) => (
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
                      className="border-blue-200 bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800 flex items-center gap-1 w-max"
                    >
                      <Settings className="h-3.5 w-3.5" />
                      Pretes à l'usinage
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
              <Factory className="h-5 w-5 text-primary" />
              Détails du lot prêt pour usinage ({selectedLot?.id})
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
                    <Label className="text-xs text-muted-foreground">SDLs d'Origine</Label>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {selectedLot.sdls?.join(", ") || "-"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Date de Réception</Label>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {selectedLot.dateTransfert || "-"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Quantité Totale Prête</Label>
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
                    Ventilation des Intrants Déparchés
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

      {/* Dialog Modifier Prêt à l'usinage */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold flex items-center gap-2">
              <Pencil className="h-4 w-4 text-primary" />
              Modifier le lot prêt à l'usinage
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
              <Label className="text-xs text-muted-foreground">SDLs d'origine</Label>
              <Input value={selectedLot?.sdls?.join(", ") ?? ""} readOnly />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Date de Réception</Label>
              <Input type="date" defaultValue={selectedLot?.dateTransfert ?? ""} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Observation</Label>
              <Input defaultValue={selectedLot?.observation ?? ""} />
            </div>
          </div>

          {/* Intrants modifiables */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Ventilation des intrants déparchés</h3>
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
                          <Select defaultValue={item.status ?? "PRET_USINE"}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Statut" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="PRET_USINE">Prêt à l'usinage</SelectItem>
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
