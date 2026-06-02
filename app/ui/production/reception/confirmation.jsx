"use client";

import React, { useState, useEffect } from "react";
import ProtectedRoute from "@/app/ui/protection/ProtectedRoute";
import { ROLES } from "@/lib/permissions";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Inbox, Scale, Calendar, Percent, Layers, Archive, RefreshCw, Trash2, Plus, X, Building2 } from "lucide-react";
import { fetchData } from "@/app/_utils/api";
const GRADES = [
  "A1", "A2", "A3", "A4",
  "B1", "B2", "B3", "COQUE",
  "CAFE NATUREL", "CAFE Miel", "Anaerobic", "Robusta"
];

const SOCIETE_LIST = [
  "KIREMA",
  "KIRYAMA",
  "COCOCA",
  "SOGESTAL Kirundo-Muyinga",
  "SOGESTAL Kayanza",
  "SOGESTAL Ngozi",
  "SOGESTAL Mumirwa"
];

const SOCIETE_SDL_MAP = {
  "KIREMA": ["SDL Ngozi", "SDL Kayanza"],
  "KIRYAMA": ["SDL Gitega", "SDL Muramvya"],
  "COCOCA": ["SDL Karusi", "SDL Ngozi"],
  "SOGESTAL Kirundo-Muyinga": ["SDL Ngozi", "SDL Karusi"],
  "SOGESTAL Kayanza": ["SDL Kayanza"],
  "SOGESTAL Ngozi": ["SDL Ngozi"],
  "SOGESTAL Mumirwa": ["SDL Muramvya", "SDL Gitega"],
};

const SDL_GRADES_MAP = {
  "SDL Ngozi": ["A1", "A2", "COQUE"],
  "SDL Kayanza": ["A1", "A3", "CAFE NATUREL"],
  "SDL Gitega": ["B1", "B2", "B3"],
  "SDL Muramvya": ["B2", "B3", "COQUE"],
  "SDL Karusi": ["A2", "B2", "CAFE Miel"],
};

