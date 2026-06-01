"use client";

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Info, Play, X } from "lucide-react";
import { toast } from "sonner";

export default function StartTriageForm({ lot, onConfirm, onCancel }) {
  const [dateEntree, setDateEntree] = useState(
    new Date().toISOString().split("T")[0]
  );

  // By default, select all grades for sorting
  const initialGrades = lot?.grades ? Object.keys(lot.grades) : [];
  const [selectedGrades, setSelectedGrades] = useState(initialGrades);

  const handleToggleGrade = (grade) => {
    setSelectedGrades((prev) =>
      prev.includes(grade)
        ? prev.filter((g) => g !== grade)
        : [...prev, grade]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!dateEntree) {
      toast.error("Veuillez renseigner la date d'entrée.");
      return;
    }
    if (selectedGrades.length === 0) {
      toast.error("Veuillez sélectionner au moins un grade à trier. Si aucun grade ne doit être trié, utilisez l'option 'Étiqueter / Stocker' directement.");
      return;
    }

    const gradesATrier = selectedGrades;
    const gradesStockesDirect = initialGrades.filter(
      (g) => !selectedGrades.includes(g)
    );

    onConfirm(lot, gradesATrier, gradesStockesDirect, dateEntree);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Date d'entrée */}
      <div className="space-y-2">
        <Label htmlFor="dateEntree" className="font-semibold text-slate-700 dark:text-slate-300 text-sm">
          Date d'Entrée au Processus
        </Label>
        <div className="relative">
          <Input
            id="dateEntree"
            type="date"
            value={dateEntree}
            onChange={(e) => setDateEntree(e.target.value)}
            className="w-full pl-10"
            required
          />
          <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
        </div>
      </div>

      {/* Sélection des grades */}
      <div className="space-y-3">
        <Label className="font-semibold text-slate-700 dark:text-slate-300 text-sm">
          Grades à trier
        </Label>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Cochez les grades qui doivent passer par l'étape de triage. Les grades non cochés seront stockés directement avec leur quantité d'origine.
        </p>

        <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
          {initialGrades.map((grade) => {
            const isChecked = selectedGrades.includes(grade);
            const quantity = lot.grades[grade];

            return (
              <div
                key={grade}
                className="flex items-center justify-between p-3.5 hover:bg-slate-100/50 dark:hover:bg-slate-900/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    id={`grade-check-${grade}`}
                    checked={isChecked}
                    onCheckedChange={() => handleToggleGrade(grade)}
                  />
                  <Label
                    htmlFor={`grade-check-${grade}`}
                    className="text-sm font-semibold text-slate-800 dark:text-slate-200 cursor-pointer select-none"
                  >
                    {grade}
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    {quantity} sacs
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${isChecked
                        ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800"
                        : "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800"
                      }`}
                  >
                    {isChecked ? "Sera trié" : "Stocké direct"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Info Warning */}
      <div className="flex items-start gap-2 p-3 bg-slate-50 dark:bg-slate-900/40 rounded-lg border border-slate-100 dark:border-slate-800">
        <Info className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
        <span className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Pour les grades stockés directement, leurs quantités d'origine seront figées dans le lot final sans passer par le processus de perte de triage.
        </span>
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <Button type="button" variant="outline" size="sm" onClick={onCancel} className="h-9">
          <X className="mr-1.5 h-4 w-4" /> Annuler
        </Button>
        <Button
          type="submit"
          size="sm"
          disabled={selectedGrades.length === 0}
          className="h-9 bg-primary hover:bg-primary/90 text-white font-semibold"
        >
          <Play className="mr-1.5 h-4 w-4 text-white" /> Démarrer le triage
        </Button>
      </div>
    </form>
  );
}
