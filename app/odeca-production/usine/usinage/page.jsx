"use client";

import React, { useState } from "react";
import ProtectedRoute from "@/app/ui/protection/ProtectedRoute";
import { ROLES } from "@/lib/permissions";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Settings, Calendar, Layers, FileText, Check, Coffee, Building2, HelpCircle, Trash2, Plus, X } from "lucide-react";

// Mock data
const SOCIETE_LIST = ["SOGESTAL Kirundo-Muyinga", "SOGESTAL Kayanza", "SOGESTAL Ngozi", "COCOCA", "SOGESTAL Mumirwa"];
const SDL_LIST = ["SDL Ngozi", "SDL Kayanza", "SDL Gitega", "SDL Muramvya", "SDL Karusi"];
const USINAGE_GRADES = ["A1", "A2", "A3", "A4", "B1", "B2", "B3", "COQUE", "CAFE NATUREL", "CAFE Miel", "Anaerobic", "Robusta"];

export default function UsinagePage() {
  const [formData, setFormData] = useState({
    societe: "",
    selectedSDLs: [],
    dateUsinage: new Date().toISOString().split("T")[0],
    dateSortie: new Date().toISOString().split("T")[0],
    observation: "",
    // Array of inputs for usinage quantities
    usinageQuantities: USINAGE_GRADES.reduce((acc, grade) => ({ ...acc, [grade]: "" }), {}),
    // Array of inputs for outputs
    outputFW: { "FW NGOMA MILD-SDL": "", "FW AA": "", "15+": "", "PB": "", "FW TT": "" },
    outputW: { "W ABC": "", "W TT": "", "W STOCK LOT": "" },
    outputNaturel: { "GRADE 1": "", "PB": "", "GRADE 2": "" },
    outputMiel: { "GRADE 1": "", "GRADE 2": "" },
    outputRobusta: { "ROBUSTA NATURAL CLEAN SUPER": "" },
    outputAnaerobic: { "GRADE 1": "", "PB": "", "GRADE 2": "" }
  });

  const [activeUsinageGrades, setActiveUsinageGrades] = useState([]);
  const [activeFW, setActiveFW] = useState([]);
  const [activeW, setActiveW] = useState([]);
  const [activeNaturel, setActiveNaturel] = useState([]);
  const [activeMiel, setActiveMiel] = useState([]);
  const [activeRobusta, setActiveRobusta] = useState([]);
  const [activeAnaerobic, setActiveAnaerobic] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSDLToggle = (sdl) => {
    setFormData((prev) => {
      const isSelected = prev.selectedSDLs.includes(sdl);
      const newSDLs = isSelected 
        ? prev.selectedSDLs.filter((item) => item !== sdl)
        : [...prev.selectedSDLs, sdl];
      return { ...prev, selectedSDLs: newSDLs };
    });
  };

  const handleUsinageQtyChange = (grade, value) => {
    setFormData((prev) => ({
      ...prev,
      usinageQuantities: { ...prev.usinageQuantities, [grade]: value }
    }));
  };

  const handleOutputChange = (category, grade, value) => {
    setFormData((prev) => ({
      ...prev,
      [category]: { ...prev[category], [grade]: value }
    }));
  };

  const handleReset = () => {
    setFormData({
      societe: "",
      selectedSDLs: [],
      dateUsinage: new Date().toISOString().split("T")[0],
      dateSortie: new Date().toISOString().split("T")[0],
      observation: "",
      usinageQuantities: USINAGE_GRADES.reduce((acc, grade) => ({ ...acc, [grade]: "" }), {}),
      outputFW: { "FW NGOMA MILD-SDL": "", "FW AA": "", "15+": "", "PB": "", "FW TT": "" },
      outputW: { "W ABC": "", "W TT": "", "W STOCK LOT": "" },
      outputNaturel: { "GRADE 1": "", "PB": "", "GRADE 2": "" },
      outputMiel: { "GRADE 1": "", "GRADE 2": "" },
      outputRobusta: { "ROBUSTA NATURAL CLEAN SUPER": "" },
      outputAnaerobic: { "GRADE 1": "", "PB": "", "GRADE 2": "" }
    });
    setActiveUsinageGrades([]);
    setActiveFW([]);
    setActiveW([]);
    setActiveNaturel([]);
    setActiveMiel([]);
    setActiveRobusta([]);
    setActiveAnaerobic([]);
    toast.info("Formulaire réinitialisé");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.societe) {
      toast.error("Veuillez sélectionner la société.");
      return;
    }
    if (formData.selectedSDLs.length === 0) {
      toast.error("Veuillez sélectionner au moins une station de lavage (SDL).");
      return;
    }
    console.log("Submit Usinage Data:", formData);
    toast.success("Opération d'usinage et sorties enregistrées !");
  };

  return (
    <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.GENERAL, ROLES.ODECA, ROLES.SUPERVISEUR]}>
      <div className="p-6 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Settings className="h-8 w-8 text-primary animate-spin-slow" /> Usinage & Sorties
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Saisie des quantités de café déparché entrées en usinage et répartition des grades obtenus en sortie.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleReset}>
              Réinitialiser
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Main Info */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 shadow-xs dark:bg-slate-950 border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" /> Informations Générales
                </CardTitle>
                <CardDescription>Sélection de la société de gestion et des stations de lavage concernées.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="societe" className="font-semibold text-slate-700 dark:text-slate-300">
                      Société / Propriétaire
                    </Label>
                    <Select onValueChange={(val) => handleSelectChange("societe", val)} value={formData.societe}>
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
                        name="dateUsinage"
                        value={formData.dateUsinage}
                        onChange={handleChange}
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
                    <Select
                      onValueChange={(val) => {
                        if (val && !formData.selectedSDLs.includes(val)) {
                          setFormData((prev) => ({
                            ...prev,
                            selectedSDLs: [...prev.selectedSDLs, val]
                          }));
                        }
                      }}
                      value=""
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Ajouter une station (SDL)..." />
                      </SelectTrigger>
                      <SelectContent>
                        {SDL_LIST.filter((sdl) => !formData.selectedSDLs.includes(sdl)).map((sdl) => (
                          <SelectItem key={sdl} value={sdl}>
                            {sdl}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {formData.selectedSDLs.length > 0 ? (
                    <div className="flex flex-wrap gap-2 pt-2 animate-in fade-in duration-200">
                      {formData.selectedSDLs.map((sdl) => (
                        <div
                          key={sdl}
                          className="bg-primary/10 border border-primary/20 dark:bg-primary/20 text-slate-800 dark:text-slate-200 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 animate-in zoom-in-95 duration-200"
                        >
                          {sdl}
                          <button
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                selectedSDLs: prev.selectedSDLs.filter((item) => item !== sdl)
                              }));
                            }}
                            className="text-primary hover:text-red-500 dark:hover:text-red-400 focus:outline-hidden transition-colors"
                          >
                            <X className="h-3.5 w-3.5 stroke-[2.5]" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">Aucune station sélectionnée. Veuillez en ajouter au moins une.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Date de sortie and Observation */}
            <Card className="shadow-xs dark:bg-slate-950 border-slate-200 dark:border-slate-800 flex flex-col justify-between">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" /> Sorties & Notes
                </CardTitle>
                <CardDescription>Date de déchargement et remarques.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 flex-1">
                <div className="space-y-2">
                  <Label htmlFor="dateSortie" className="font-semibold text-slate-700 dark:text-slate-300">
                    Date de Sortie d'Usinage
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

                <div className="space-y-2">
                  <Label htmlFor="observation" className="font-semibold text-slate-700 dark:text-slate-300">
                    Observations / Remarques
                  </Label>
                  <textarea
                    id="observation"
                    name="observation"
                    rows={4}
                    value={formData.observation}
                    onChange={handleChange}
                    placeholder="Entrez vos remarques éventuelles ici..."
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quantités Entrées en Usinage */}
          <Card className="shadow-xs dark:bg-slate-950 border-slate-200 dark:border-slate-800">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3">
              <div>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Layers className="h-5 w-5 text-primary" /> Quantités Usinées par Grade
                </CardTitle>
                <CardDescription>Quantité brute entrée dans la machine de déparchage.</CardDescription>
              </div>
              <div className="w-full sm:w-64">
                <Select
                  onValueChange={(val) => {
                    if (val && !activeUsinageGrades.includes(val)) {
                      setActiveUsinageGrades((prev) => [...prev, val]);
                    }
                  }}
                  value=""
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Ajouter un grade..." />
                  </SelectTrigger>
                  <SelectContent>
                    {USINAGE_GRADES.filter((grade) => !activeUsinageGrades.includes(grade)).map((grade) => (
                      <SelectItem key={grade} value={grade}>
                        {grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {activeUsinageGrades.length === 0 ? (
                <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center bg-slate-50/50 dark:bg-slate-900/30">
                  <Plus className="h-8 w-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Aucun grade de café sélectionné. Utilisez le menu déroulant ci-dessus pour ajouter les grades entrés en usinage.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 animate-in fade-in duration-200">
                  {activeUsinageGrades.map((grade) => (
                    <div
                      key={grade}
                      className="bg-slate-50/50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-900 space-y-1.5 relative group animate-in zoom-in-95 duration-200"
                    >
                      <div className="flex justify-between items-center">
                        <Label htmlFor={`usinage-${grade}`} className="text-xs font-bold text-slate-600 dark:text-slate-400">
                          {grade}
                        </Label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 rounded-full text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                          onClick={() => {
                            setActiveUsinageGrades((prev) => prev.filter((g) => g !== grade));
                            setFormData((prev) => ({
                              ...prev,
                              usinageQuantities: { ...prev.usinageQuantities, [grade]: "" }
                            }));
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      <Input
                        type="number"
                        min="0"
                        id={`usinage-${grade}`}
                        value={formData.usinageQuantities[grade]}
                        onChange={(e) => handleUsinageQtyChange(grade, e.target.value)}
                        placeholder="0"
                        className="h-8 text-sm"
                      />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quantités Sorties d'Usinage par catégorie (Fully Washed, Washed, Naturel, Miel, Robusta, Anaerobic) */}
          <Card className="shadow-xs dark:bg-slate-950 border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Coffee className="h-5 w-5 text-primary" /> Détails des Quantités Sorties
              </CardTitle>
              <CardDescription>Répartition finale du café trié et prêt à être ensaché.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Fully Washed */}
              <div className="space-y-3 bg-slate-50/50 dark:bg-slate-900/30 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-primary/10 pb-2">
                  <h3 className="text-sm font-bold text-primary">Fully Washed (FW)</h3>
                  <div className="w-full sm:w-56">
                    <Select
                      onValueChange={(val) => {
                        if (val && !activeFW.includes(val)) {
                          setActiveFW((prev) => [...prev, val]);
                        }
                      }}
                      value=""
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Ajouter grade FW..." />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(formData.outputFW).filter((g) => !activeFW.includes(g)).map((grade) => (
                          <SelectItem key={grade} value={grade}>
                            {grade}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {activeFW.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">Aucun grade Fully Washed ajouté.</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 animate-in fade-in duration-200">
                    {activeFW.map((grade) => (
                      <div key={grade} className="space-y-1 relative group">
                        <div className="flex justify-between items-center">
                          <Label className="text-xs text-slate-500 dark:text-slate-400">{grade}</Label>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveFW((prev) => prev.filter((g) => g !== grade));
                              setFormData((prev) => ({
                                ...prev,
                                outputFW: { ...prev.outputFW, [grade]: "" }
                              }));
                            }}
                            className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                        <Input
                          type="number"
                          min="0"
                          value={formData.outputFW[grade]}
                          onChange={(e) => handleOutputChange("outputFW", grade, e.target.value)}
                          placeholder="0"
                          className="h-9"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Washed */}
              <div className="space-y-3 bg-slate-50/50 dark:bg-slate-900/30 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-primary/10 pb-2">
                  <h3 className="text-sm font-bold text-primary">Washed (W)</h3>
                  <div className="w-full sm:w-56">
                    <Select
                      onValueChange={(val) => {
                        if (val && !activeW.includes(val)) {
                          setActiveW((prev) => [...prev, val]);
                        }
                      }}
                      value=""
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Ajouter grade W..." />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(formData.outputW).filter((g) => !activeW.includes(g)).map((grade) => (
                          <SelectItem key={grade} value={grade}>
                            {grade}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {activeW.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">Aucun grade Washed ajouté.</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 animate-in fade-in duration-200">
                    {activeW.map((grade) => (
                      <div key={grade} className="space-y-1 relative group">
                        <div className="flex justify-between items-center">
                          <Label className="text-xs text-slate-500 dark:text-slate-400">{grade}</Label>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveW((prev) => prev.filter((g) => g !== grade));
                              setFormData((prev) => ({
                                ...prev,
                                outputW: { ...prev.outputW, [grade]: "" }
                              }));
                            }}
                            className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                        <Input
                          type="number"
                          min="0"
                          value={formData.outputW[grade]}
                          onChange={(e) => handleOutputChange("outputW", grade, e.target.value)}
                          placeholder="0"
                          className="h-9"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Naturel & Miel */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Naturel */}
                <div className="space-y-3 bg-slate-50/50 dark:bg-slate-900/30 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between gap-3 border-b border-primary/10 pb-2">
                    <h3 className="text-sm font-bold text-primary">Naturel</h3>
                    <div className="w-40">
                      <Select
                        onValueChange={(val) => {
                          if (val && !activeNaturel.includes(val)) {
                            setActiveNaturel((prev) => [...prev, val]);
                          }
                        }}
                        value=""
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue placeholder="Ajouter grade..." />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(formData.outputNaturel).filter((g) => !activeNaturel.includes(g)).map((grade) => (
                            <SelectItem key={grade} value={grade}>
                              {grade}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {activeNaturel.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">Aucun grade Naturel ajouté.</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-4 animate-in fade-in duration-200">
                      {activeNaturel.map((grade) => (
                        <div key={grade} className="space-y-1 relative group">
                          <div className="flex justify-between items-center">
                            <Label className="text-xs text-slate-500 dark:text-slate-400">{grade}</Label>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveNaturel((prev) => prev.filter((g) => g !== grade));
                                setFormData((prev) => ({
                                  ...prev,
                                  outputNaturel: { ...prev.outputNaturel, [grade]: "" }
                                }));
                              }}
                              className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                          <Input
                            type="number"
                            min="0"
                            value={formData.outputNaturel[grade]}
                            onChange={(e) => handleOutputChange("outputNaturel", grade, e.target.value)}
                            placeholder="0"
                            className="h-9"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Miel */}
                <div className="space-y-3 bg-slate-50/50 dark:bg-slate-900/30 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between gap-3 border-b border-primary/10 pb-2">
                    <h3 className="text-sm font-bold text-primary">Miel</h3>
                    <div className="w-40">
                      <Select
                        onValueChange={(val) => {
                          if (val && !activeMiel.includes(val)) {
                            setActiveMiel((prev) => [...prev, val]);
                          }
                        }}
                        value=""
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue placeholder="Ajouter grade..." />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(formData.outputMiel).filter((g) => !activeMiel.includes(g)).map((grade) => (
                            <SelectItem key={grade} value={grade}>
                              {grade}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {activeMiel.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">Aucun grade Miel ajouté.</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-4 animate-in fade-in duration-200">
                      {activeMiel.map((grade) => (
                        <div key={grade} className="space-y-1 relative group">
                          <div className="flex justify-between items-center">
                            <Label className="text-xs text-slate-500 dark:text-slate-400">{grade}</Label>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveMiel((prev) => prev.filter((g) => g !== grade));
                                setFormData((prev) => ({
                                  ...prev,
                                  outputMiel: { ...prev.outputMiel, [grade]: "" }
                                }));
                              }}
                              className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                          <Input
                            type="number"
                            min="0"
                            value={formData.outputMiel[grade]}
                            onChange={(e) => handleOutputChange("outputMiel", grade, e.target.value)}
                            placeholder="0"
                            className="h-9"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Robusta & Anaerobic */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Robusta */}
                <div className="space-y-3 bg-slate-50/50 dark:bg-slate-900/30 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between gap-3 border-b border-primary/10 pb-2">
                    <h3 className="text-sm font-bold text-primary">Robusta</h3>
                    <div className="w-40">
                      <Select
                        onValueChange={(val) => {
                          if (val && !activeRobusta.includes(val)) {
                            setActiveRobusta((prev) => [...prev, val]);
                          }
                        }}
                        value=""
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue placeholder="Ajouter grade..." />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(formData.outputRobusta).filter((g) => !activeRobusta.includes(g)).map((grade) => (
                            <SelectItem key={grade} value={grade}>
                              {grade}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {activeRobusta.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">Aucun grade Robusta ajouté.</p>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 animate-in fade-in duration-200">
                      {activeRobusta.map((grade) => (
                        <div key={grade} className="space-y-1 relative group">
                          <div className="flex justify-between items-center">
                            <Label className="text-xs text-slate-500 dark:text-slate-400">{grade}</Label>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveRobusta((prev) => prev.filter((g) => g !== grade));
                                setFormData((prev) => ({
                                  ...prev,
                                  outputRobusta: { ...prev.outputRobusta, [grade]: "" }
                                }));
                              }}
                              className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                          <Input
                            type="number"
                            min="0"
                            value={formData.outputRobusta[grade]}
                            onChange={(e) => handleOutputChange("outputRobusta", grade, e.target.value)}
                            placeholder="0"
                            className="h-9"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Anaerobic */}
                <div className="space-y-3 bg-slate-50/50 dark:bg-slate-900/30 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between gap-3 border-b border-primary/10 pb-2">
                    <h3 className="text-sm font-bold text-primary">Anaerobic</h3>
                    <div className="w-40">
                      <Select
                        onValueChange={(val) => {
                          if (val && !activeAnaerobic.includes(val)) {
                            setActiveAnaerobic((prev) => [...prev, val]);
                          }
                        }}
                        value=""
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue placeholder="Ajouter grade..." />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(formData.outputAnaerobic).filter((g) => !activeAnaerobic.includes(g)).map((grade) => (
                            <SelectItem key={grade} value={grade}>
                              {grade}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {activeAnaerobic.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">Aucun grade Anaerobic ajouté.</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-4 animate-in fade-in duration-200">
                      {activeAnaerobic.map((grade) => (
                        <div key={grade} className="space-y-1 relative group">
                          <div className="flex justify-between items-center">
                            <Label className="text-xs text-slate-500 dark:text-slate-400">{grade}</Label>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveAnaerobic((prev) => prev.filter((g) => g !== grade));
                                setFormData((prev) => ({
                                  ...prev,
                                  outputAnaerobic: { ...prev.outputAnaerobic, [grade]: "" }
                                }));
                              }}
                              className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                          <Input
                            type="number"
                            min="0"
                            value={formData.outputAnaerobic[grade]}
                            onChange={(e) => handleOutputChange("outputAnaerobic", grade, e.target.value)}
                            placeholder="0"
                            className="h-9"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </CardContent>
            <CardFooter className="pt-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20 flex justify-end">
              <Button type="submit" className="w-full sm:w-64 h-11 text-base font-semibold shadow-xs">
                Enregistrer l'Usinage
              </Button>
            </CardFooter>
          </Card>

        </form>
      </div>
    </ProtectedRoute>
  );
}
