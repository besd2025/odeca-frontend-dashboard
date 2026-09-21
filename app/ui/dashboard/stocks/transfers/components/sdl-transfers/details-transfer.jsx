"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Layers,
  CheckCircle2,
  Clock,
  XCircle,
  Pencil,
} from "lucide-react";
import ViewImageDialog from "@/components/ui/view-image-dialog";
import { toast } from "sonner";
import { fetchData } from "@/app/_utils/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// Données fictives (Mock Data) pour la liste des grades
const MOCK_GRADES = [
  {
    id: 1,
    grade: "A1",
    quantite: 1500,
    cafe_parche_type: "Cerise A",
    enregitrement_date: "2025-01-15",
    comfirmation_status: "CONFIRMEE",
  },
  {
    id: 2,
    grade: "A2",
    quantite: 2300,
    cafe_parche_type: "Cerise A",
    enregitrement_date: "2025-01-15",
    comfirmation_status: "EN_ATTENTE",
  },
  {
    id: 3,
    grade: "B1",
    quantite: 850,
    cafe_parche_type: "Cerise B",
    enregitrement_date: "2025-01-16",
    comfirmation_status: "EN_ATTENTE",
  },
];
const typeOptions = [
  { value: "FULL_WASHED", label: "FULL_WASHED" },
  { value: "MIEL", label: "MIEL" },
  { value: "NATUREL", label: "NATUREL" },
];