export default function ConfirmationPage() {
  const searchParams = useSearchParams();
  const lotId = searchParams?.get("id") || "";
  const initialSociete = searchParams?.get("societe") || "";
  const initialSdls = searchParams?.get("sdls") ? searchParams.get("sdls").split(",") : [];
  const initialDate = searchParams?.get("date") || new Date().toISOString().split("T")[0];
  const [loading, setLoading] = useState(false);
  const [societeOptions, setSocieteOptions] = useState([]);
  const [provinceOptions, setProvinceOptions] = useState([]);
  const [formData, setFormData] = useState({
    societe: initialSociete,
    selectedSDLs: initialSdls,
    humidite: "",
    rendement: "",
    sacsCount: "",
    poidsBrut: "",
    poidsTare: "",
    dateReception: initialDate,
    grades: GRADES.reduce((acc, grade) => ({ ...acc, [grade]: "" }), {}),
    gradeSDLs: GRADES.reduce((acc, grade) => ({ ...acc, [grade]: "" }), {})
  });

  const [activeGrades, setActiveGrades] = useState([]);
  // Synchronize active grades automatically with the selected SDLs
  useEffect(() => {
    async function loadInitialData() {
      try {
        const [allData] = await Promise.all([
          fetchData("get", `cafe/transfert_sdl_usine/group_by_societe_and_udp/${lotId}/`, { params: { offset: 0, limit: 150 } })
        ]);
        console.log(allData?.societe?.nom)
        setFormData(pre => ({
          ...pre,
          societe: allData?.societe?.nom || "",
          selectedSDLs: allData?.results?.sdls_list || [],
          humidite: allData?.humidite || "",
          rendement: allData?.rendement || "",
          sacsCount: allData?.sacs_count || "",
          poidsBrut: allData?.poids_brut || "",
          poidsTare: allData?.poids_tare || "",
          dateReception: allData?.date_reception || "",
          grades: allData?.grades || {},
          gradeSDLs: allData?.gradeSDLs || {}
        }))


      } catch (err) {
        console.error("Error loading initial data:", err);
      }
    }
    loadInitialData()
    const gradesSet = new Set();
    const gradeSDLs = { ...formData.gradeSDLs };

    formData.selectedSDLs.forEach((sdl) => {
      const grades = SDL_GRADES_MAP[sdl] || ["A1", "A2"];
      grades.forEach((grade) => {
        gradesSet.add(grade);
        if (!gradeSDLs[grade] || !formData.selectedSDLs.includes(gradeSDLs[grade]) || !(SDL_GRADES_MAP[gradeSDLs[grade]] || []).includes(grade)) {
          gradeSDLs[grade] = sdl;
        }
      });
    });

    setActiveGrades(Array.from(gradesSet));
    setFormData((prev) => ({
      ...prev,
      gradeSDLs: Array.from(gradesSet).reduce((acc, grade) => {
        acc[grade] = gradeSDLs[grade] || "";
        return acc;
      }, {})
    }));
  }, [lotId]);

  // Calculate weights on the fly to avoid cascading state renders
  const brut = parseFloat(formData.poidsBrut) || 0;
  const tare = parseFloat(formData.poidsTare) || 0;
  const poidsNet = Math.max(0, brut - tare);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGradeChange = (grade, value) => {
    setFormData((prev) => ({
      ...prev,
      grades: { ...prev.grades, [grade]: value }
    }));
  };

  const handleGradeSDLChange = (grade, value) => {
    setFormData((prev) => ({
      ...prev,
      gradeSDLs: { ...prev.gradeSDLs, [grade]: value }
    }));
  };

  const handleSelectSociete = (value) => {
    setFormData((prev) => ({
      ...prev,
      societe: value,
      selectedSDLs: [] // Reset selected SDLs when société changes
    }));
  };

  const handleAddSDL = (value) => {
    if (value && !formData.selectedSDLs.includes(value)) {
      setFormData((prev) => ({
        ...prev,
        selectedSDLs: [...prev.selectedSDLs, value]
      }));
    }
  };

  const handleRemoveSDL = (sdlName) => {
    setFormData((prev) => ({
      ...prev,
      selectedSDLs: prev.selectedSDLs.filter((item) => item !== sdlName)
    }));
  };

  const handleReset = () => {
    setFormData({
      societe: "",
      selectedSDLs: [],
      humidite: "",
      rendement: "",
      sacsCount: "",
      poidsBrut: "",
      poidsTare: "",
      dateReception: new Date().toISOString().split("T")[0],
      grades: GRADES.reduce((acc, grade) => ({ ...acc, [grade]: "" }), {}),
      gradeSDLs: GRADES.reduce((acc, grade) => ({ ...acc, [grade]: "" }), {})
    });
    setActiveGrades([]);
    toast.info("Formulaire réinitialisé");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.societe) {
      toast.error("Veuillez sélectionner la société.");
      return;
    }
    if (formData.selectedSDLs?.length === 0) {
      toast.error("Veuillez sélectionner au moins une Station de Lavage (SDL) d'origine.");
      return;
    }

    // Summing grade quantities
    const totalGradesQty = Object.values(formData.grades).reduce((acc, qty) => acc + (parseFloat(qty) || 0), 0);

    console.log("Submit Reception Lots Data:", { ...formData, poidsNet, totalGradesQty });
    toast.success("Lot reçu et enregistré avec succès !");
  };
  const availableSDLs = formData.societe ? (SOCIETE_SDL_MAP[formData.societe] || []) : [];

  return (
    <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.GENERAL, ROLES.ODECA, ROLES.SUPERVISEUR]}>
      <div className="p-6 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Inbox className="h-8 w-8 text-primary" /> Réception
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Enregistrement et pesée des nouveaux lots de café déparché en provenance des Stations de Lavage (SDL).
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleReset} className="gap-2">
              <RefreshCw className="h-4 w-4" /> Réinitialiser
            </Button>
          </div>
        </div>

        {lotId && (
          <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in slide-in-from-top-4 duration-300">
            <div>
              <p className="text-xs text-slate-500 font-medium">Confirmation de Réception</p>
              <h2 className="text-lg font-bold text-primary">ID : {lotId}</h2>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="bg-white dark:bg-slate-900 border-primary/20 text-primary font-semibold">
                Société: {formData.societe || "Non spécifiée"}
              </Badge>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Main Info Card */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-xs dark:bg-slate-950 border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" /> Informations Générales
                </CardTitle>
                <CardDescription>Détails du transfert et caractéristiques physico-chimiques.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Société */}
                  <div className="space-y-2">
                    <Label htmlFor="societe" className="font-semibold text-slate-700 dark:text-slate-300">
                      Société / Propriétaire
                    </Label>
                    <Input
                      type="text"
                      id="societe"
                      name="societe"
                      value={formData.societe}
                      disabled
                    />
                  </div>

                  {/* Date de Réception */}
                  <div className="space-y-2">
                    <Label htmlFor="dateReception" className="font-semibold text-slate-700 dark:text-slate-300">
                      Date de Réception
                    </Label>
                    <div className="relative">
                      <Input
                        type="date"
                        id="dateReception"
                        name="dateReception"
                        value={formData.dateReception}
                        onChange={handleChange}
                        className="w-full pl-10"
                        required
                      />
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    </div>
                  </div>
                </div>

                {/* Stations de Lavage (SDL) d'origine */}
                <div className="space-y-3">
                  <Label className="font-semibold text-slate-700 dark:text-slate-300">
                    Stations de Lavage (SDL) d&apos;origine transférées
                  </Label>

                  {formData?.selectedSDLs?.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2 animate-in fade-in duration-200">
                      {formData.selectedSDLs.map((sdl) => (
                        <div
                          key={sdl}
                          className="bg-primary/10 border border-primary/20 dark:bg-primary/20 text-slate-800 dark:text-slate-200 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 animate-in zoom-in-95 duration-200"
                        >
                          {sdl}
                          <button
                            type="button"
                            onClick={() => handleRemoveSDL(sdl)}
                            className="text-primary hover:text-red-500 dark:hover:text-red-400 focus:outline-none transition-colors"
                          >
                            <X className="h-3.5 w-3.5 stroke-[2.5]" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Grades Grid Card */}
            <Card className="shadow-xs dark:bg-slate-950 border-slate-200 dark:border-slate-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Layers className="h-5 w-5 text-primary" /> Quantités par Grade
                </CardTitle>
                <CardDescription>Saisie des volumes pour les grades de café envoyés automatiquement par les SDL d'origine.</CardDescription>
              </CardHeader>
              <CardContent>
                {activeGrades?.length === 0 ? (
                  <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center bg-slate-50/50 dark:bg-slate-900/30">
                    <Plus className="h-8 w-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      Aucune station de lavage sélectionnée pour charger automatiquement les grades de café.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in duration-200">
                    {activeGrades?.map((grade) => (
                      <div
                        key={grade}
                        className="bg-slate-50/50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-900 space-y-1.5 relative group animate-in zoom-in-95 duration-200"
                      >
                        <div className="flex justify-between items-center pb-1">
                          <Label htmlFor={`grade-${grade}`} className="text-sm ">
                            {grade}
                          </Label>

                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => handleGradeRemove(grade)}
                              className="text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition-colors text-xs"
                            >
                              Rejetter
                            </Button>
                            <Button
                              type="button"
                              onClick={() => handleGradeRemove(grade)}
                              className=" transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                        </div>
                        <div className="flex flex-col gap-2">
                          <Input
                            type="number"
                            min="0"
                            id={`grade-${grade}`}
                            value={formData.grades[grade]}
                            onChange={(e) => handleGradeChange(grade, e.target.value)}
                            placeholder="Qte en kg"
                            className="h-8 text-sm"
                          />
                          <div className="space-y-2">
                            <Input
                              type="number"
                              step="1"
                              min="0"
                              id="sacsCount"
                              name="sacsCount"
                              value={formData.sacsCount}
                              onChange={handleChange}
                              placeholder="Nombre de Sacs Ex: 320"
                              required
                            />
                            <p className="text-xs font-semibold text-primary mt-1">Origine : {formData.gradeSDLs[grade] || ""}</p>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Weighing & Submit Card */}
          <div className="space-y-6">
            <Card className="shadow-xs dark:bg-slate-950 border-slate-200 dark:border-slate-800 h-full flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Scale className="h-5 w-5 text-primary" /> Pesée & Calcul
                </CardTitle>
                <CardDescription>Rendement,Poids bruts, tare et calcul automatique du net.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 flex-1">


                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-1 gap-4 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="humidite" className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      Humidité <Percent className="h-3 w-3 text-slate-400" />
                    </Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      id="humidite"
                      name="humidite"
                      value={formData.humidite}
                      onChange={handleChange}
                      placeholder="Ex: 11.50 %"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rendement" className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      Rendement <Percent className="h-3 w-3 text-slate-400" />
                    </Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      id="rendement"
                      name="rendement"
                      value={formData.rendement}
                      onChange={handleChange}
                      placeholder="Ex: 82.50 %"
                      required
                    />
                  </div>

                </div>
                <div className="space-y-2">
                  <Label htmlFor="poidsBrut" className="font-semibold text-slate-700 dark:text-slate-300">
                    Poids Brut (kg)
                  </Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    id="poidsBrut"
                    name="poidsBrut"
                    value={formData.poidsBrut}
                    onChange={handleChange}
                    placeholder="Ex: 7200.00"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="poidsTare" className="font-semibold text-slate-700 dark:text-slate-300">
                    Poids Tare (kg)
                  </Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    id="poidsTare"
                    name="poidsTare"
                    value={formData.poidsTare}
                    onChange={handleChange}
                    placeholder="Ex: 320.00"
                    required
                  />
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-4 mt-2">
                  <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg flex flex-col justify-between border border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Poids Net Calculé
                    </span>
                    <span className="text-3xl font-extrabold text-primary pt-1">
                      {poidsNet.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} <span className="text-lg font-medium text-slate-500">kg</span>
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20">
                <Button type="submit" className="w-full h-11 text-base font-semibold shadow-xs">
                  Enregistrer la Réception
                </Button>
              </CardFooter>
            </Card>
          </div>

        </form>
      </div>
    </ProtectedRoute>
  );
}
