import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Layers, Check, X, Info } from "lucide-react";
import { toast } from "sonner";

const TRIAGE_GRADES = [
  "FW NGOMA MILD-SDL",
  "FW AA",
  "15+",
  "PB",
  "FW TT",
  "W ABC",
  "W TT",
  "W STOCK LOT",
  "GRADE 1",
  "GRADE 2",
  "ROBUSTA NATURAL CLEAN SUPER",
  "COQUE"
];

export default function TriageDialog({ lot, onSave, onCancel, readOnly = false }) {
  const [dateEntree, setDateEntree] = useState("");
  const [dateSortie, setDateSortie] = useState("");
  const [activeGrades, setActiveGrades] = useState([]);
  const [quantities, setQuantities] = useState(
    TRIAGE_GRADES.reduce((acc, g) => ({ ...acc, [g]: "" }), {})
  );

  useEffect(() => {
    if (lot) {
      setDateEntree(lot.dateEntree || new Date().toISOString().split("T")[0]);
      setDateSortie(lot.dateSortie || new Date().toISOString().split("T")[0]);

      if (!readOnly) {
        if (lot.gradesATrier && lot.gradesATrier.length > 0) {
          // Pre-populate with grades designated to be sorted
          setActiveGrades(lot.gradesATrier);
        } else if (lot.taxationQuantities) {
          const active = Object.keys(lot.taxationQuantities).filter(
            (g) => lot.taxationQuantities[g] !== "" && lot.taxationQuantities[g] !== undefined
          );
          // Filter out grades that were stored directly in edit mode to prevent modification
          const filteredActive = lot.gradesStockesDirect
            ? active.filter((g) => !lot.gradesStockesDirect.includes(g))
            : active;
          setActiveGrades(filteredActive);
        } else if (lot.grades) {
          setActiveGrades(Object.keys(lot.grades));
        }
      } else {
        // In read-only mode, display all grades present in taxationQuantities
        if (lot.taxationQuantities) {
          const active = Object.keys(lot.taxationQuantities).filter(
            (g) => lot.taxationQuantities[g] !== "" && lot.taxationQuantities[g] !== undefined
          );
          setActiveGrades(active);
        }
      }

      if (lot.taxationQuantities) {
        setQuantities((prev) => ({ ...prev, ...lot.taxationQuantities }));
      }
    }
  }, [lot, readOnly]);

  const handleGradeAdd = (val) => {
    if (val && !activeGrades.includes(val)) {
      setActiveGrades((prev) => [...prev, val]);
    }
  };

  const handleGradeRemove = (grade) => {
    setActiveGrades((prev) => prev.filter((g) => g !== grade));
    setQuantities((prev) => ({ ...prev, [grade]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!dateEntree || !dateSortie) {
      toast.error("Veuillez renseigner les dates d'entrée et de sortie du triage.");
      return;
    }
    if (activeGrades.length === 0 && (!lot?.gradesStockesDirect || lot.gradesStockesDirect.length === 0)) {
      toast.error("Veuillez ajouter au moins un grade trié prêt à taxer.");
      return;
    }

    const finalTaxation = { ...lot.taxationQuantities };
    activeGrades.forEach((g) => {
      finalTaxation[g] = parseFloat(quantities[g]) || 0;
    });

    const finalizedData = {
      dateEntree,
      dateSortie,
      status: "Trié & Stocké",
      taxationQuantities: finalTaxation,
    };
    onSave(lot.id, finalizedData);
  };

  const availableGrades = TRIAGE_GRADES.filter(
    (g) => !activeGrades.includes(g) && !lot?.gradesStockesDirect?.includes(g)
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Lot Summary Banner */}
      <div className="p-3.5 bg-primary/5 border border-primary/10 rounded-lg text-sm space-y-1">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-primary">Lot ID : {lot?.id}</span>
          <span className="text-xs bg-primary/10 px-2.5 py-0.5 rounded-full font-semibold">
            {lot?.societe}
          </span>
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          Grades en entrée :{" "}
          {lot?.grades ? Object.entries(lot.grades).map(([g, q]) => `${g}: ${q} sacs`).join(" • ") : "—"}
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          SDLs : {lot?.sdls?.join(", ")}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Left: Chronologie */}
        <div className="lg:col-span-2">
          <Card className="shadow-none dark:bg-slate-950 border-slate-200 dark:border-slate-800 h-full flex flex-col justify-between">
            <CardHeader className="py-4">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" /> Chronologie
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 py-0 pb-4 flex-1">
              {/* Date Entrée */}
              <div className="space-y-2">
                <Label className="font-semibold text-slate-700 dark:text-slate-300 text-sm">
                  Date d'Entrée au Processus
                </Label>
                {readOnly ? (
                  <div className="p-2 border rounded-md bg-slate-50 dark:bg-slate-900/50 text-sm text-slate-800 dark:text-slate-200">
                    {dateEntree || "—"}
                  </div>
                ) : (
                  <div className="relative">
                    <Input
                      type="date"
                      value={dateEntree}
                      onChange={(e) => setDateEntree(e.target.value)}
                      className="w-full pl-10"
                      required
                    />
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  </div>
                )}
              </div>

              {/* Date Sortie */}
              <div className="space-y-2">
                <Label className="font-semibold text-slate-700 dark:text-slate-300 text-sm">
                  Date de Sortie du Processus
                </Label>
                {readOnly ? (
                  <div className="p-2 border rounded-md bg-slate-50 dark:bg-slate-900/50 text-sm text-slate-800 dark:text-slate-200">
                    {dateSortie || "—"}
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

              {/* Info box */}
              <div className="flex items-start gap-2 p-3 bg-slate-50 dark:bg-slate-900/40 rounded-lg border border-slate-100 dark:border-slate-800 mt-auto">
                <Info className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                <span className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  La somme des quantités triées doit être cohérente avec le nombre de sacs en entrée (déduction des pertes de triage).
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Quantités Prêtes à Taxer */}
        <div className="lg:col-span-3">
          <Card className="shadow-none dark:bg-slate-950 border-slate-200 dark:border-slate-800 h-full flex flex-col justify-between">
            <CardHeader className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary" /> Quantités Triées
              </CardTitle>
              {!readOnly && availableGrades.length > 0 && (
                <div className="w-full sm:w-48 shrink-0">
                  <Select onValueChange={handleGradeAdd} value="">
                    <SelectTrigger className="h-8 text-xs w-full">
                      <SelectValue placeholder="Ajouter un grade..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableGrades.map((g) => (
                        <SelectItem key={g} value={g} className="text-xs">
                          {g}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardHeader>
            <CardContent className="flex-1 py-0 pb-4">
              {activeGrades.length === 0 && (!lot?.gradesStockesDirect || lot.gradesStockesDirect.length === 0) ? (
                <div className="h-full min-h-[100px] flex flex-col items-center justify-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-6 text-center bg-slate-50/50 dark:bg-slate-900/30">
                  <Layers className="h-7 w-7 text-slate-300 dark:text-slate-700 mb-2" />
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    {readOnly
                      ? "Aucune quantité taxable enregistrée pour ce lot."
                      : "Ajoutez les grades de café vert prêts à taxer via le sélecteur ci-dessus."}
                  </p>
                </div>
              ) : readOnly ? (
                /* Read-only display */
                <div className="space-y-4 w-full">
                  {/* Sorted grades */}
                  {activeGrades.filter((g) => !lot?.gradesStockesDirect?.includes(g)).length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                        Grades Triés & Taxés
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {activeGrades
                          .filter((g) => !lot?.gradesStockesDirect?.includes(g))
                          .map((grade) => (
                            <div
                              key={grade}
                              className="p-3 bg-blue-50/30 dark:bg-blue-950/10 rounded-lg border border-blue-100/30 dark:border-blue-900/20 flex flex-col gap-1"
                            >
                              <span className="text-xs font-bold text-blue-700 dark:text-blue-400">
                                {grade}
                              </span>
                              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                                {quantities[grade] ?? 0} sacs
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Directly stored grades */}
                  {lot?.gradesStockesDirect && lot.gradesStockesDirect.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Grades Stockés Directement
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {lot.gradesStockesDirect.map((grade) => (
                          <div
                            key={grade}
                            className="p-3 bg-emerald-50/30 dark:bg-emerald-950/10 rounded-lg border border-emerald-100/30 dark:border-emerald-900/20 flex flex-col gap-1"
                          >
                            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                              {grade}
                            </span>
                            <span className="text-sm font-semibold text-slate-900 dark:text-white">
                              {quantities[grade] ?? 0} sacs
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Fallback for legacy lots */}
                  {!lot?.gradesStockesDirect && activeGrades.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {activeGrades.map((grade) => (
                        <div
                          key={grade}
                          className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-lg border border-slate-100 dark:border-slate-900 flex flex-col gap-1"
                        >
                          <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                            {grade}
                          </span>
                          <span className="text-sm font-semibold text-slate-900 dark:text-white">
                            {quantities[grade] ?? "—"} sacs
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* Editable layout */
                <div className="space-y-4 w-full">
                  {/* Directly stored grades (Read-only section) */}
                  {lot?.gradesStockesDirect && lot.gradesStockesDirect.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Grades stockés directement (Lecture seule)
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {lot.gradesStockesDirect.map((grade) => (
                          <div
                            key={grade}
                            className="bg-emerald-50/20 dark:bg-emerald-950/10 p-2.5 rounded-lg border border-emerald-100/20 dark:border-emerald-900/20 flex justify-between items-center"
                          >
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400">{grade}</span>
                              <span className="text-xs text-slate-600 dark:text-slate-300 font-semibold">{quantities[grade] || 0} sacs</span>
                            </div>
                            <span className="text-[9px] bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.5 rounded font-semibold border border-emerald-200/50 dark:border-emerald-800/40">
                              Direct
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sorted grades editable inputs */}
                  <div className="space-y-2">
                    {lot?.gradesStockesDirect && lot.gradesStockesDirect.length > 0 && (
                      <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                        Grades triés (Ajustement quantité finale)
                      </h4>
                    )}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[260px] overflow-y-auto pr-1">
                      {activeGrades.map((grade) => (
                        <div
                          key={grade}
                          className="bg-slate-50/50 dark:bg-slate-900/50 p-2.5 rounded-lg border border-slate-100 dark:border-slate-900 space-y-1.5"
                        >
                          <div className="flex justify-between items-center">
                            <Label htmlFor={`triage-${grade}`} className="text-xs font-bold text-slate-600 dark:text-slate-400">
                              {grade}
                            </Label>
                            {/* Allow removal only if not part of the initially designated grades to sort */}
                            {(!lot?.gradesATrier || !lot.gradesATrier.includes(grade)) && (
                              <button
                                type="button"
                                onClick={() => handleGradeRemove(grade)}
                                className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                          <Input
                            type="number"
                            min="0"
                            step="1"
                            id={`triage-${grade}`}
                            value={quantities[grade]}
                            onChange={(e) =>
                              setQuantities((prev) => ({ ...prev, [grade]: e.target.value }))
                            }
                            placeholder="Nbr de sacs"
                            className="h-8 text-xs bg-transparent"
                            required
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            {/* Footer actions */}
            {!readOnly ? (
              <CardFooter className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <Button type="button" variant="outline" size="sm" onClick={onCancel} className="h-9">
                  Annuler
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="h-9 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                >
                  <Check className="mr-1.5 h-4 w-4" /> Valider & Étiqueter
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
