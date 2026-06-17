import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Calendar,
  Layers,
  Building2,
  Trash2,
  Plus,
  X,
  FileText,
  Scale,
  ShieldAlert,
  BarChart,
  User,
  Beaker
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const COFFEE_QUALITIES = [
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
  "ROBUSTA",
  "COQUE"
];

const SOCIETE_LIST = [
  "COCOCA",
  "BURUNDI SPECIALTY COFFEE",
  "BUCOFCO",
  "SOGESTAL Kirundo-Muyinga",
  "SOGESTAL Kayanza",
  "SOGESTAL Ngozi",
  "SOGESTAL Mumirwa"
];

const DEPARCHEUR_LIST = [
  "Usine Ngozi SOGESTAL",
  "Usine Gitega SOGESTAL",
  "Usine Kayanza SOGESTAL",
  "Usine Kirundo SOGESTAL",
  "Usine Mumirwa SOGESTAL"
];

const MOCK_STOCKED_BATCHES = [
  {
    id: "STOCK-2026-001",
    societe: "SOGESTAL Ngozi",
    grades: ["FW NGOMA MILD-SDL", "FW AA", "W ABC"],
    sacsCount: 216,
    deparcheur: "Usine Ngozi SOGESTAL"
  },
  {
    id: "STOCK-2026-002",
    societe: "SOGESTAL Kayanza",
    grades: ["FW AA", "15+"],
    sacsCount: 60,
    deparcheur: "Usine Kayanza SOGESTAL"
  },
  {
    id: "STOCK-2026-003",
    societe: "COCOCA",
    grades: ["ROBUSTA"],
    sacsCount: 58,
    deparcheur: "Usine Gitega SOGESTAL"
  },
  {
    id: "STOCK-2026-004",
    societe: "SOGESTAL Mumirwa",
    grades: ["GRADE 1"],
    sacsCount: 18,
    deparcheur: "Usine Mumirwa SOGESTAL"
  },
  {
    id: "STOCK-2026-005",
    societe: "SOGESTAL Ngozi",
    grades: ["W ABC"],
    sacsCount: 3,
    deparcheur: "Usine Ngozi SOGESTAL"
  }
];

