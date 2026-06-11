import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Layers, Building2, Settings } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { fetchData } from "@/app/_utils/api";

import { Checkbox } from "@/components/ui/checkbox";

export default function InputForm({ onAddLot, id, code_societe, societe }) {
  const [open, setOpen] = useState(false);
  const [dateUsinage, setDateUsinage] = useState(new Date().toISOString().split("T")[0]);
  const [checkedGrades, setCheckedGrades] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiGradesMap, setApiGradesMap] = useState({});
  const [allSDLs, setAllSDLs] = useState([]);

  // Load confirmed receptions from API
  useEffect(() => {
    const loadData = async () => {
      try {
        const pendingRes = await fetchData("get", `cafe/transfert_sdl_usine_detail_comfimation/get_transfert_comfirmed_par_societe_detail/`, { params: { code_societe: code_societe } });

        const details = pendingRes?.transfert_details_comfirmation || pendingRes?.results || [];
        const newMap = {};
        details.forEach(item => {
          const sdlName = item?.transfert_detail?.transfer?.sdl?.sdl_nom || item?.sdl?.sdl_nom || "";
          const gradeName = item?.grade?.grade_name || item?.transfert_detail?.grade?.grade_name || item?.grade || "";
          const quantiteBrut = parseFloat(item?.quantite_confirme_brut || 0);
          const quantiteTare = parseFloat(item?.quantite_confirme_tare || 0);
          const quantite = quantiteBrut > 0 ? (quantiteBrut - quantiteTare) : parseFloat(item?.quantite || 0);
          const sacs = item?.nombre_sac || item?.sacs || 0;

          if (!newMap[sdlName]) newMap[sdlName] = [];
          newMap[sdlName].push({
            id: item.id,
            grade: gradeName,
            quantite: quantite.toString(),
            nombreDeSacs: sacs.toString(),
            detailId: item?.transfert_detail?.id || item.id
          });
        });

        setApiGradesMap(newMap);
        setAllSDLs(Object.keys(newMap));

        // Initialiser toutes les cases à cocher à false par défaut
        const initialChecked = {};
        Object.entries(newMap).forEach(([sdl, grades]) => {
          grades.forEach(g => {
            initialChecked[g.id] = false;
          });
        });
        setCheckedGrades(initialChecked);

      } catch (error) {
        console.error("Error fetching confirmed receptions:", error);
      }
    }

    if (open && code_societe) {
      loadData();
    }
  }, [open, code_societe]);

  const handleCheckGrade = (key) => {
    setCheckedGrades((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const aggregateGrades = () => {
    const qty = {};
    const sacs = {};
    const checkedIds = [];
    Object.entries(apiGradesMap).forEach(([sdl, grades]) => {
      grades.forEach((g) => {
        if (checkedGrades[g.id]) {
          checkedIds.push(g.id);
          const gKey = g.grade;
          const q = parseFloat(g.quantite) || 0;
          const s = parseInt(g.nombreDeSacs) || 0;
          console.log("gKey: ", gKey);
          qty[gKey] = (qty[gKey] || 0) + q;
          sacs[gKey] = (sacs[gKey] || 0) + s;
        }
      });
    });
    return { qty, sacs, checkedIds };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!societe) {
      toast.error("Veuillez sélectionner la société.");
      return;
    }

    const chosenSDLs = allSDLs;
    const { qty, sacs, checkedIds } = aggregateGrades();

    const newLot = {
      societe,
      selectedSDLs: chosenSDLs,
      dateUsinage,
      usinageQuantities: qty,
      usinageSacs: sacs,
      checkedGradeIds: checkedIds,
      receptionId: null,
    };
    if (code_societe && checkedIds.length > 0) {

      const promise = new Promise(async (resolve, reject) => {
        try {
          const results = await fetchData(
            "post",
            `/cafe/usinages/selectionner_quantites_a_usiner/`,
            {
              params: {},
              additionalHeaders: {},
              body: {
                societe_code: code_societe,
                confirmation_ids: checkedIds,
                date_debut: dateUsinage,

              },
            },
          );

          if (results.status == 200) {
            resolve({ sdlName });
          } else {
            reject(new Error("Erreur"));
          }
        } catch (error) {
          reject(error);
        }
      });

      toast.promise(promise, {
        loading: "Modification...",
        success: (data) => {
          setTimeout(() => setOpen(false), 500);
          return `Données Enregistrées avec succès `;
        },
        error: "Donnée non enregistrée!!!",
      });

      try {
        await promise;
      } catch (error) {
        console.error(error);
        setError(error);
      } finally {
        setLoading(false);
      }
    }
    else {
      toast.error("Aucune donnée selectionnée.");
    }
  }


  // if (onAddLot) onAddLot(newLot);
  // toast.success("Lot ajouté en usinage !");
  // setOpen(false);


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">
          <Settings className="mr-2 h-4 w-4" /> Usiner
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-4xl md:max-w-2xl lg:max-w-[90vw] bg-sidebar border border-slate-200 dark:border-slate-800 shadow-xl overflow-y-auto max-h-[90vh]">
        <DialogTitle className="sr-only">Ajouter un Lot en Usinage</DialogTitle>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <Card className="shadow-none dark:bg-slate-950 border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" /> Informations Générales (Entrée)
                </CardTitle>
                <CardDescription>Société et SDL</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="font-semibold text-slate-700 dark:text-slate-300">Société / Propriétaire</Label>
                    <Select value={societe} disabled>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sélectionner une société" />
                      </SelectTrigger>
                      <SelectContent>

                        <SelectItem value={societe}>
                          {societe}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-semibold text-slate-700 dark:text-slate-300">Date d'Usinage</Label>
                    <div className="relative">
                      <Input type="date" value={dateUsinage} onChange={(e) => setDateUsinage(e.target.value)} className="w-full pl-10" />
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex flex-wrap gap-2">
                    {allSDLs.map((sdl, index) => (
                      <div key={index + 1} className="bg-primary/10 border border-primary/20 dark:bg-primary/20 text-slate-800 dark:text-slate-200 px-3 py-1 rounded-full text-xs font-semibold">
                        {sdl}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-none dark:bg-slate-950 border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Layers className="h-5 w-5 text-primary" /> Quantités Usinées par Grade
                </CardTitle>
                <CardDescription>Affichage des grades par SDL</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {allSDLs.map((sdl) => {
                    const grades = apiGradesMap[sdl] || [];
                    return (
                      <div key={sdl} className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                        <Table>
                          <TableCaption className="bg-slate-100 dark:bg-slate-900 p-2 text-left text-slate-700 dark:text-slate-300 w-max caption-top">
                            SDL d'origine : <span className="text-primary text-md font-semibold">{sdl}</span>
                          </TableCaption>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[150px]">Grade</TableHead>
                              <TableHead>Quantité (Kg)</TableHead>
                              <TableHead>Nombre de Sacs</TableHead>
                              <TableHead>Combiner</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {grades.map((g) => (
                              <TableRow key={g.id}>
                                <TableCell className="font-medium">{g.grade}</TableCell>
                                <TableCell>{g.quantite || "-"} Kg</TableCell>
                                <TableCell>{g.nombreDeSacs || "-"} Sacs</TableCell>
                                <TableCell>
                                  <Checkbox checked={!!checkedGrades[g.id]} onCheckedChange={() => handleCheckGrade(g.id)} />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
                <Button type="submit"> <Settings className="mr-2 h-4 w-4" /> Usiner</Button>
              </CardFooter>
            </Card>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
