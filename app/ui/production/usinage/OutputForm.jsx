import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, FileText, Coffee, Check, X } from "lucide-react";
import { toast } from "sonner";
import { fetchData } from "@/app/_utils/api";
import { Checkbox } from "@/components/ui/checkbox";

const OUTPUT_CONFIG = {
  outputQ: {
    label: "Qualités",
  },
};

export default function OutputForm({ lot, onSave, onCancel, readOnly = false }) {
  // Metadata states
  const [dateSortie, setDateSortie] = useState("");
  const [observation, setObservation] = useState("");

  // Categories states
  const [outputs, setOutputs] = useState({
    outputQ: {},
  });

  // Active grades per category
  const [activeGrades, setActiveGrades] = useState({
    outputQ: [],
  });

  const [apiGrades, setApiGrades] = useState([]);
  const [fullApiGrades, setFullApiGrades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [checkedGrades, setCheckedGrades] = useState({});
  const [UsinageId, setUsinageId] = useState("");
  const handleCheckedChange = (grade) => {
    setCheckedGrades(prev => ({
      ...prev,
      [grade]: !prev[grade]
    }));
  };
  useEffect(() => {
    const loadData = async () => {
      try {
        const retoursData = await fetchData("get", `cafe/usinages/get_usinage_encours_par_societe/`, {
          params: {
            societe_code: lot?.code_societe
          }
        })
        const data = await fetchData("get", `cafe/qualite_cafe/`);
        const gradesData = data.results || data || [];
        setFullApiGrades(gradesData);
        setUsinageId(retoursData?.usinage_id)
        const newGrades = Array.isArray(gradesData)
          ? gradesData.map(item => typeof item === 'object' ? (item.nom || item.designation || item.name || item.code) : item).filter(Boolean)
          : [];
        if (newGrades.length > 0) {
          setApiGrades(newGrades);
        }
      } catch (error) {
        console.error("Error fetching grades:", error);
      }
    };
    loadData();
    if (lot) {
      setDateSortie(lot.dateSortie || new Date().toISOString().split("T")[0]);
      setObservation(lot.observation || "");

      // Setup initial output structures
      const newOutputs = {
        outputQ: { ...lot.outputQ },
      };

      // Set active grades based on what exists
      const newActive = {};
      Object.keys(OUTPUT_CONFIG).forEach(category => {
        const catOutputs = newOutputs[category] || {};
        newActive[category] = Object.keys(catOutputs).filter(grade => catOutputs[grade] !== undefined && catOutputs[grade] !== "");
      });

      setOutputs(newOutputs);
      setActiveGrades(newActive);
    }
  }, [lot]);

  const handleGradeAdd = (category, grade) => {
    if (grade && !activeGrades[category].includes(grade)) {
      setActiveGrades(prev => ({
        ...prev,
        [category]: [...prev[category], grade]
      }));
      setOutputs(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          [grade]: { kg: "", sacs: "" }
        }
      }));
    }
  };

  const handleGradeRemove = (category, grade) => {
    setActiveGrades(prev => ({
      ...prev,
      [category]: prev[category].filter(g => g !== grade)
    }));
    setOutputs(prev => ({
      ...prev,
      [category]: { ...prev[category], [grade]: undefined }
    }));
  };

  const handleValueChange = (category, grade, field, value) => {
    setOutputs(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [grade]: {
          ...(typeof prev[category][grade] === "object" ? prev[category][grade] : { kg: prev[category][grade] || "", sacs: "" }),
          [field]: value
        }
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!dateSortie || !observation) {
      toast.error("Veuillez renseigner la date de sortie et l'observation.");
      return;
    }

    if (!UsinageId) {
      toast.error("Pas de L'ID d'usinage correspondant.");
      return;
    }
    // Prepare clean output data
    const finalizedData = {
      dateSortie,
      observation,
      status: "Finalisé",
    };

    // Filter outputs to only active ones
    Object.keys(OUTPUT_CONFIG).forEach(category => {
      finalizedData[category] = {};
      (activeGrades[category] || []).forEach(grade => {
        const val = outputs[category][grade];
        if (val !== undefined && val !== null) {
          const gradeObj = fullApiGrades.find(item =>
            item && typeof item === 'object' &&
            (item.nom || item.designation || item.name || item.code) === grade
          );
          const gradeId = gradeObj?.id || grade;

          if (typeof val === "object") {

            const formData = new FormData();
            formData.append("usinage", UsinageId);
            formData.append("observation", observation);
            formData.append("quantite_sortie", val.kg);
            formData.append("nombre_sacs", val.sacs);
            formData.append("qualite", gradeId);
            const isGradeChecked = !!checkedGrades[grade];
            formData.append("pret_pour_triage", isGradeChecked)


            const promise = new Promise(async (resolve, reject) => {
              try {
                const results = await fetchData(
                  "post",
                  `/cafe/production_apres_usinage/`,
                  {
                    params: {},
                    additionalHeaders: {},
                    body: formData,
                  },
                );

                if (results.status == 200 || results.status == 201) {
                  const result2 = await fetchData(
                    "patch",
                    `/cafe/usinages/${lot.id}/`,
                    {
                      params: {},
                      additionalHeaders: {},
                      body: {
                        processing_status: 'TERMINE',
                        date_fin: dateSortie,
                        observation: observation
                      },
                    },
                  );
                  if (result2.status == 200 || result2.status == 201) {
                    resolve({ lot: lot.id });
                  } else {
                    reject(new Error("Erreur"));
                  }
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
                onSave(data.lot, finalizedData);
                setTimeout(() => setOpen(false), 500);
                return `Données Enregistrées avec succès `;
              },
              error: "Donnée non enregistrée!!!",
            });

            try {
              promise;
            } catch (error) {
              console.error(error);
              setError(error);
            } finally {
              setLoading(false);
            }
          }

        }
      });
    });

    onSave(lot.id, finalizedData);

  };

  // Render a read-only list of outputs
  const renderReadOnlyOutputs = () => {
    const hasOutputs = Object.keys(activeGrades).some(category => activeGrades[category].length > 0);

    if (!hasOutputs) {
      return (
        <div className="text-center p-6 border border-dashed rounded-lg border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 text-slate-500 text-sm">
          Aucune quantité de sortie enregistrée pour ce lot.
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Object.entries(OUTPUT_CONFIG).map(([category, config]) => {
          const active = activeGrades[category] || [];
          if (active.length === 0) return null;

          return (
            <div key={category} className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-lg border border-slate-100 dark:border-slate-900 space-y-2">
              <h4 className="text-xs font-bold text-primary uppercase tracking-wider">{config.label}</h4>
              <div className="space-y-1.5">
                {active.map(grade => {
                  const val = outputs[category][grade];
                  const kg = val && typeof val === "object" ? val.kg : (val || 0);
                  const sacs = val && typeof val === "object" ? val.sacs : Math.round((val || 0) / 60);
                  return (
                    <div key={grade} className="flex justify-between items-center text-xs text-slate-700 dark:text-slate-300 border-b border-slate-100/50 dark:border-slate-900/50 pb-1 last:border-0 last:pb-0">
                      <span className="font-medium">{grade}</span>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-slate-900 dark:text-white">{kg} kg</span>
                        <span className="text-slate-500 dark:text-slate-400">({sacs} sacs)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Header Info */}
      <div className="p-3.5 bg-primary/5 border border-primary/10 rounded-lg text-sm text-slate-700 dark:text-slate-300 space-y-1">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-primary">USID: {lot?.id}</span>
          <span className="text-xs bg-primary/10 px-2.5 py-0.5 rounded-full font-semibold">{lot?.societe}</span>
        </div>
        <div className="text-xs text-slate-500">
          Usinage débuté le {lot?.date_usinage}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column: Sorties & Notes */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="shadow-none dark:bg-slate-950 border-slate-200 dark:border-slate-800">
            <CardHeader className="py-4">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <FileText className="h-4.5 w-4.5 text-primary" /> Sorties & Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 py-0 pb-4">
              <div className="space-y-2">
                <Label className="font-semibold text-slate-700 dark:text-slate-300">
                  Date de Sortie d'Usinage
                </Label>
                {readOnly ? (
                  <div className="p-2 border rounded-md bg-slate-50 dark:bg-slate-900/50 text-sm text-slate-800 dark:text-slate-200">
                    {dateSortie}
                  </div>
                ) : (
                  <div className="relative">
                    <Input
                      type="date"
                      value={dateSortie}
                      onChange={(e) => setDateSortie(e.target.value)}
                      className="w-full pl-10"
                      required
                    />
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label className="font-semibold text-slate-700 dark:text-slate-300">
                  Observations / Remarques
                </Label>
                {readOnly ? (
                  <div className="p-2.5 border rounded-md bg-slate-50 dark:bg-slate-900/50 text-sm text-slate-700 dark:text-slate-300 min-h-[100px] whitespace-pre-wrap">
                    {observation || "Aucune observation."}
                  </div>
                ) : (
                  <textarea
                    rows={4}
                    value={observation}
                    onChange={(e) => setObservation(e.target.value)}
                    placeholder="Observations sur la qualité ou le lot..."
                    className="w-full text-sm rounded-lg border border-input bg-background px-3 py-2 placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-transparent"
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Détails des Quantités Sorties */}
        <div className="lg:col-span-2">
          <Card className="shadow-none dark:bg-slate-950 border-slate-200 dark:border-slate-800 h-full flex flex-col justify-between">
            <CardHeader className="py-4">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Coffee className="h-4.5 w-4.5 text-primary" /> Détails des Quantités Sorties (Café Vert)
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 py-0 pb-4">
              {readOnly ? (
                renderReadOnlyOutputs()
              ) : (
                <div className="space-y-4 overflow-y-auto pr-1">
                  {Object.entries(OUTPUT_CONFIG).map(([category, config]) => {
                    const active = activeGrades[category] || [];
                    const availableGrades = apiGrades.filter(g => !active.includes(g));
                    console.log("availableGrades", activeGrades);
                    return (
                      <div key={category} className="p-3 bg-slate-50/50 dark:bg-slate-900/20 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2.5">
                        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-900 pb-1.5">
                          <h4 className="text-sm font-bold text-primary">{config.label}</h4>
                          {availableGrades.length > 0 && (
                            <div className="w-40">
                              <Select onValueChange={(val) => handleGradeAdd(category, val)} value="">
                                <SelectTrigger className="h-7 text-xs">
                                  <SelectValue placeholder="Ajouter grade..." />
                                </SelectTrigger>
                                <SelectContent>
                                  {availableGrades.map(g => (
                                    <SelectItem key={g} value={g} className="text-xs">
                                      {g}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        </div>

                        {active.length === 0 ? (
                          <p className="text-xs text-slate-400">Aucun grade sélectionné.</p>
                        ) : (
                          <div className="grid grid-cols-2 gap-4">
                            {active.map(grade => {
                              const val = outputs[category][grade] || {};
                              const kgVal = typeof val === "object" ? val.kg : val;
                              const sacsVal = typeof val === "object" ? val.sacs : "";
                              return (
                                <div key={grade} className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2 bg-background/50 relative">
                                  <div className="flex justify-between items-center text-xs">
                                    <span className="font-bold text-slate-700 dark:text-slate-300">{grade}</span>
                                    <button
                                      type="button"
                                      onClick={() => handleGradeRemove(category, grade)}
                                      className="text-slate-400 hover:text-red-500 transition-colors"
                                    >
                                      <X className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                  <div className="space-y-1.5">
                                    <div>
                                      <Label className="text-sm text-slate-600 font-medium">Poids (kg)</Label>
                                      <Input
                                        type="number"
                                        min="0"
                                        step="any"
                                        value={kgVal}
                                        onChange={(e) => handleValueChange(category, grade, "kg", e.target.value)}
                                        placeholder="Ex: 4800"
                                        className="h-8 text-xs"
                                        required
                                      />
                                    </div>
                                    <div>
                                      <Label className="text-sm text-slate-600 font-medium">Nombre de sacs</Label>
                                      <Input
                                        type="number"
                                        step="1"
                                        min="0"
                                        value={sacsVal}
                                        onChange={(e) => handleValueChange(category, grade, "sacs", e.target.value)}
                                        placeholder="Ex: 80"
                                        className="h-8 text-xs"
                                        required
                                      />
                                    </div>
                                    <div className="flex items-center gap-3 mt-4">
                                      <Label className="text-sm text-slate-600 font-medium">Triage necessaire?</Label>
                                      <Checkbox
                                        checked={!!checkedGrades[grade]}
                                        onCheckedChange={() => handleCheckedChange(grade)}
                                      />
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
            {!readOnly ? (
              <CardFooter className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <Button type="button" variant="outline" size="sm" onClick={onCancel} className="h-9">
                  Annuler
                </Button>
                <Button type="submit" size="sm" className="h-9 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
                  <Check className="mr-1.5 h-4 w-4" /> Enregistrer & Finaliser
                </Button>
              </CardFooter>
            ) : (
              <CardFooter className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <Button type="button" size="sm" onClick={onCancel} className="h-9">
                  Fermer
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </form>
  );
}
