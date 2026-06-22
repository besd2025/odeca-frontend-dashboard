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
import { Inbox, Scale, Calendar, Percent, Layers, Archive, RefreshCw, Trash2, Plus, X, Building2, Trash } from "lucide-react";
import { fetchData } from "@/app/_utils/api";
import Transferts from "./transfert";
import Grades from "./grades";


const GRADES = [
  "A1", "A2", "A3", "A4",
  "B1", "B2", "B3", "COQUE",
  "CAFE NATUREL", "CAFE Miel", "Anaerobic", "Robusta"
];


export default function ConfirmationPage() {
  const searchParams = useSearchParams();
  const lotId = searchParams?.get("id") || "";
  const initialSociete = searchParams?.get("societe") || "";
  const initialSdls = searchParams?.get("sdls");
  const initialDate = searchParams?.get("date") || new Date().toISOString().split("T")[0];
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

    const gradesSet = new Set();
    const gradeSDLs = { ...formData.gradeSDLs };
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.societe) {
      toast.error("Veuillez sélectionner la société.");
      return;
    }
    if (formData.selectedSDLs.length === 0) {
      toast.error("Veuillez sélectionner au moins une Station de Lavage (SDL) d'origine.");
      return;
    }

    // Summing grade quantities
    const totalGradesQty = Object.values(formData.grades).reduce((acc, qty) => acc + (parseFloat(qty) || 0), 0);

    console.log("Submit Reception Lots Data:", { ...formData, poidsNet, totalGradesQty });
  };

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
          <div className="lg:col-span-3 space-y-6">
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
                  {/* SDL */}
                  <div className="space-y-2">
                    <Label htmlFor="sdl" className="font-semibold text-slate-700 dark:text-slate-300">
                      Station de Lavage
                    </Label>
                    <Input
                      type="text"
                      id="sdl"
                      name="sdl"
                      value={initialSdls}
                      disabled
                    />
                  </div>

                  {/* Date de Réception */}
                  {/* <div className="space-y-2">
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
                  </div> */}
                </div>


              </CardContent>
            </Card>
            <Grades />
          </div>


        </form>
      </div>
    </ProtectedRoute>
  );
}