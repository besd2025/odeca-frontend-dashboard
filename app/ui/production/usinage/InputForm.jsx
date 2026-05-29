import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Layers, Building2, Trash2, Plus, X } from "lucide-react";
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

const SOCIETE_LIST = ["SOGESTAL Kirundo-Muyinga", "SOGESTAL Kayanza", "SOGESTAL Ngozi", "COCOCA", "SOGESTAL Mumirwa"];
const SDL_LIST = ["SDL Ngozi", "SDL Kayanza", "SDL Gitega", "SDL Muramvya", "SDL Karusi"];
const USINAGE_GRADES = ["A1", "A2", "A3", "A4", "B1", "B2", "B3", "COQUE", "CAFE NATUREL", "CAFE Miel", "Anaerobic", "Robusta"];

const SDL_GRADES_MAP = {
  "SDL Ngozi": ["A1", "A2", "COQUE"],
  "SDL Kayanza": ["A1", "A3", "CAFE NATUREL"],
  "SDL Gitega": ["B1", "B2", "B3"],
  "SDL Muramvya": ["B2", "B3", "COQUE"],
  "SDL Karusi": ["A2", "B2", "CAFE Miel"],
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
        grades.forEach((grade) => {
          gradesSet.add(grade);
          if (!tempGradeSDLs[grade] || !selectedSDLs.includes(tempGradeSDLs[grade]) || !(SDL_GRADES_MAP[tempGradeSDLs[grade]] || []).includes(grade)) {
            tempGradeSDLs[grade] = sdl;
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

  const handleReceptionSelect = (val) => {
    setSelectedReceptionId(val);
    if (val && val !== "none") {
      const found = confirmedReceptions.find(r => r.id === val);
      if (found) {
        setSociete(found.societe);
        setSelectedSDLs(found.sdls);
      }
    } else {
      setSociete("");
      setSelectedSDLs([]);
    }
  };

  const handleSDLSelect = (val) => {
    if (val && !selectedSDLs.includes(val)) {
      setSelectedSDLs(prev => [...prev, val]);
    }
  };

  const handleSDLRemove = (sdl) => {
    setSelectedSDLs(prev => prev.filter(item => item !== sdl));
  };

  const handleGradeAdd = (val) => {
    if (val && !activeGrades.includes(val)) {
      setActiveGrades(prev => [...prev, val]);
    }
  };

  const handleGradeRemove = (grade) => {
    setActiveGrades(prev => prev.filter(g => g !== grade));
    setQuantities(prev => ({ ...prev, [grade]: "" }));
    setGradeSacs(prev => ({ ...prev, [grade]: "" }));
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
        <Button variant="default" className="rounded-full shadow-md font-semibold">
          <Plus className="mr-2 h-4 w-4" /> Nouveau
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl md:max-w-2xl lg:max-w-[90vw] bg-sidebar border border-slate-200 dark:border-slate-800 shadow-xl overflow-y-auto max-h-[90vh]">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Informations Générales Card */}
            <Card className="shadow-none dark:bg-slate-950 border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" /> Informations Générales (Entrée)
                </CardTitle>
                <CardDescription>Sélection de la société de gestion et des stations de lavage concernées.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">

                {/* Réception selection */}
                <div className="space-y-2">
                  <Label htmlFor="receptionId" className="font-semibold text-slate-700 dark:text-slate-300">
                    Réception Confirmée
                  </Label>
                  <Select onValueChange={handleReceptionSelect} value={selectedReceptionId || "none"}>
                    <SelectTrigger id="receptionId" className="w-full">
                      <SelectValue placeholder="Saisie manuelle (Aucune)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Saisie manuelle (Aucune)</SelectItem>
                      {confirmedReceptions.map((r) => (
                        <SelectItem key={r.id} value={r.id}>
                          {r.id} — {r.societe} ({r.sdls.join(", ")})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

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
                {(!selectedReceptionId || selectedReceptionId === "none") && (
                  <div className="w-full sm:w-48">
                    <Select onValueChange={handleGradeAdd} value="">
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Ajouter un grade..." />
                      </SelectTrigger>
                      <SelectContent>
                        {USINAGE_GRADES.filter((grade) => !activeGrades.includes(grade)).map((grade) => (
                          <SelectItem key={grade} value={grade}>
                            {grade}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardHeader>
              <CardContent className="flex-1">
                {activeGrades.length === 0 ? (
                  <div className="h-full min-h-[140px] flex flex-col items-center justify-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-6 text-center bg-slate-50/50 dark:bg-slate-900/30">
                    <Plus className="h-8 w-8 text-slate-300 dark:text-slate-700 mb-2" />
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      Aucune station de lavage sélectionnée pour charger automatiquement les grades de café.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 max-h-max overflow-y-auto pr-1">
                    {activeGrades.map((grade) => (
                      <div
                        key={grade}
                        className="bg-slate-50/50 dark:bg-slate-900/50 p-2.5 rounded-lg border border-slate-100 dark:border-slate-900 space-y-1.5 relative"
                      >
                        <div className="flex justify-between items-center">
                          <Label htmlFor={`input-${grade}`} className="text-xs font-bold text-slate-600 dark:text-slate-400">
                            {grade}
                          </Label>
                          {(!selectedReceptionId || selectedReceptionId === "none") && (
                            <button
                              type="button"
                              onClick={() => handleGradeRemove(grade)}
                              className="text-slate-400 hover:text-red-500 dark:hover:text-red-400"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                        <Input
                          type="number"
                          min="0"
                          step="any"
                          id={`input-${grade}`}
                          value={quantities[grade]}
                          onChange={(e) => handleQtyChange(grade, e.target.value)}
                          placeholder="Qté en Kg"
                          className="h-8 text-xs"
                          required
                        />
                        <div className="space-y-2">
                          <Input
                            type="number"
                            step="1"
                            min="0"
                            id={`sacsCount-${grade}`}
                            name="sacsCount"
                            placeholder="Nombre de Sacs Ex: 320"
                            value={gradeSacs[grade] || ""}
                            onChange={(e) => handleSacsChange(grade, e.target.value)}
                            required
                          />
                          <p className="text-xs font-semibold text-primary mt-1">Origine : {gradeSDLs[grade] || ""}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <Button type="submit" className="w-full sm:w-auto px-6 h-10 font-semibold shadow-xs">
                  <Plus className="mr-2 h-4 w-4" /> Enregistrer en Entrée
                </Button>
              </CardFooter>
            </Card>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
