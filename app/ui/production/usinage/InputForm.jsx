import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Layers, Building2, Trash2, Plus, X, Settings } from "lucide-react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox";
const SOCIETE_LIST = ["SOGESTAL Kirundo-Muyinga", "SOGESTAL Kayanza", "SOGESTAL Ngozi", "COCOCA", "SOGESTAL Mumirwa"];
const SDL_LIST = ["SDL Ngozi", "SDL Kayanza", "SDL Gitega", "SDL Muramvya", "SDL Karusi"];
const USINAGE_GRADES = ["A1", "A2", "A3", "A4", "B1", "B2", "B3", "COQUE", "CAFE NATUREL", "CAFE Miel", "Anaerobic", "Robusta"];

const SDL_GRADES_MAP = {
  "SDL Ngozi": [
    {
      grade: "A1",
      quantite: "565",
      nombreDeSacs: "6"
    }, {
      grade: "A2",
      quantite: "4760",
      nombreDeSacs: "75"
    }, {
      grade: "COQUE",
      quantite: "840",
      nombreDeSacs: "12"
    }
  ],
  "SDL Kayanza": [
    { grade: "A1", quantite: "555", nombreDeSacs: "77" },
    { grade: "A3", quantite: "444", nombreDeSacs: "66" },
    { grade: "CAFE NATUREL", quantite: "333", nombreDeSacs: "55" }
  ],
  "SDL Gitega": [
    { grade: "B1", quantite: "222", nombreDeSacs: "44" },
    { grade: "B2", quantite: "222", nombreDeSacs: "44" },
    { grade: "B3", quantite: "222", nombreDeSacs: "44" }
  ],
  "SDL Muramvya": [
    { grade: "B2", quantite: "222", nombreDeSacs: "44" },
    { grade: "B3", quantite: "222", nombreDeSacs: "44" },
    { grade: "COQUE", quantite: "222", nombreDeSacs: "44" }
  ],
  "SDL Karusi": [
    { grade: "A2", quantite: "222", nombreDeSacs: "44" },
    { grade: "B2", quantite: "222", nombreDeSacs: "44" },
    { grade: "CAFE Miel", quantite: "222", nombreDeSacs: "44" }
  ],
};

