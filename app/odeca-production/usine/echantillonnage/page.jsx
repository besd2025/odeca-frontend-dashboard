"use client";

import React, { useState } from "react";
import ProtectedRoute from "@/app/ui/protection/ProtectedRoute";
import { ROLES } from "@/lib/permissions";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Beaker, Calendar, User, Building2, ShieldAlert, FileText, BarChart } from "lucide-react";

export default function EchantillonnagePage() {
  const [formData, setFormData] = useState({
    lotNumber: "",
    hundredGPerBag: false,
    sacsCount: "",
    proprieteSociete: "",
    deparcheur: "",
    echantillonneur: "",
    dateEchantillonnage: new Date().toISOString().split("T")[0]
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked) => {
    setFormData((prev) => ({ ...prev, hundredGPerBag: checked }));
  };

  const handleReset = () => {
    setFormData({
      lotNumber: "",
      hundredGPerBag: false,
      sacsCount: "",
      proprieteSociete: "",
      deparcheur: "",
      echantillonneur: "",
      dateEchantillonnage: new Date().toISOString().split("T")[0]
    });
    toast.info("Formulaire réinitialisé");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.lotNumber) {
      toast.error("Veuillez renseigner le numéro de lot.");
      return;
    }
    console.log("Submit Echantillonnage Data:", formData);
    toast.success("Échantillon prélevé et enregistré !");
  };

  return (
    <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.GENERAL, ROLES.ODECA, ROLES.SUPERVISEUR]}>
      <div className="p-6 max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Beaker className="h-8 w-8 text-primary animate-pulse" /> Échantillonnage
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Prélèvement légal et étiquetage des échantillons physiques de café destinés aux analyses de laboratoire.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleReset}>
              Réinitialiser
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Sample details */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-xs dark:bg-slate-950 border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" /> Caractéristiques du Lot
                </CardTitle>
                <CardDescription>Informations et traçabilité de l'échantillon prélevé.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="lotNumber" className="font-semibold text-slate-700 dark:text-slate-300">
                      Numéro de Lot
                    </Label>
                    <Input
                      type="text"
                      id="lotNumber"
                      name="lotNumber"
                      value={formData.lotNumber}
                      onChange={handleChange}
                      placeholder="Ex: LOT-2026-004A"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sacsCount" className="font-semibold text-slate-700 dark:text-slate-300">
                      Nombre de Sacs représentés
                    </Label>
                    <Input
                      type="number"
                      step="1"
                      min="0"
                      id="sacsCount"
                      name="sacsCount"
                      value={formData.sacsCount}
                      onChange={handleChange}
                      placeholder="Ex: 85"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="proprieteSociete" className="font-semibold text-slate-700 dark:text-slate-300">
                      Propriétaire / Société du café
                    </Label>
                    <div className="relative">
                      <Input
                        type="text"
                        id="proprieteSociete"
                        name="proprieteSociete"
                        value={formData.proprieteSociete}
                        onChange={handleChange}
                        placeholder="Ex: COCOCA"
                        className="pl-10"
                        required
                      />
                      <Building2 className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deparcheur" className="font-semibold text-slate-700 dark:text-slate-300">
                      Usine de déparchage / Déparcheur
                    </Label>
                    <div className="relative">
                      <Input
                        type="text"
                        id="deparcheur"
                        name="deparcheur"
                        value={formData.deparcheur}
                        onChange={handleChange}
                        placeholder="Ex: Usine Ngozi SOGESTAL"
                        className="pl-10"
                        required
                      />
                      <BarChart className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    </div>
                  </div>
                </div>

              </CardContent>
            </Card>

            {/* Checkbox settings */}
            <Card className="shadow-xs dark:bg-slate-950 border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-primary" /> Protocole d'Échantillonnage
                </CardTitle>
                <CardDescription>Règles et protocole de dosage du prélèvement.</CardDescription>
              </CardHeader>
              <CardContent>
                <div 
                  onClick={() => handleCheckboxChange(!formData.hundredGPerBag)}
                  className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer select-none transition-all duration-200 ${
                    formData.hundredGPerBag
                      ? "bg-primary/5 border-primary dark:bg-primary/10"
                      : "bg-slate-50/50 border-slate-200 hover:bg-slate-50 dark:bg-slate-900/50 dark:border-slate-800 dark:hover:bg-slate-900"
                  }`}
                >
                  <Checkbox 
                    id="hundredGPerBag" 
                    checked={formData.hundredGPerBag} 
                    onCheckedChange={handleCheckboxChange}
                    className="mt-1"
                  />
                  <div className="space-y-1">
                    <Label htmlFor="hundredGPerBag" className="font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
                      Méthode standard 100g / Sac
                    </Label>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      Cochez cette case pour confirmer que l'échantillon respecte le prélèvement obligatoire de 100 grammes par sac pour l'analyse de qualité ODECA.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actor & Date Card */}
          <div className="space-y-6">
            <Card className="shadow-xs dark:bg-slate-950 border-slate-200 dark:border-slate-800 h-full flex flex-col justify-between">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" /> Acteurs & Date
                </CardTitle>
                <CardDescription>Responsable du prélèvement et timing.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 flex-1">
                <div className="space-y-2">
                  <Label htmlFor="echantillonneur" className="font-semibold text-slate-700 dark:text-slate-300">
                    Nom de l'Échantillonneur
                  </Label>
                  <div className="relative">
                    <Input
                      type="text"
                      id="echantillonneur"
                      name="echantillonneur"
                      value={formData.echantillonneur}
                      onChange={handleChange}
                      placeholder="Nom de l'agent préleveur"
                      className="pl-10"
                      required
                    />
                    <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateEchantillonnage" className="font-semibold text-slate-700 dark:text-slate-300">
                    Date d'Échantillonnage
                  </Label>
                  <div className="relative">
                    <Input
                      type="date"
                      id="dateEchantillonnage"
                      name="dateEchantillonnage"
                      value={formData.dateEchantillonnage}
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
                  Valider l'Échantillonnage
                </Button>
              </CardFooter>
            </Card>
          </div>

        </form>
      </div>
    </ProtectedRoute>
  );
}
