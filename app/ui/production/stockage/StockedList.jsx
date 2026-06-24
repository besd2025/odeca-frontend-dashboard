import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, PackageCheck, AlertCircle, MoreHorizontal, Banknote } from "lucide-react";
import PaginationContent from "@/components/ui/pagination-content";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchData } from "@/app/_utils/api";
import InputForm from "../echantillonnage/InputForm";

import TabNouveauLot from "./tabs/TabNouveauLot";
import TabLotsTaxes from "./tabs/TabLotsTaxes";
import TabLotsNonTaxes from "./tabs/TabLotsNonTaxes";
import TabLotsStockesTaxes from "./tabs/TabLotsStockesTaxes";
import RetourList from "./tabs/retours";

// Mock data to replace the statics
const MOCK_GRADES = [
  { id: "fv", label: "FV", bags: 454 },
  { id: "fb", label: "FB", bags: 5 },
  { id: "pb", label: "PB", bags: 45 },
];
const MOCK_LOTS = [
  { id: "LOT-001", name: "LOT-001", },
  { id: "LOT-002", name: "LOT-002", },
  { id: "LOT-003", name: "LOT-003", },
  { id: "LOT-004", name: "LOT-004", },
]
export default function StockedList({ lots: initialLots = [], onViewDetails, onStockGrade }) {
  const [lots, setLots] = React.useState(initialLots);
  const [activeTab, setActiveTab] = React.useState("account");
  const [lotsExistants, setLotsExistants] = React.useState("");
  const [stockingGrade, setStockingGrade] = React.useState(null);
  const [bagsToStock, setBagsToStock] = React.useState("");
  const [lotNumbers, setLotNumbers] = React.useState([]);
  const [checkedTries, setCheckedTries] = React.useState([]);
  const [checkedNonRequis, setCheckedNonRequis] = React.useState({});
  const [isViewingDetailsStock, setIsViewingDetailsStock] = React.useState(false);
  const [formData, setFormData] = React.useState([]);
  const [nombreSacs, setNombreSacs] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [codeSociete, setCodeSociete] = React.useState("")
  const [open, setOpen] = React.useState(false);
  const handleViewDetailsStock = (lot) => {
    setIsViewingDetailsStock(true);
  };
  const handleLotChange = (value) => {
    setLotsExistants(value);
  }

  const [lotsAvailable, setLotsAvailable] = React.useState([])
  const [newLotName, setNewLotName] = React.useState("");
  const [qualities, setQualities] = React.useState([]);
  const [selectedQuality, setSelectedQuality] = React.useState("");
  const handleOpenStocking = async (gradeItem) => {
    setStockingGrade(gradeItem);
    setLotsExistants("");
    setNewLotName("");
    setSelectedQuality("");
    const initialTries = {};
    const initialNonRequis = {};
    MOCK_GRADES.forEach((g) => {
      initialTries[g.id] = false;
      initialNonRequis[g.id] = false;

    });
    //setCheckedTries(initialTries);
    //setCheckedNonRequis(initialNonRequis);
    setBagsToStock("0");
    setLotNumbers([]);

    try {

      const [allData, lotsData, qualiteRes] = await Promise.all([
        fetchData("get", `cafe/stock_cafe/get_qualites_pretes_stockage/`, { params: { societe_id: gradeItem?.id } }),
        fetchData("get", `cafe/stock_cafe/`, { params: { proprietaire: gradeItem?.id, limit: 100, offset: 0 } }),
        fetchData("get", "cafe/qualite_cafe/", { params: { limit: 200, offset: 0 } })
      ]);
      setFormData(allData?.qualites)
      setCodeSociete(allData?.code_societe)
      const lotdata = lotsData?.results?.map(item => {
        return {
          id: String(item?.id),
          name: item?.numero_lot,
        };
      });
      setLotsAvailable(lotdata)
      const dataQualities = qualiteRes?.results || qualiteRes?.data?.results || [];
      setQualities(dataQualities);

    } catch (err) {
      console.error("Error loading initial data:", err);

    }


  };

  const handleTriesToggle = (productionId) => {
    setCheckedTries((prev) => ({
      ...prev,
      [productionId]: !prev[productionId], // Inverse l'état actuel (true/false)
    }));
  };
  const [checkedNonRequisTries, setCheckedNonRequisTries] = React.useState([])
  const handleNonRequisToggle = (productionId) => {
    setCheckedNonRequisTries((prev) => ({
      ...prev,
      [productionId]: !prev[productionId], // Inverse l'état actuel (true/false)
    }));
  };
  // 2. Gère la saisie du nombre de sacs
  const [quantitiesSelected, setQuantitiesSelected] = React.useState([]);
  const handleQuantityChange = (productionId, value) => {
    setQuantitiesSelected((prev) => ({
      ...prev,
      [productionId]: Number(value),


    }));


  };
  const [nonRequisQuantity, setNonRequisQuantity] = React.useState([]);
  const handleNonRequisQuantityChange = (productionId, value) => {
    setNonRequisQuantity((prev) => ({
      ...prev,
      [productionId]: Number(value), // Convertit la saisie en nombre
    }));
  };
  const handleConfirmStocking = async (e) => {
    e.preventDefault();

    // 1. Vérification du lot sélectionné
    if (!lotsExistants) {
      toast.error("Veuillez sélectionner un lot.");
      return;
    }

    if (lotsExistants === "AUTRE" && !newLotName.trim()) {
      toast.error("Veuillez saisir le nom du nouveau lot.");
      return;
    }

    if (lotsExistants === "AUTRE" && !selectedQuality) {
      toast.error("Veuillez sélectionner une qualité pour le nouveau lot.");
      return;
    }
    if (!codeSociete) {
      toast.error("Veuillez réessayer");
      return;
    }

    // 2. Détection correcte des éléments cochés (Gestion sécurisée des objets {})
    const hasTriesChecked = Object.values(checkedTries || {}).some(v => v === true);
    const hasNonRequisChecked = Object.values(checkedNonRequisTries || {}).some(v => v === true);

    if (!hasTriesChecked && !hasNonRequisChecked) {
      toast.error("Veuillez sélectionner au moins une qualité.");
      return;
    }

    // 3. Calcul de la disponibilité physique globale des sacs
    const selectedItems = formData
      .filter((g) => checkedTries?.[g.production_id] === true)
      .reduce((acc, g) => ({ ...acc, [g.production_id]: (acc[g.production_id] || 0) + g.nombre_sacs_restant }), {});

    const selectedNonRequisItems = formData
      .filter((g) => checkedNonRequisTries?.[g.production_id] === true)
      .reduce((acc, g) => ({ ...acc, [g.production_id]: (acc[g.production_id] || 0) + g.nombre_sacs_restant }), {});

    const totalSacsAvailable = Object.values(selectedItems).reduce((sum, n) => sum + n, 0);
    const totalNonRequisAvailable = Object.values(selectedNonRequisItems).reduce((sum, n) => sum + n, 0);

    // Total des volumes saisis par l'utilisateur
    const totalSacsDemandes = Object.values(quantitiesSelected || {}).reduce((sum, n) => sum + Number(n), 0) +
      Object.values(nonRequisQuantity || {}).reduce((sum, n) => sum + Number(n), 0);

    if ((totalSacsAvailable + totalNonRequisAvailable) < totalSacsDemandes) {
      toast.error("La quantité à stocker est supérieure au nombre de sacs disponibles.");
      return;
    }

    // 4. Construction de la liste des charges utiles (Payloads) pour les API
    const apiPayloads = [];

    // Cas A : Ajout des tris requis (Après Triage)
    if (hasTriesChecked) {
      Object.keys(quantitiesSelected || {}).forEach((id) => {
        const nombreSacs = Number(quantitiesSelected[id]);
        if (nombreSacs > 0) {
          apiPayloads.push({
            idProduction: Number(id),
            nombreSacs: nombreSacs,
            endpoint: "cafe/prestockage_apres_triage/",
            payloadKey: "apres_triage"
          });
        }
      });
    }

    // Cas B : Ajout des tris non requis (Après Usinage)
    if (hasNonRequisChecked) {
      Object.keys(nonRequisQuantity || {}).forEach((id) => {
        const nombreSacs = Number(nonRequisQuantity[id]);
        if (nombreSacs > 0) {
          apiPayloads.push({
            idProduction: Number(id),
            nombreSacs: nombreSacs,
            endpoint: "cafe/prestockage_apres_usinage/", // Cible le bon endpoint détecté dans ton code initial
            payloadKey: "apres_usinage"
          });
        }
      });
    }

    if (apiPayloads.length === 0) {
      toast.error("Aucune quantité valide à enregistrer.");
      return;
    }

    // 5. Lancement des requêtes réseau
    setLoading(true);

    const executeSaving = async () => {
      let finalLotId = lotsExistants;

      // Si c'est un nouveau lot, on l'enregistre d'abord dans l'API
      if (lotsExistants === "AUTRE") {
        const createLotRes = await fetchData(
          "post",
          "cafe/stock_cafe/",
          {
            params: {},
            additionalHeaders: {},
            body: {
              numero_lot: newLotName.trim(),
              proprietaire: codeSociete,
              qualite: Number(selectedQuality)
            }
          }
        );

        if (createLotRes.status !== 200 && createLotRes.status !== 201) {
          throw new Error("Erreur lors de la création du nouveau lot.");
        }

        const newLotData = createLotRes.data || createLotRes;
        if (!newLotData?.id) {
          throw new Error("Impossible de récupérer l'ID du nouveau lot créé.");
        }

        finalLotId = String(newLotData.id);
      }

      // Une fois le lotId obtenu (existant ou nouveau), on effectue le préstockage
      const savePromises = apiPayloads.map(async (item) => {
        const results = await fetchData(
          "post",
          `/${item.endpoint}`,
          {
            params: {},
            additionalHeaders: {},
            body: {
              "nombre_sacs": item.nombreSacs,
              "stockage": finalLotId,
              [item.payloadKey]: item.idProduction,
            },
          }
        );

        if (results.status !== 200 && results.status !== 201) {
          throw new Error(`Erreur lors du traitement du lot ID ${item.idProduction}`);
        }
        return results.data;
      });

      return Promise.all(savePromises);
    };

    // 6. Résolution synchronisée avec Toast unique de contrôle
    toast.promise(executeSaving(), {
      loading: "Mise en stock des données en cours...",
      success: () => {
        if (typeof onSave === "function") {
          try {
            onSave(lotsExistants, typeof finalizedData !== "undefined" ? finalizedData : null);
          } catch (e) {
            console.error(e);
          }
        }
        setTimeout(() => {
          setOpen(false);
          setStockingGrade(null);
        }, 500);
        setLoading(false);
        return "Toutes les données ont été enregistrées avec succès !";
      },
      error: (err) => {
        console.error("Stocking error:", err);
        if (typeof setError === "function") {
          try {
            setError(err.message);
          } catch (e) {
            console.error(e);
          }
        }
        setLoading(false);
        return err.message || "Une ou plusieurs données n'ont pas pu être enregistrées.";
      },
    });
  };

  const handleTabChange = (value) => {
    setActiveTab(value);
  };
  return (
    <div>
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="w-full md:w-max">
          <TabsTrigger value="account">Nouveau lot</TabsTrigger>
          <TabsTrigger value="password">Stock non prélevés</TabsTrigger>
          <TabsTrigger value="Taxation">Rapport de taxation</TabsTrigger>
          <TabsTrigger value="stocked">Lots Stockes & taxes</TabsTrigger>
          <TabsTrigger value="retours">Retours</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <TabNouveauLot onViewDetails={handleViewDetailsStock} handleOpenStocking={handleOpenStocking} />
        </TabsContent>
        <TabsContent value="Taxation">
          <TabLotsTaxes />
        </TabsContent>
        <TabsContent value="password">
          <TabLotsNonTaxes handleViewDetailsStock={handleViewDetailsStock} />
        </TabsContent>
        <TabsContent value="stocked">
          <TabLotsStockesTaxes />
        </TabsContent>
        <TabsContent value="retours">
          <RetourList handleViewDetailsStock={handleViewDetailsStock} />
        </TabsContent>
      </Tabs>

      <Dialog open={!!stockingGrade} onOpenChange={(open) => !open && setStockingGrade(null)}>
        <DialogContent className="sm:max-w-xl bg-sidebar border border-slate-200 dark:border-slate-800 shadow-xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <PackageCheck className="h-5 w-5 text-primary" /> Stocker le Grade
            </DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-slate-400">
              Définir les numéros de lot et les sacs pour le stockage. 1 lot = 320 sacs.
            </DialogDescription>
          </DialogHeader>

          {stockingGrade && (
            <form onSubmit={handleConfirmStocking} className="space-y-4">
              <div className="p-3 bg-primary/5 border border-primary/10 rounded-lg text-sm space-y-1">
                <div><span className="font-semibold text-primary">Société:</span> {stockingGrade.societe}</div>
              </div>
              <Label>Sélectionner un lot existant</Label>
              <Select
                value={lotsExistants}
                onValueChange={handleLotChange}
              >
                <SelectTrigger className="w-full bg-background">
                  <SelectValue placeholder="Sélectionner un lot" />
                </SelectTrigger>
                <SelectContent>
                  {lotsAvailable.map((item) => (
                    <SelectItem key={item.id} value={String(item.id)}>
                      {item.name}
                    </SelectItem>
                  ))}
                  <SelectItem value="AUTRE">AUTRE</SelectItem>
                </SelectContent>
              </Select>

              {lotsExistants === "AUTRE" && (
                <>
                  <div className="space-y-2 mt-2">
                    <Label htmlFor="newLotName">Nom du nouveau lot</Label>
                    <Input
                      id="newLotName"
                      type="text"
                      placeholder="Saisir le nom du nouveau lot"
                      value={newLotName}
                      onChange={(e) => setNewLotName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2 mt-2">
                    <Label htmlFor="qualitySelect">Qualité</Label>
                    <Select
                      value={selectedQuality}
                      onValueChange={setSelectedQuality}
                    >
                      <SelectTrigger className="w-full bg-background">
                        <SelectValue placeholder="Sélectionner une qualité" />
                      </SelectTrigger>
                      <SelectContent>
                        {qualities.map((item) => (
                          <SelectItem key={item.id} value={String(item.id)}>
                            {item.nom}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
              <Label>Combiner</Label>
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div>
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div>
                      <h1 className="text-md font-bold mb-2">Tries</h1>
                      <div className="space-y-2">
                        {formData?.map((g, index) => {
                          const uniqueId = g.production_id;

                          if (g.type === "TRIAGE") {
                            return (
                              <div key={uniqueId} className="flex items-center justify-center gap-4 bg-background/50 rounded-lg p-1">

                                {/* CHECKBOX CORRIGÉE */}
                                <Checkbox
                                  id={`checkbox-${uniqueId}`}
                                  checked={!!checkedTries[uniqueId]} // Récupère l'état true/false
                                  onCheckedChange={() => handleTriesToggle(uniqueId)}
                                  className="ml-2"
                                />

                                <Label htmlFor={`checkbox-${uniqueId}`} className="text-sm font-semibold cursor-pointer">
                                  {g.qualite}
                                </Label>

                                <div className="flex flex-col">
                                  <Label className="text-xs mb-0.5 text-secondary">
                                    {g.nombre_sacs_restant || 0} Sacs disponibles
                                  </Label>

                                  {/* INPUT CORRIGÉ */}
                                  <Input
                                    type="number"
                                    min="1"
                                    max={g.nombre_sacs_restant}
                                    placeholder="Sacs"
                                    className="w-24 h-8"
                                    value={quantitiesSelected[uniqueId] ?? ""}   // <-- valeur saisie
                                    onChange={(e) => handleQuantityChange(uniqueId, e.target.value)}
                                    required
                                  />
                                </div>
                              </div>
                            );
                          }
                          return null;
                        })}
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h1 className="text-md font-bold text-slate-900 dark:text-white mb-2">Triage non requis</h1>
                  <div className="space-y-2">
                    {formData?.map((g, index) => {
                      const uniqueId = g.production_id;

                      if (g.type === "USINAGE") {
                        return (
                          <div key={uniqueId} className="flex items-center justify-center gap-4 bg-background/50 rounded-lg p-1">

                            {/* CHECKBOX CORRIGÉE */}
                            <Checkbox
                              id={`checkbox-${uniqueId}`}
                              checked={!!checkedNonRequisTries[uniqueId]} // Récupère l'état true/false
                              onCheckedChange={() => handleNonRequisToggle(uniqueId)}
                              className="ml-2"
                            />

                            <Label htmlFor={`checkbox-${uniqueId}`} className="text-sm font-semibold cursor-pointer">
                              {g.qualite}
                            </Label>

                            <div className="flex flex-col">
                              <Label className="text-xs mb-0.5 text-secondary">
                                {g.nombre_sacs_restant || 0} Sacs disponibles
                              </Label>

                              {/* INPUT CORRIGÉ */}
                              <Input
                                type="number"
                                min="1"
                                max={g.nombre_sacs_restant}
                                placeholder="Sacs"
                                className="w-24 h-8"
                                // Affiche la valeur saisie, ou la valeur par défaut du lot si vide
                                value={nonRequisQuantity[uniqueId] || ""}
                                onChange={(e) => handleNonRequisQuantityChange(uniqueId, e.target.value)}
                                required
                              />
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>

                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Nombre de sacs à stocker</Label>
                <Input
                  type="number"
                  min="1"
                  value={nombreSacs}
                  onChange={(e) => setNombreSacs(e.target.value)}
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <Button variant="outline" type="button" onClick={() => setStockingGrade(null)} size="sm">
                  Annuler
                </Button>
                <Button type="submit" className="bg-primary text-white" size="sm" onClick={handleConfirmStocking}>
                  Enregistrer
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={isViewingDetailsStock} onOpenChange={setIsViewingDetailsStock}>
        <DialogContent className="sm:max-w-2xl bg-sidebar border border-slate-200 dark:border-slate-800 shadow-xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
              Details du Stock
            </DialogTitle>
          </DialogHeader>
          <div className=" gap-4">
            {/* Grades */}
            <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-lg border border-slate-100 dark:border-slate-900 space-y-2">
              <span className="text-xs font-bold text-secondary uppercase tracking-wider">
                Qualité (Café Vert) Stockés
              </span>
              <div className="space-y-1.5 mt-2">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Qualité</TableHead>
                      <TableHead className="text-right">Nombre de Sacs</TableHead>
                      <TableHead>Poids Net</TableHead>
                      <TableHead>Poids Brut</TableHead>
                      <TableHead>Date de Stockage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lots.map((lot) => (
                      <TableRow key={lot.id}>
                        <TableCell>
                          grade
                        </TableCell>
                        <TableCell className="text-right font-semibold text-slate-900 dark:text-white">
                          {lot.nombreSacs ?? "—"}
                        </TableCell>
                        <TableCell className="text-right font-semibold text-slate-900 dark:text-white">
                          {lot.poidsNet ?? "—"}
                        </TableCell>
                        <TableCell className="text-right font-semibold text-slate-900 dark:text-white">
                          {lot.poidsBrut ?? "—"}
                        </TableCell>
                        <TableCell className="text-slate-600 dark:text-slate-400 whitespace-nowrap">
                          {lot.dateStockage || "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