export default function InputForm({ onAddLot }) {
  const searchParams = useSearchParams();
  const queryReceptionId = searchParams?.get("receptionId") || "";

  const [open, setOpen] = useState(false);
  const [confirmedReceptions, setConfirmedReceptions] = useState([]);
  const [selectedReceptionId, setSelectedReceptionId] = useState("");

  const [societe, setSociete] = useState("");
  const [selectedSDLs, setSelectedSDLs] = useState([]);
  const [dateUsinage, setDateUsinage] = useState(new Date().toISOString().split("T")[0]);
  const [activeGrades, setActiveGrades] = useState([]);
  const [quantities, setQuantities] = useState(
    USINAGE_GRADES.reduce((acc, grade) => ({ ...acc, [grade]: "" }), {})
  );
  const [gradeSacs, setGradeSacs] = useState(
    USINAGE_GRADES.reduce((acc, grade) => ({ ...acc, [grade]: "" }), {})
  );
  const [gradeSDLs, setGradeSDLs] = useState({});
  const [checkedGrades, setCheckedGrades] = useState({});

  const handleCheckGrade = (grade) => {
    setCheckedGrades(prev => ({
      ...prev,
      [grade]: !prev[grade]
    }));
  };

  const getGradeInfo = (sdl, grade) => {
    const sdlData = SDL_GRADES_MAP[sdl] || [];
    const gradeData = sdlData.find(item => item.grade === grade);
    return gradeData ? { quantite: gradeData.quantite, nombreDeSacs: gradeData.nombreDeSacs } : null;
  };
  // Load confirmed receptions from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("odeca_receptions");
    if (stored) {
      const parsed = JSON.parse(stored);
      setConfirmedReceptions(parsed.filter((r) => r.status === "confirmé"));
    }
  }, [open]);

  // Open dialog and select reception if passed in URL
  useEffect(() => {
    if (queryReceptionId) {
      setOpen(true);
      setSelectedReceptionId(queryReceptionId);
      const stored = localStorage.getItem("odeca_receptions");
      if (stored) {
        const parsed = JSON.parse(stored);
        const found = parsed.find(r => r.id === queryReceptionId && r.status === "confirmé");
        if (found) {
          setSociete(found.societe);
          setSelectedSDLs(found.sdls);
        }
      }
    }
  }, [queryReceptionId]);

  // Load grades dynamically based on selected SDLs
  useEffect(() => {
    if (selectedSDLs.length > 0) {
      const gradesSet = new Set();
      const tempGradeSDLs = { ...gradeSDLs };
      selectedSDLs.forEach((sdl) => {
        const grades = SDL_GRADES_MAP[sdl] || ["A1", "A2"];
        grades.forEach((gradeItem) => {
          // Extract grade string from either a string or object
          const gradeString = typeof gradeItem === 'string' ? gradeItem : gradeItem.grade;
          gradesSet.add(gradeString);
          if (!tempGradeSDLs[gradeString] || !selectedSDLs.includes(tempGradeSDLs[gradeString]) || !(SDL_GRADES_MAP[tempGradeSDLs[gradeString]] || []).includes(gradeString)) {
            tempGradeSDLs[gradeString] = sdl;
          }
        });
      });
      setActiveGrades(Array.from(gradesSet));
      setGradeSDLs(
        Array.from(gradesSet).reduce((acc, grade) => {
          acc[grade] = tempGradeSDLs[grade] || "";
          return acc;
        }, {})
      );
    } else {
      setActiveGrades([]);
      setGradeSDLs({});
    }
  }, [selectedSDLs]);
  const handleSDLSelect = (val) => {
    if (val && !selectedSDLs.includes(val)) {
      setSelectedSDLs(prev => [...prev, val]);
    }
  };

  const handleSDLRemove = (sdl) => {
    setSelectedSDLs(prev => prev.filter(item => item !== sdl));
  };

  const handleQtyChange = (grade, value) => {
    setQuantities(prev => ({ ...prev, [grade]: value }));
  };

  const handleSacsChange = (grade, value) => {
    setGradeSacs(prev => ({ ...prev, [grade]: value }));
  };



  const handleSubmit = (e) => {
    e.preventDefault();
    if (!societe) {
      toast.error("Veuillez sélectionner la société.");
      return;
    }
    if (selectedSDLs.length === 0) {
      toast.error("Veuillez sélectionner au moins une station de lavage (SDL).");
      return;
    }
    if (activeGrades.length === 0) {
      toast.error("Veuillez ajouter au moins un grade de café en entrée.");
      return;
    }

    // Check that at least one quantity is entered
    const enteredQuantities = {};
    let hasQuantity = false;
    activeGrades.forEach(grade => {
      const q = quantities[grade];
      if (q && parseFloat(q) > 0) {
        enteredQuantities[grade] = parseFloat(q);
        hasQuantity = true;
      }
    });

    if (!hasQuantity) {
      toast.error("Veuillez entrer une quantité supérieure à 0 pour au moins un grade.");
      return;
    }

    const enteredSacs = {};
    activeGrades.forEach(grade => {
      const s = gradeSacs[grade];
      if (s) {
        enteredSacs[grade] = parseInt(s) || 0;
      }
    });

    const newLot = {
      societe,
      selectedSDLs,
      dateUsinage,
      usinageQuantities: enteredQuantities,
      usinageSacs: enteredSacs,
      receptionId: selectedReceptionId !== "none" ? selectedReceptionId : null
    };

    onAddLot(newLot);

    // Reset form
    setSociete("");
    setSelectedSDLs([]);
    setDateUsinage(new Date().toISOString().split("T")[0]);
    setActiveGrades([]);
    setQuantities(USINAGE_GRADES.reduce((acc, grade) => ({ ...acc, [grade]: "" }), {}));
    setGradeSacs(USINAGE_GRADES.reduce((acc, grade) => ({ ...acc, [grade]: "" }), {}));
    setSelectedReceptionId("");
    setOpen(false);
    toast.success("Lot ajouté en cours d'usinage !");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="">
          <Settings className="mr-2 h-4 w-4" /> Usiner
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl md:max-w-2xl lg:max-w-[90vw] bg-sidebar border border-slate-200 dark:border-slate-800 shadow-xl overflow-y-auto max-h-[90vh]">
        <DialogTitle className="sr-only">Ajouter un Lot en Usinage</DialogTitle>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Informations Générales Card */}
            <Card className="shadow-none dark:bg-slate-950 border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" /> Informations Générales (Entrée)
                </CardTitle>
                <CardDescription>Sélection de la société de gestion et des stations de lavage concernées.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">


                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="societe" className="font-semibold text-slate-700 dark:text-slate-300">
                      Société / Propriétaire
                    </Label>
                    <Select onValueChange={setSociete} value={societe} disabled={!!selectedReceptionId && selectedReceptionId !== "none"}>
                      <SelectTrigger id="societe" className="w-full">
                        <SelectValue placeholder="Sélectionner une société" />
                      </SelectTrigger>
                      <SelectContent>
                        {SOCIETE_LIST.map((soc) => (
                          <SelectItem key={soc} value={soc}>
                            {soc}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateUsinage" className="font-semibold text-slate-700 dark:text-slate-300">
                      Date d'Usinage
                    </Label>
                    <div className="relative">
                      <Input
                        type="date"
                        id="dateUsinage"
                        value={dateUsinage}
                        onChange={(e) => setDateUsinage(e.target.value)}
                        className="w-full pl-10"
                        required
                      />
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="font-semibold text-slate-700 dark:text-slate-300">
                    Stations de Lavage (SDL) Concernées
                  </Label>
                  <div className="w-full sm:w-80">
                    <Select onValueChange={handleSDLSelect} value="" disabled={!!selectedReceptionId && selectedReceptionId !== "none"}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={selectedReceptionId && selectedReceptionId !== "none" ? "Incluses dans la réception" : "Ajouter une station (SDL)..."} />
                      </SelectTrigger>
                      <SelectContent>
                        {SDL_LIST.filter((sdl) => !selectedSDLs.includes(sdl)).map((sdl) => (
                          <SelectItem key={sdl} value={sdl}>
                            {sdl}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {selectedSDLs.length > 0 ? (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {selectedSDLs.map((sdl) => (
                        <div
                          key={sdl}
                          className="bg-primary/10 border border-primary/20 dark:bg-primary/20 text-slate-800 dark:text-slate-200 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5"
                        >
                          {sdl}
                          {(!selectedReceptionId || selectedReceptionId === "none") && (
                            <button
                              type="button"
                              onClick={() => handleSDLRemove(sdl)}
                              className="text-primary hover:text-red-500 dark:hover:text-red-400 focus:outline-hidden transition-colors"
                            >
                              <X className="h-3.5 w-3.5 stroke-[2.5]" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">Aucune station sélectionnée. Veuillez en ajouter au moins une.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quantités Entrées en Usinage Card */}
            <Card className="shadow-none dark:bg-slate-950 border-slate-200 dark:border-slate-800 flex flex-col justify-between">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3">
                <div>
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Layers className="h-5 w-5 text-primary" /> Quantités Usinées par Grade
                  </CardTitle>
                  <CardDescription>Saisie des volumes pour les grades de café envoyés automatiquement par les SDL d'origine.</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                {selectedSDLs.length > 0 && (
                  <div className="space-y-4">
                    {selectedSDLs.map((sdl) => {
                      const sdlGrades = activeGrades.filter(grade => gradeSDLs[grade] === sdl);
                      return sdlGrades.length > 0 ? (
                        <div key={sdl} className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                          <Table>
                            <TableCaption className="bg-slate-100 dark:bg-slate-900 p-2 text-left  text-slate-700 dark:text-slate-300">
                              SDL d'origine : <span className="text-primary text-md font-semibold">{sdl}</span>
                            </TableCaption>
                            <TableHeader>
                              <TableRow className="bg-slate-50 dark:bg-slate-900">
                                <TableHead className="w-[150px]">Grade</TableHead>
                                <TableHead>Quantité (Kg)</TableHead>
                                <TableHead>Nombre de Sacs</TableHead>
                                <TableHead>Combiner</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {sdlGrades.map((grade) => {
                                const gradeInfo = getGradeInfo(sdl, grade);
                                return (
                                  <TableRow key={grade}>
                                    <TableCell className="font-medium text-slate-800 dark:text-slate-200">{grade}</TableCell>
                                    <TableCell className="text-slate-700 dark:text-slate-300">{gradeInfo?.quantite || "-"} Kg</TableCell>
                                    <TableCell className="text-slate-700 dark:text-slate-300">{gradeInfo?.nombreDeSacs || "-"} Sacs</TableCell>
                                    <TableCell>
                                      <Checkbox
                                        checked={checkedGrades[grade] || false}
                                        onCheckedChange={() => handleCheckGrade(grade)}
                                      />
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </div>
                      ) : null;
                    })}
                  </div>
                )}
              </CardContent>

              <CardFooter className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <Button className="w-full sm:w-auto px-6 h-10 font-semibold shadow-xs" variant="outline" onClick={() => setOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit" className="w-full sm:w-auto px-6 h-10 font-semibold shadow-xs">
                  <Settings className="mr-2 h-4 w-4" /> Usiner
                </Button>

              </CardFooter>
            </Card>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