export default function InputForm({ onAddSample }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    lotNumber: "",
    hundredGPerBag: true,
    sacsCount: "",
    qualite: "",
    qtePrelevee: "",
    proprieteSociete: "",
    deparcheur: "",
    echantillonneur: "",
    dateEchantillonnage: new Date().toISOString().split("T")[0]
  });

  // Calculate sampling quantity dynamically (100g/sac)
  useEffect(() => {
    if (formData.hundredGPerBag) {
      const sacs = parseInt(formData.sacsCount) || 0;
      setFormData((prev) => ({
        ...prev,
        qtePrelevee: sacs > 0 ? (sacs * 100).toString() : ""
      }));
    }
  }, [formData.sacsCount, formData.hundredGPerBag]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked) => {
    setFormData((prev) => ({ ...prev, hundredGPerBag: checked }));
  };

  // State for the "Quantité à prélever par qualité" dynamic grade list
  const [activeGrades, setActiveGrades] = useState([]);
  const [quantities, setQuantities] = useState(
    COFFEE_QUALITIES.reduce((acc, g) => ({ ...acc, [g]: "" }), {})
  );

  const handleLotSelect = (selectedLotId) => {
    const batch = MOCK_STOCKED_BATCHES.find((b) => b.id === selectedLotId);
    if (batch) {
      setFormData((prev) => ({
        ...prev,
        lotNumber: batch.id,
        sacsCount: batch.sacsCount.toString(),
        proprieteSociete: batch.societe,
        deparcheur: batch.deparcheur,
        qualite: batch.grades.join(", "),
      }));
      setActiveGrades(batch.grades);

      const newQuantities = COFFEE_QUALITIES.reduce((acc, g) => ({ ...acc, [g]: "" }), {});
      batch.grades.forEach(g => {
        newQuantities[g] = Math.ceil(batch.sacsCount * 0.1).toString();
      });
      setQuantities(newQuantities);

      toast.success(`Lot ${batch.id} sélectionné. Les informations ont été pré-remplies.`);
    } else {
      setFormData((prev) => ({
        ...prev,
        lotNumber: selectedLotId,
      }));
    }
  };


  const handleGradeAdd = (val) => {
    if (val && !activeGrades.includes(val)) {
      setActiveGrades((prev) => {
        const next = [...prev, val];
        setFormData((prevForm) => ({
          ...prevForm,
          qualite: next.join(", ")
        }));
        return next;
      });
    }
  };

  const handleGradeRemove = (grade) => {
    setActiveGrades((prev) => {
      const next = prev.filter((g) => g !== grade);
      setFormData((prevForm) => ({
        ...prevForm,
        qualite: next.join(", ")
      }));
      return next;
    });
    setQuantities((prev) => ({ ...prev, [grade]: "" }));
  };

  const handleQtyChange = (grade, value) => {
    setQuantities((prev) => ({ ...prev, [grade]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.lotNumber) {
      toast.error("Veuillez renseigner le numéro de lot.");
      return;
    }
    if (!formData.proprieteSociete) {
      toast.error("Veuillez sélectionner le propriétaire / société.");
      return;
    }
    if (!formData.deparcheur) {
      toast.error("Veuillez sélectionner l'usine de déparchage / déparcheur.");
      return;
    }
    if (!formData.qualite) {
      toast.error("Veuillez sélectionner la qualité du café.");
      return;
    }
    if (!formData.sacsCount) {
      toast.error("Veuillez renseigner le nombre de sacs.");
      return;
    }

    const sacs = parseInt(formData.sacsCount) || 0;
    const qte = formData.hundredGPerBag ? sacs * 100 : parseFloat(formData.qtePrelevee) || 0;

    const newSample = {
      lotNumber: formData.lotNumber,
      societe: formData.proprieteSociete,
      qualite: formData.qualite,
      sacsCount: sacs,
      qtePrelevee: qte,
      echantillonneur: formData.echantillonneur,
      dateEchantillonnage: formData.dateEchantillonnage,
      deparcheur: formData.deparcheur
    };

    if (onAddSample) {
      onAddSample(newSample);
    }
    toast.success("Échantillon prélevé et enregistré !");
    setOpen(false);

    // Reset form fields except sampler and date for convenience
    setFormData((prev) => ({
      ...prev,
      lotNumber: "",
      sacsCount: "",
      qualite: "",
      qtePrelevee: "",
      proprieteSociete: "",
      deparcheur: ""
    }));
    setActiveGrades([]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="rounded-full shadow-md font-semibold">
          <Plus className="mr-2 h-4 w-4" /> Nouveau Prélèvement
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl md:max-w-2xl lg:max-w-[90vw] bg-sidebar border border-slate-200 dark:border-slate-800 shadow-xl overflow-y-auto max-h-[90vh]">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
            <Beaker className="h-6 w-6 text-primary animate-pulse" /> Nouveau Prélèvement d'Échantillon
          </DialogTitle>
          <DialogDescription className="text-slate-500 dark:text-slate-400">
            Veuillez saisir les caractéristiques du lot pour générer l'échantillon physique de laboratoire.
          </DialogDescription>
        </DialogHeader>

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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="proprieteSociete" className="font-semibold text-slate-700 dark:text-slate-300">
                      Propriétaire / Société du café
                    </Label>
                    <div className="relative">
                      <Select
                        value={formData.proprieteSociete}
                        onValueChange={(val) => handleSelectChange("proprieteSociete", val)}
                      >
                        <SelectTrigger id="proprieteSociete" className="w-full pl-10">
                          <SelectValue placeholder=" propriétaire / société" />
                        </SelectTrigger>
                        <SelectContent>
                          {SOCIETE_LIST.map((soc) => (
                            <SelectItem key={soc} value={soc}>
                              {soc}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Building2 className="absolute left-3 top-3 h-4 w-4 text-slate-400 pointer-events-none z-10" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deparcheur" className="font-semibold text-slate-700 dark:text-slate-300">
                      Usine de déparchage / Déparcheur
                    </Label>
                    <div className="relative">
                      <Select
                        value={formData.deparcheur}
                        onValueChange={(val) => handleSelectChange("deparcheur", val)}
                      >
                        <SelectTrigger id="deparcheur" className="w-full pl-10">
                          <SelectValue placeholder="déparcheur" />
                        </SelectTrigger>
                        <SelectContent>
                          {DEPARCHEUR_LIST.map((dep) => (
                            <SelectItem key={dep} value={dep}>
                              {dep}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <BarChart className="absolute left-3 top-3 h-4 w-4 text-slate-400 pointer-events-none z-10" />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="lotNumber" className="font-semibold text-slate-700 dark:text-slate-300">
                      Numéro de Lot (Stocké)
                    </Label>
                    <Select
                      value={formData.lotNumber}
                      onValueChange={handleLotSelect}
                    >
                      <SelectTrigger id="lotNumber" className="w-full">
                        <SelectValue placeholder="Choisir un lot stocké" />
                      </SelectTrigger>
                      <SelectContent>
                        {MOCK_STOCKED_BATCHES.map((b) => (
                          <SelectItem key={b.id} value={b.id} className="text-xs">
                            {b.id} ({b.societe} — {b.sacsCount} sacs)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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

              </CardContent>
            </Card>
            <Card className="shadow-none dark:bg-slate-950 border-slate-200 dark:border-slate-800 flex flex-col justify-between">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3">
                <div>
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Layers className="h-5 w-5 text-primary" /> Quantité à prélever par qualité
                  </CardTitle>
                  <CardDescription>Sélection des qualités de café en entrée et leurs volumes bruts.</CardDescription>
                </div>
                <div className="w-full sm:w-48">
                  <Select onValueChange={handleGradeAdd} value="">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Ajouter une qualité..." />
                    </SelectTrigger>
                    <SelectContent>
                      {COFFEE_QUALITIES.filter((quality) => !activeGrades.includes(quality)).map((quality) => (
                        <SelectItem key={quality} value={quality}>
                          {quality}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                {activeGrades.length === 0 ? (
                  <div className="h-full min-h-[140px] flex flex-col items-center justify-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-6 text-center bg-slate-50/50 dark:bg-slate-900/30">
                    <Plus className="h-8 w-8 text-slate-300 dark:text-slate-700 mb-2" />
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      Aucune qualité sélectionnée. Utilisez le sélecteur ci-dessus pour ajouter des qualités en entrée.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 max-h-max overflow-y-auto pr-1">
                    {activeGrades.map((quality) => (
                      <div
                        key={quality}
                        className="bg-slate-50/50 dark:bg-slate-900/50 p-2.5 rounded-lg border border-slate-100 dark:border-slate-900 space-y-1.5 relative"
                      >
                        <div className="flex justify-between items-center">
                          <Label htmlFor={`input-${quality}`} className="text-xs font-bold text-slate-600 dark:text-slate-400">
                            {quality}
                          </Label>
                          <button
                            type="button"
                            onClick={() => handleGradeRemove(quality)}
                            className="text-slate-400 hover:text-red-500 dark:hover:text-red-400"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <Input
                          type="number"
                          min="0"
                          step="any"
                          id={`input-${quality}`}
                          value={quantities[quality]}
                          onChange={(e) => handleQtyChange(quality, e.target.value)}
                          placeholder="Qté prélevée en Kg"
                          className="h-8 text-xs"
                          required
                        />
                        <Input
                          type="number"
                          min="0"
                          step="any"
                          id={`input-${quality}`}
                          value={quantities[quality]}
                          onChange={(e) => handleQtyChange(quality, e.target.value)}
                          placeholder="Nbre  des sacs"
                          className="h-8 text-xs"
                          required
                        />
                      </div>
                    ))}
                  </div>
                )}
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
      </DialogContent>
    </Dialog>
  );
}