export default function DetailsTransfer({
  transfer = {},
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  trigger,
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? setControlledOpen : setInternalOpen;
  const [transferData, setTransferData] = useState([]);
  // Liste des grades avec données mockées
  const [gradesDetails, setGradesDetails] = useState(MOCK_GRADES);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // État pour le sous-dialogue de modification
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [gradeOptions, setGradeOptions] = React.useState([]);
  const [qteParche, setQteParche] = React.useState(0);
  const [idGrade, setIdGrade] = React.useState("");
  const [idType, setIdType] = React.useState("");
  console.log(transfer);
  React.useEffect(() => {
    const fetchSdlTransfersDetails = async () => {
      if (transfer?.id) {
        try {
          const response = await fetchData("get", `cafe/transfert_sdl_usine/${transfer?.id}/get_transfert_details_sdl_to_usine_deparchage/`);
          const fetchedGrades = await fetchData("get", `cafe/grades/get_all_grades/`);
          const seen = new Set();
          const options = fetchedGrades
            ?.map((item) => ({
              value: item.grade_code,
              label: item.grade_name,
            }))

            .filter((item) => {
              if (!item.value) return false;
              if (seen.has(item.value)) return false;
              seen.add(item.value);
              return true;
            }) || [];
          setGradeOptions(options);
          const result = response?.results[0];
          const data = {
            chauffeurNom: result?.transfer?.chauffeur_nom || "-",
            chauffeurPrenom: result?.transfer?.chauffeur_prenom || "-",
            chauffeurTelephone: result?.transfer?.chauffeur_telephone || "-",

            nomAccompagnateur: result?.transfer?.nom_accompagnateur || "-",
            prenomAccompagnateur: result?.transfer?.prenom_accompagnateur || "-",
            phoneAccompagnateur: result?.transfer?.phone_accompagnteur || result?.transfer?.phone_accompagnateur || "-",

            plaqueCamion: result?.transfer?.plaque_camion || "-",
            totalParche: result?.quantite || 0,
            dateReception: result?.transfer?.date_reception || "-",

            sdlSource: result?.transfer?.sdl?.sdl_nom || "-",
            usineDestination: result?.transfer?.usine_deparchage?.usine_name || "-",
            transferDate: result?.transfer?.transfer_date || "-",
            photoBordereau: result?.transfer?.photo_bordereau || null,
            consignataire: result?.transfer?.consignataire || "-",

            grades: response?.results,
            isConfirmed: {
              est_confirme: result?.est_confirme || "-",
              status: result?.status || "-",
              comfirmation_status: result?.comfirmation_status || "-"
            }

          }
          setTransferData(data)
          if (Array.isArray(response?.results)) {
            setGradesDetails(response.results);
          }
        } catch (error) {
          console.error("Error fetching SDL transfers details:", error);
        }
      }
    };
    fetchSdlTransfersDetails();
  }, [transfer]);
  // Champs du transfert


  const renderStatusBadge = (status) => {
    const s = String(status || "").toUpperCase();
    if (s === "CONFIRMEE" || s === "CONFIRME" || s === "CONFIRMED" || status === true) {
      return (
        <Badge variant="secondary" className="gap-1">
          <CheckCircle2 className="h-3 w-3" />
          Confirmé
        </Badge>
      );
    }
    if (s === "REJETEE" || s === "REJETE" || s === "REJECTED") {
      return (
        <Badge variant="destructive" className="gap-1">
          <XCircle className="h-3 w-3" />
          Rejeté
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="gap-1">
        <Clock className="h-3 w-3" />
        En attente
      </Badge>
    );
  };

  // Ouvrir le sous-dialogue pour modifier
  const handleOpenEdit = (gradeItem) => {
    setSelectedGrade(gradeItem);
    setIdGrade(gradeItem?.grade?.grade_code);
    setQteParche(gradeItem?.quantite);
    setIdType(gradeItem?.cafe_parche_type);
    setEditModalOpen(true);
  };

  // Enregistrer les modifications localement
  const handleSaveEdit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      transfer_detail_code: selectedGrade?.transfer_detail_code || "",
      grade_code: idGrade || "",
      quantite: qteParche || 0,
      cafe_parche_type: idType || "",
    };
    const promise = new Promise(async (resolve, reject) => {
      try {
        if (!selectedGrade?.id) {
          reject(new Error("ID du Grade manquant."));
          return;
        }
        if (!idGrade || !qteParche || !idType) {
          reject(new Error("Veuillez remplir tous les champs obligatoires."));
          return;
        }

        const result = await fetchData(
          "patch",
          `/cafe/transfert_sdl_usine_detail/${selectedGrade.id}/`,
          { body: dataToSend }
        );

        if (result.status === 200 || result.status === 201) {
          resolve(result.data);
        } else {
          reject(new Error("Erreur lors de la modification."));
        }
      } catch (err) {
        reject(err);
      }
    });

    toast.promise(promise, {
      loading: "Modification en cours...",
      success: () => {
        setTimeout(() => setOpen(false), 1000);
        return "Le rendement a été modifié avec succès !";
      },
      error: (err) => err?.message || "Erreur lors de la modification !",
    });

    try {
      await promise;
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setLoading(false);
    }


  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        {trigger ? (
          <DialogTrigger asChild>{trigger}</DialogTrigger>
        ) : !isControlled ? (
          <DialogTrigger asChild>
            <Button variant="ghost" className="w-full justify-start gap-2 p-2 font-normal text-sm">
              <span>Détails</span>
            </Button>
          </DialogTrigger>
        ) : null}

        <DialogContent className="sm:max-w-[780px] bg-sidebar p-0 overflow-y-auto max-h-[90vh] flex flex-col">
          <DialogHeader className="p-5 pb-3 border-b bg-card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <DialogTitle className="text-lg font-bold text-foreground">
                  Détails du Transfert SDL
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  Informations sur le transport, chauffeur, accompagnateur et liste des grades
                </DialogDescription>
              </div>
              {/* <div>{renderStatusBadge(transferData?.isConfirmed?.est_confirme ? "CONFIRMEE" : "EN_ATTENTE")}</div> */}
            </div>

            {/* Informations de base avec disposition en 2 colonnes */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-3 mt-3 border-t border-border/50 text-sm">
              <div className="col-span-1 sm:col-span-3 flex flex-col gap-2">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <span className="font-medium text-foreground">Source :</span>
                  <span className="truncate">{transferData?.sdlSource}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <span className="font-medium text-foreground">Destination :</span>
                  <span className="truncate">{transferData?.usineDestination}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <span className="font-medium text-foreground">Date :</span>
                  <span>{transferData?.transferDate}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <span className="font-medium text-foreground">Chauffeur :</span>
                  <span>{transferData?.chauffeurNom} {transferData?.chauffeurPrenom !== "-" ? transferData?.chauffeurPrenom : ""}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <span className="font-medium text-foreground">Téléphone chauffeur :</span>
                  <span>{transferData?.chauffeurTelephone}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <span className="font-medium text-foreground">Accompagnateur :</span>
                  <span>{transferData?.nomAccompagnateur} {transferData?.prenomAccompagnateur !== "-" ? transferData?.prenomAccompagnateur : ""}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <span className="font-medium text-foreground">Téléphone accompagnateur :</span>
                  <span>{transferData?.phoneAccompagnateur}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <span className="font-medium text-foreground">Véhicule :</span>
                  <span className="font-semibold font-mono bg-muted px-1.5 py-0.5 rounded text-foreground">
                    {transferData?.plaqueCamion}
                  </span>
                </div>
                {/* <div className="flex items-center gap-1.5 text-muted-foreground">
                  <span className="font-medium text-foreground">Total parche :</span>
                  <span className="font-bold text-primary text-sm">
                    {typeof transferData?.totalParche === "number"
                      ? transferData?.totalParche.toLocaleString("fr-FR", { minimumFractionDigits: 2 })
                      : transferData?.totalParche}{" "}
                    kg
                  </span>
                </div> */}
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <span className="font-medium text-foreground">Date de réception :</span>
                  <span className="font-semibold font-mono bg-muted px-1.5 py-0.5 rounded text-foreground">
                    {transferData?.dateReception}
                  </span>
                </div>
              </div>

              {/* Photo bordereau */}
              <div>
                {transferData?.photoBordereau && transferData?.photoBordereau !== "null" && (
                  <div className="p-3 flex items-center justify-between">
                    <div className="flex flex-col items-center gap-4">
                      <div>
                        <div className="text-xs font-semibold text-foreground">Bordereau de Transfert</div>
                        <div className="text-[11px] text-muted-foreground">Cliquez sur l'image pour l'agrandir</div>
                      </div>
                      <ViewImageDialog
                        imageUrl={transferData?.photoBordereau}
                        alt="Bordereau de transfert"
                        profile={false}
                        className="h-24 w-24 rounded-md border"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </DialogHeader>

          {/* Corps de la boîte de dialogue */}
          <div className="custom-scrollbar flex-1">
            {/* Section: Tableau liste des grades */}
            <div className="space-y-2.5 p-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-semibold text-sm text-foreground">
                  <Layers className="h-4 w-4 text-primary" />
                  <span>Liste des Lots de Café & Grades</span>
                </div>
                <span className="text-xs text-muted-foreground font-medium">
                  {(transferData?.grades || gradesDetails)?.length || 0} grade{((transferData?.grades || gradesDetails)?.length || 0) > 1 ? "s" : ""}
                </span>
              </div>

              <div className="rounded-lg border bg-card overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="font-semibold text-xs">Actions</TableHead>
                      <TableHead className="font-semibold text-xs">Grade</TableHead>
                      <TableHead className="font-semibold text-xs text-right">Quantité (kg)</TableHead>
                      <TableHead className="font-semibold text-xs">Type de Café Parche</TableHead>
                      <TableHead className="font-semibold text-xs text-center">Date d'enregistrement</TableHead>
                      <TableHead className="font-semibold text-xs text-center">Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transferData?.grades?.map((item) => (
                      <TableRow key={item.id} className="hover:bg-muted/30">
                        {item.comfirmation_status === "PENDING" ? (
                          <TableCell className="w-16">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 cursor-pointer"
                              onClick={() => handleOpenEdit(item)}
                              title="Modifier ce lot"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                          </TableCell>
                        ) : (
                          <TableCell className="w-16">
                            -
                          </TableCell>
                        )}
                        <TableCell className="font-semibold text-foreground text-sm">
                          <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-bold text-xs">
                            {item?.grade?.grade_name}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-bold text-foreground text-sm">
                          {typeof item?.quantite === "number"
                            ? item?.quantite.toLocaleString("fr-FR", { minimumFractionDigits: 0 })
                            : item?.quantite}
                        </TableCell>
                        <TableCell className="text-sm text-foreground">
                          <span className="font-medium">{item?.cafe_parche_type}</span>
                        </TableCell>
                        <TableCell className="text-center text-xs text-muted-foreground">
                          {item?.enregitrement_date
                            ? new Date(item.enregitrement_date).toLocaleDateString("fr-FR")
                            : "-"}
                        </TableCell>
                        <TableCell className="text-center">
                          {renderStatusBadge(item?.comfirmation_status)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Sous-dialogue de modification d'un lot/grade */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-[420px] bg-card">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              Modifier le Lot ({selectedGrade?.grade?.grade_name || selectedGrade?.grade || ""})
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Modifier les informations de ce lot de café
            </DialogDescription>
          </DialogHeader>

          {selectedGrade && (
            <form onSubmit={handleSaveEdit} className="space-y-4 pt-2">


              {/* Grade Select — HORS de DialogHeader pour éviter le conflit Radix portal */}
              <div className="space-y-2 text-left">
                <Label htmlFor="gradeId" className="font-semibold text-slate-700 dark:text-slate-300">
                  Grade
                </Label>
                <Select
                  value={idGrade}
                  onValueChange={setIdGrade}
                >
                  <SelectTrigger id="gradeId" className="w-full cursor-pointer">
                    <SelectValue placeholder={selectedGrade?.grade?.grade_name} />
                  </SelectTrigger>
                  <SelectContent>
                    {gradeOptions.map((item, index) => (
                      <SelectItem key={`${index + 1}`} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Quantité (kg)</Label>
                <Input
                  type="number"
                  step="any"
                  value={qteParche}
                  onChange={(e) =>
                    setQteParche(parseFloat(e.target.value) || 0)
                  }

                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Type de Café Parche</Label>
                {selectedGrade?.cafe_parche_type != null ? (
                  <Select
                    value={""}
                  >
                    <SelectTrigger id="typeId" className="w-full cursor-pointer">
                      <SelectValue placeholder={selectedGrade?.cafe_parche_type} />
                    </SelectTrigger>
                  </Select>
                ) : (
                  <Select
                    value={idType}
                    onValueChange={setIdType}
                  >
                    <SelectTrigger id="typeId" className="w-full cursor-pointer">
                      <SelectValue placeholder="Choisir un type" />
                    </SelectTrigger>
                    <SelectContent>
                      {typeOptions.map((item, index) => (
                        <SelectItem key={`${index + 1}`} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>


              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Date d'enregistrement</Label>
                <Input
                  disabled
                  type="date"
                  value={
                    selectedGrade?.enregitrement_date
                      ? selectedGrade.enregitrement_date.split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    setSelectedGrade((prev) => ({
                      ...prev,
                      enregitrement_date: e.target.value,
                    }))
                  }

                />
              </div>

              <DialogFooter className="pt-3 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditModalOpen(false)}
                >
                  Annuler
                </Button>
                <Button type="submit" size="sm">
                  Enregistrer
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
