"use client";

import React, { useState } from "react";
import ProtectedRoute from "@/app/ui/protection/ProtectedRoute";
import { ROLES } from "@/lib/permissions";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Search, Calendar, Layers, ClipboardList, Info, Trash2, Plus } from "lucide-react";

const TRIAGE_GRADES = ["A1", "A2", "A3", "A4", "B1", "B2", "B3", "COQUE", "CAFE NATUREL", "CAFE Miel"];

// Mock outputs from previous Usinage runs
const MOCK_USINAGE_OUTPUTS = [
  { id: "lot-001", grade: "A1", type: "Fully Washed", qtyUsinage: 1200 },
  { id: "lot-002", grade: "A2", type: "Fully Washed", qtyUsinage: 950 },
  { id: "lot-003", grade: "B1", type: "Washed", qtyUsinage: 600 },
  { id: "lot-004", grade: "CAFE NATUREL", type: "Naturel", qtyUsinage: 450 },
  { id: "lot-005", grade: "CAFE Miel", type: "Miel", qtyUsinage: 300 }
];

export default function TriagePage() {
  const [formData, setFormData] = useState({
    dateEntree: new Date().toISOString().split("T")[0],
    dateSortie: new Date().toISOString().split("T")[0],
    taxationQuantities: TRIAGE_GRADES.reduce((acc, grade) => ({ ...acc, [grade]: "" }), {})
  });

  const [activeTriageGrades, setActiveTriageGrades] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTaxQtyChange = (grade, value) => {
    setFormData((prev) => ({
      ...prev,
      taxationQuantities: { ...prev.taxationQuantities, [grade]: value }
    }));
  };

  const handleReset = () => {
    setFormData({
      dateEntree: new Date().toISOString().split("T")[0],
      dateSortie: new Date().toISOString().split("T")[0],
      taxationQuantities: TRIAGE_GRADES.reduce((acc, grade) => ({ ...acc, [grade]: "" }), {})
    });
    setActiveTriageGrades([]);
    toast.info("Formulaire réinitialisé");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submit Triage Data:", formData);
    toast.success("Processus de triage enregistré avec succès !");
  };

  return (
    <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.GENERAL, ROLES.ODECA, ROLES.SUPERVISEUR]}>
      <div className="p-6 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Search className="h-8 w-8 text-primary" /> Processus de Triage
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Suivi et validation des quantités de café prêtes à être taxées après le tri mécanique et manuel.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleReset}>
              Réinitialiser
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Read-Only Usinage Outputs Table */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-xs dark:bg-slate-950 border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-primary" /> Quantités Sorties pendant l'Usinage
                </CardTitle>
                <CardDescription>Données en lecture seule issues des derniers rapports d'usinage.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border border-slate-100 dark:border-slate-800 rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                      <TableRow>
                        <TableHead>Numéro de lot</TableHead>
                        <TableHead>Grade</TableHead>
                        <TableHead>Type de café</TableHead>
                        <TableHead className="text-right">Poids Usiné (kg)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {MOCK_USINAGE_OUTPUTS.map((lot) => (
                        <TableRow key={lot.id}>
                          <TableCell className="font-semibold text-slate-700 dark:text-slate-300">{lot.id}</TableCell>
                          <TableCell>{lot.grade}</TableCell>
                          <TableCell>{lot.type}</TableCell>
                          <TableCell className="text-right font-medium text-slate-950 dark:text-slate-50">
                            {lot.qtyUsinage.toLocaleString("fr-FR")}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex items-start gap-2 mt-4 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-800">
                  <Info className="h-4 w-4 text-slate-400 mt-0.5" />
                  <span className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Ces quantités servent de référence pour le rapprochement. La somme des quantités prêtes à taxer après triage doit être cohérente avec ces volumes de base (après déduction des pertes de triage).
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Ready to Tax Quantities */}
            <Card className="shadow-xs dark:bg-slate-950 border-slate-200 dark:border-slate-800">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3">
                <div>
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Layers className="h-5 w-5 text-primary" /> Quantités Prêtes à Taxer par Grade
                  </CardTitle>
                  <CardDescription>Renseignez les volumes triés finaux prêts pour la taxation de l'ODECA.</CardDescription>
                </div>
                <div className="w-full sm:w-64">
                  <Select
                    onValueChange={(val) => {
                      if (val && !activeTriageGrades.includes(val)) {
                        setActiveTriageGrades((prev) => [...prev, val]);
                      }
                    }}
                    value=""
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Ajouter un grade..." />
                    </SelectTrigger>
                    <SelectContent>
                      {TRIAGE_GRADES.filter((grade) => !activeTriageGrades.includes(grade)).map((grade) => (
                        <SelectItem key={grade} value={grade}>
                          {grade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                {activeTriageGrades.length === 0 ? (
                  <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center bg-slate-50/50 dark:bg-slate-900/30">
                    <Plus className="h-8 w-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      Aucun grade de café sélectionné. Utilisez le menu déroulant ci-dessus pour ajouter des grades prêts à taxer.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 animate-in fade-in duration-200">
                    {activeTriageGrades.map((grade) => (
                      <div
                        key={grade}
                        className="bg-slate-50/50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-900 space-y-1.5 relative group animate-in zoom-in-95 duration-200"
                      >
                        <div className="flex justify-between items-center">
                          <Label htmlFor={`tax-${grade}`} className="text-xs font-bold text-slate-600 dark:text-slate-400">
                            {grade}
                          </Label>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 rounded-full text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                            onClick={() => {
                              setActiveTriageGrades((prev) => prev.filter((g) => g !== grade));
                              setFormData((prev) => ({
                                ...prev,
                                taxationQuantities: { ...prev.taxationQuantities, [grade]: "" }
                              }));
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <Input
                          type="number"
                          min="0"
                          id={`tax-${grade}`}
                          value={formData.taxationQuantities[grade]}
                          onChange={(e) => handleTaxQtyChange(grade, e.target.value)}
                          placeholder="0"
                          className="h-8 text-sm"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Dates & Actions Card */}
          <div className="space-y-6">
            <Card className="shadow-xs dark:bg-slate-950 border-slate-200 dark:border-slate-800 h-full flex flex-col justify-between">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" /> Chronologie
                </CardTitle>
                <CardDescription>Dates de début et de fin du cycle de triage.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 flex-1">
                <div className="space-y-2">
                  <Label htmlFor="dateEntree" className="font-semibold text-slate-700 dark:text-slate-300">
                    Date d'Entrée au Processus
                  </Label>
                  <div className="relative">
                    <Input
                      type="date"
                      id="dateEntree"
                      name="dateEntree"
                      value={formData.dateEntree}
                      onChange={handleChange}
                      className="w-full pl-10"
                      required
                    />
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateSortie" className="font-semibold text-slate-700 dark:text-slate-300">
                    Date de Sortie du Processus
                  </Label>
                  <div className="relative">
                    <Input
                      type="date"
                      id="dateSortie"
                      name="dateSortie"
                      value={formData.dateSortie}
                      onChange={handleChange}
                      className="w-full pl-10"
                      required
                    />
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20">
                <Button type="submit" className="w-full h-11 text-base font-semibold shadow-xs">
                  Valider le Triage
                </Button>
              </CardFooter>
            </Card>
          </div>

        </form>
      </div>
    </ProtectedRoute>
  );
}
