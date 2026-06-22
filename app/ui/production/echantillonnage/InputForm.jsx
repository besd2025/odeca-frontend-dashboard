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
} from "@/components/ui/dialog";
import { fetchData } from "@/app/_utils/api";

const COFFEE_QUALITIES = [
  "FW NGOMA MILD-SDL", "FW AA", "15+", "PB", "FW TT", "W ABC",
  "W TT", "W STOCK LOT", "GRADE 1", "GRADE 2", "ROBUSTA", "COQUE"
];

const SOCIETE_LIST = [
  "COCOCA", "BURUNDI SPECIALTY COFFEE", "BUCOFCO",
  "SOGESTAL Kirundo-Muyinga", "SOGESTAL Kayanza", "SOGESTAL Ngozi", "SOGESTAL Mumirwa"
];

const DEPARCHEUR_LIST = [
  "Usine Ngozi SOGESTAL", "Usine Gitega SOGESTAL",
  "Usine Kayanza SOGESTAL", "Usine Kirundo SOGESTAL", "Usine Mumirwa SOGESTAL"
];

const MOCK_STOCKED_BATCHES = [
  { id: "STOCK-2026-001", societe: "SOGESTAL Ngozi", grades: ["FW NGOMA MILD-SDL", "FW AA", "W ABC"], sacsCount: 216, deparcheur: "Usine Ngozi SOGESTAL" },
  { id: "STOCK-2026-002", societe: "SOGESTAL Kayanza", grades: ["FW AA", "15+"], sacsCount: 60, deparcheur: "Usine Kayanza SOGESTAL" },
  { id: "STOCK-2026-003", societe: "COCOCA", grades: ["ROBUSTA"], sacsCount: 58, deparcheur: "Usine Gitega SOGESTAL" },
  { id: "STOCK-2026-004", societe: "SOGESTAL Mumirwa", grades: ["GRADE 1"], sacsCount: 18, deparcheur: "Usine Mumirwa SOGESTAL" },
  { id: "STOCK-2026-005", societe: "SOGESTAL Ngozi", grades: ["W ABC"], sacsCount: 3, deparcheur: "Usine Ngozi SOGESTAL" }
];
// CORRECTION : On récupère l'id (ou idStockage passé par le parent) et la fonction onClose
export default function InputForm({ lotData, onClose, onAddSample }) {
  const [formData, setFormData] = useState({
    lotNumber: lotData?.lotNumbers,
    hundredGPerBag: true,
    sacsCount: lotData?.nombreSacs,
    qualite: "",
    quantite: "",
    qtePrelevee: "",
    proprieteSociete: lotData?.societe,
    deparcheur: lotData?.deparcheur,
    echantillonneur: "",
    prenom_echantillonneur: "",
    dateEchantillonnage: new Date().toISOString().split("T")[0],
    phone_echantillonneur: "",
    labo: []

  });
  const [labos, setLabos] = useState([]);
  const [qualites, setQualites] = useState([]);
  const [loading, setLoading] = useState(false);
  // Pré-remplir automatiquement si un ID est fourni par le parent au montage
  useEffect(() => {

    const loadInitialData = async () => {
      try {
        const data = await fetchData("get", `cafe/laboratoires/`);
        const qualites = await fetchData("get", `cafe/qualite_cafe/`);
        const result = data?.results.map((item) => ({
          id: item.id,
          label: item.labo_nom
        }));

        const resultQualites = qualites?.results.map((item) => ({
          id: item.id,
          label: item.nom
        }));
        setLabos(result);
        setQualites(resultQualites);

      } catch (err) {
        console.error("Error loading initial data:", err);
      }
    }
    loadInitialData();
  }, [lotData?.id]);

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };
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
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const requiredFields = [
      ["lotNumber", "Veuillez renseigner le numéro de lot."],
      ["proprieteSociete", "Veuillez sélectionner le propriétaire / société."],
      ["qualite", "Veuillez sélectionner la qualité du café."],
      ["sacsCount", "Veuillez renseigner le nombre de sacs."],
      ["echantillonneur", "Veuillez renseigner le nom de l'échantillonneur."],
      ["prenom_echantillonneur", "Veuillez renseigner le prenom de l'échantillonneur."],
      ["phone_echantillonneur", "Veuillez renseigner le numéro de téléphone de l'échantillonneur."],
      ["dateEchantillonnage", "Veuillez renseigner la date d'échantillonnage."],
      ["labo", "Veuillez sélectionner le laboratoire."],
      ["quantite", "Veuillez renseigner la quantité."],
    ];

    for (const [key, msg] of requiredFields) {
      if (!formData?.[key]) return toast.error(msg);
    }

    try {
      const sacs = Number.parseInt(formData.sacsCount, 10) || 0;

      // Calcul quantité (si hundredGPerBag, on calcule sinon on prend qtePrelevee)
      const qte = formData.hundredGPerBag
        ? sacs * 100
        : Number.parseFloat(formData.qtePrelevee) || 0;

      const payload = {
        echantionneur_nom: formData.echantillonneur,
        echantionneur_prenom: formData.prenom_echantillonneur,
        echantionneur_phone: formData.phone_echantillonneur,

        quanite: qte, // <-- IMPORTANT : on envoie la quantité calculée

        qualite: formData.qualite,
        stock: lotData?.id,
        loboratoire: formData.labo,
        date_echantillonage: formData.dateEchantillonnage,
      };

      const res = await fetchData(
        "post",
        `/cafe/echantillonage/`,
        {
          params: {},
          additionalHeaders: {},
          body: payload,
        }
      );

      if (res.status !== 200 && res.status !== 201) {
        throw new Error("Erreur de mise à jour du triage");
      }

      toast.success("Données enregistrées avec succès");
      return { lot: lotData?.id };
    } catch (error) {
      console.error(error);
      toast.error("Donnée non enregistrée!!!");
      throw error;
    }
  };


  return (
    <Dialog open={true} onOpenChange={(isOpen) => !isOpen && onClose()}>
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
          {/* Formulaire Principal */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-xs dark:bg-slate-950 border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" /> Caractéristiques du Lot
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="proprieteSociete" className="font-semibold text-slate-700 dark:text-slate-300">
                      Propriétaire / Société du café
                    </Label>
                    <div className="relative">
                      <Input disabled value={formData.proprieteSociete} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lotNumber" className="font-semibold text-slate-700 dark:text-slate-300">
                      Numéro de Lot (Stocké)
                    </Label>
                    <Input disabled value={formData.lotNumber} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sacsCount" className="font-semibold text-slate-700 dark:text-slate-300">
                      Nombre de Sacs représentés
                    </Label>
                    <Input disabled type="number" id="sacsCount" name="sacsCount" value={formData.sacsCount} placeholder="Ex: 85" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="labo" className="font-semibold text-slate-700 dark:text-slate-300">
                      Laboratoire
                    </Label>
                    <Select
                      /* CORRECTION 1 : Assure une valeur scalaire (String) même si l'état est vide ou indéfini */
                      value={formData.labo ? String(formData.labo) : ""}
                      /* CORRECTION 2 : Permet de mettre à jour l'état lors de la sélection */
                      onValueChange={(val) => handleSelectChange("labo", val)}
                    >
                      <SelectTrigger id="labo" className="w-full">
                        <SelectValue placeholder="Sélectionner un laboratoire" />
                      </SelectTrigger>
                      <SelectContent>
                        {/* CORRECTION 3 : Sécurité avec le chaînage optionnel (?.) au cas où labos est temporairement null */}
                        {labos?.map((lab) => (
                          <SelectItem key={lab.id} value={String(lab.id)}>
                            {lab.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section qualités */}
            <Card className="shadow-none dark:bg-slate-950 border-slate-200 dark:border-slate-800 flex flex-col justify-between">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3">
                <div>
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Layers className="h-5 w-5 text-primary" /> Quantité à prélever par qualité
                  </CardTitle>
                </div>

              </CardHeader>
              <CardContent className="flex-1">
                <div className="grid grid-cols-2 gap-3 max-h-max overflow-y-auto pr-1">

                  <div className="bg-slate-50/50 dark:bg-slate-900/50 p-2.5 rounded-lg border border-slate-100 dark:border-slate-900 space-y-1.5 relative">
                    <div className="space-y-2">
                      <Label htmlFor="qualite" className="font-semibold text-slate-700 dark:text-slate-300">
                        Qualité
                      </Label>
                      <Select
                        name="qualite"
                        value={formData.qualite}
                        /* CORRECTION : On utilise handleSelectChange au lieu de handleChange */
                        onValueChange={(val) => handleSelectChange("qualite", val)}
                      >
                        <SelectTrigger id="qualite" className="w-full">
                          <SelectValue placeholder="Sélectionner une qualité" />
                        </SelectTrigger>
                        <SelectContent>
                          {qualites.map((item) => (
                            /* SÉCURITÉ : item.id doit être casté en String si c'est un Number, car Radix/Shadcn requiert des strings */
                            <SelectItem key={item.id} value={String(item.id)}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quantite" className="font-semibold text-slate-700 dark:text-slate-300">Quantité à prélever</Label>
                      <div className="relative">
                        <Input type="number" id="quantite" name="quantite" value={formData.quantite} onChange={handleChange} placeholder="Quantité à prélever" className="pl-10" required />
                      </div>
                    </div>
                  </div>
                </div>

              </CardContent>
            </Card>
          </div>

          {/* Sidebar Acteurs */}
          <div className="space-y-6">
            <Card className="shadow-xs dark:bg-slate-950 border-slate-200 dark:border-slate-800 h-full flex flex-col justify-between">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" /> Acteurs & Date
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 flex-1">
                <div className="space-y-2">
                  <Label htmlFor="echantillonneur" className="font-semibold text-slate-700 dark:text-slate-300">Nom de l'Échantillonneur</Label>
                  <div className="relative">
                    <Input type="text" id="echantillonneur" name="echantillonneur" value={formData.echantillonneur} onChange={handleChange} placeholder="Nom de l'agent" className="pl-10" required />
                    <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prenom_echantillonneur" className="font-semibold text-slate-700 dark:text-slate-300">Prenom de l'Échantillonneur</Label>
                  <div className="relative">
                    <Input type="text" id="prenom_echantillonneur" name="prenom_echantillonneur" value={formData.prenom_echantillonneur} onChange={handleChange} placeholder="Nom de l'agent" className="pl-10" required />
                    <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone_echantillonneur" className="font-semibold text-slate-700 dark:text-slate-300">Phone de l'Échantillonneur</Label>
                  <div className="relative">
                    <Input type="text" id="phone_echantillonneur" name="phone_echantillonneur" value={formData.phone_echantillonneur} onChange={handleChange} placeholder="Nom de l'agent" className="pl-10" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateEchantillonnage" className="font-semibold text-slate-700 dark:text-slate-300">Date d'Échantillonnage</Label>
                  <div className="relative">
                    <Input type="date" id="dateEchantillonnage" name="dateEchantillonnage" value={formData.dateEchantillonnage} onChange={handleChange} className="w-full pl-10" required />
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50">
                <Button type="submit" className="w-full h-11 text-base font-semibold">Valider l'Échantillonnage</Button>
              </CardFooter>
            </Card>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}