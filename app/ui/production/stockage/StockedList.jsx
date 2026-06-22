import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, PackageCheck, AlertCircle, MoreHorizontal } from "lucide-react";
import PaginationContent from "@/components/ui/pagination-content";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchData } from "@/app/_utils/api";
import InputForm from "../echantillonnage/InputForm";
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
  const [open, setOpen] = React.useState(false);
  const [DataStockage, setDataStockage] = React.useState([]);
  const [openEchantillonner, setOpenEchantillonner] = React.useState(false);
  const handleViewDetailsStock = (lot) => {
    setIsViewingDetailsStock(true);
  };
  const handleOpenEchantillonner = (lot) => {
    setDataStockage(lot);
    setOpenEchantillonner(true);
  };
  const handleLotChange = (value) => {
    setLotsExistants(value);
  }

  const [lotsAvailable, setLotsAvailable] = React.useState([])
  const handleOpenStocking = async (gradeItem) => {
    setStockingGrade(gradeItem);
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

      const [allData, lotsData] = await Promise.all([
        fetchData("get", `cafe/stock_cafe/get_qualites_pretes_stockage/`, { params: { societe_id: gradeItem?.id } }),
        fetchData("get", `cafe/stock_cafe/`, { params: { proprietaire: gradeItem?.id, limit: 100, offset: 0 } })
      ]);
      setFormData(allData?.qualites)
      const lotdata = lotsData?.results?.map(item => {
        return {
          id: String(item?.id),
          name: item?.numero_lot,
        };
      });
      setLotsAvailable(lotdata)

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
      toast.error("Veuillez sélectionner un lot existant.");
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

    // Transformation des configurations de payload en promesses actives
    const savePromises = apiPayloads.map(async (item) => {
      const results = await fetchData(
        "post",
        `/${item.endpoint}`,
        {
          params: {},
          additionalHeaders: {},
          body: {
            "nombre_sacs": item.nombreSacs,
            "stockage": lotsExistants,
            [item.payloadKey]: item.idProduction, // Devient dynamiquement "apres_triage" ou "apres_usinage"
          },
        }
      );

      if (results.status !== 200 && results.status !== 201) {
        throw new Error(`Erreur lors du traitement du lot ID ${item.idProduction}`);
      }
      return results.data;
    });

    // 6. Résolution synchronisée avec Toast unique de contrôle
    toast.promise(Promise.all(savePromises), {
      loading: "Mise en stock des données en cours...",
      success: () => {
        if (typeof onSave === "function") onSave(lotsExistants, finalizedData);
        setTimeout(() => setOpen(false), 500);
        setLoading(false);
        return "Toutes les données ont été enregistrées avec succès !";
      },
      error: (err) => {
        console.error("Stocking error:", err);
        if (typeof setError === "function") setError(err.message);
        setLoading(false);
        return "Une ou plusieurs données n'ont pas pu être enregistrées.";
      },
    });
  };

  const fetchLots = async () => {

    try {
      if (activeTab === "account") {


        const lotsData = await fetchData("get", `cafe/stock_cafe/get_qualites_pretes_stockage/`, { params: { limit: 10000, offset: 0 } });
        const formattedLots = lotsData?.results?.map(item => {
          // Transform productions array into an object { "Grade Name": numberOfBags }
          const processedGrades = Array.isArray(item?.qualites)
            ? item.qualites.reduce((acc, curr) => {
              acc[curr.qualite || `Qualité ${curr.qualite || 'Inconnue'}`] = curr.nombre_sacs_restant || curr.quantite || 0;
              return acc;
            }, {})
            : (item?.qualites || {});

          return {
            id: item?.societe_id,
            societe: item?.nom_societe,
            sdls: [],
            grades: processedGrades,
            dateEntree: item?.created_at?.split("T")[0],
            status: "Prêt à stocker",
            remainingQuantities: { ...processedGrades },

          };
        });
        setLots(formattedLots);

      }

      if (activeTab === "password") {

        const lotsData = await fetchData("get", `cafe/stock_cafe/get_qualites_stockees/`, { params: { limit: 10000, offset: 0 } });
        const formattedLots = lotsData?.results?.map(item => {
          // Transform productions array into an object { "Grade Name": numberOfBags }

          const processedGrades = Array.isArray(item?.qualites)
            ? item.qualites.reduce((acc, curr) => {
              acc[curr.qualite || `Qualité ${curr.qualite || 'Inconnue'}`] = curr.nombre_sacs_restant || curr.quantite || 0;
              return acc;
            }, {})
            : (item?.qualites || {});

          return {
            id: item?.stock_id,
            societe: item?.nom_societe,
            lotNumbers: item?.stock_lot,
            sdls: [],
            grades: processedGrades,
            dateEntree: item?.created_at?.split("T")[0],
            status: "Prêt à stocker",
            remainingQuantities: { ...processedGrades },
            nombreSacs: item?.total_sacs,
            dateStockage: item?.date_stockage,


          };
        });
        console.log("formattedLots : ", lotsData);
        setLots(formattedLots);

      }
    } catch (error) {
      console.error("Error fetching lots:", error);
    }
  };

  React.useEffect(() => {

    fetchLots();

  }, [activeTab]);
  const handleTabChange = (value) => {
    setActiveTab(value);
  };
  return (
    <div>
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="w-full md:w-1/2">
          <TabsTrigger value="account">Nouveau lot</TabsTrigger>
          <TabsTrigger value="password">Stock</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <Card className="shadow-xs dark:bg-slate-950 border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <PackageCheck className="h-5 w-5 text-primary" /> Nouveau lot
              </CardTitle>
              <CardDescription>
                Nouveau lot prets à être stockés
              </CardDescription>
            </CardHeader>
            <CardContent>
              {lots.length === 0 ? (
                <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center bg-slate-50/50 dark:bg-slate-900/30">
                  <AlertCircle className="h-8 w-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Aucun lots après triage.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Propriétaire / Société</TableHead>
                      <TableHead>Grade / Qualité</TableHead>
                      <TableHead className="text-right sticky right-0 bg-sidebar shadow-2xl">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lots?.map((lot) => (
                      <TableRow key={lot.id}>

                        <TableCell>
                          <div className="flex flex-col gap-0.5">
                            <span className="font-medium text-slate-800 dark:text-slate-200">
                              {lot?.societe}
                            </span>
                            {lot?.sdls && lot?.sdls?.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {lot?.sdls?.map((sdl) => (
                                  <span
                                    key={sdl}
                                    className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded"
                                  >
                                    {sdl}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1.5">
                            {lot?.grades &&
                              Object.keys(lot?.grades).map((grade) => (
                                <Badge
                                  key={grade}
                                  variant="secondary"
                                  className="text-xs bg-secondary/10 text-secondary dark:bg-secondary/30 dark:text-secondary dark:border-secondary/30"
                                >
                                  {grade}
                                </Badge>
                              ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-right sticky right-0 bg-background shadow-2xl border-l border-slate-200 dark:border-slate-800">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel className="text-muted-foreground font-normal text-xs">
                                Actions
                              </DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => onViewDetails(lot)}
                              >
                                Détails
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleOpenStocking(lot)}
                                className="text-primary"
                              >
                                <PackageCheck className="h-3.5 w-3.5 text-primary" /> Stocker
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              <PaginationContent />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="password">
          <Card className="shadow-xs dark:bg-slate-950 border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <PackageCheck className="h-5 w-5 text-primary" /> Lots Stockés
              </CardTitle>
              <CardDescription>
                Liste des lots de café finalisés, étiquetés et disponibles en entrepôt.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {lots.length === 0 ? (
                <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center bg-slate-50/50 dark:bg-slate-900/30">
                  <AlertCircle className="h-8 w-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Aucun lot stocké pour le moment
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Numero lot</TableHead>
                      <TableHead>Propriétaire / Société</TableHead>
                      <TableHead>Grade / Qualité</TableHead>
                      <TableHead className="text-right">Nombre de Sacs</TableHead>
                      <TableHead>Date de Stockage</TableHead>
                      <TableHead className="text-right sticky right-0 bg-sidebar shadow-2xl">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lots?.map((lot) => (
                      <TableRow key={lot.id}>
                        <TableCell className="text-right font-semibold text-slate-900 dark:text-white">
                          {lot.lotNumbers}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-0.5">
                            <span className="font-medium text-slate-800 dark:text-slate-200">
                              {lot?.societe}
                            </span>
                            {lot?.sdls && lot?.sdls?.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {lot?.sdls?.map((sdl) => (
                                  <span
                                    key={sdl}
                                    className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded"
                                  >
                                    {sdl}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1.5">
                            {lot?.grades &&
                              Object.keys(lot?.grades).map((grade) => (
                                <Badge
                                  key={grade}
                                  variant="secondary"
                                  className="text-xs bg-secondary/10 text-secondary dark:bg-secondary/30 dark:text-secondary dark:border-secondary/30"
                                >
                                  {grade}
                                </Badge>
                              ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-semibold text-slate-900 dark:text-white">
                          {lot.nombreSacs ?? "—"}
                        </TableCell>
                        <TableCell className="text-slate-600 dark:text-slate-400 whitespace-nowrap">
                          {lot.dateStockage || "—"}
                        </TableCell>
                        <TableCell className="text-right sticky right-0 bg-background shadow-2xl border-l border-slate-200 dark:border-slate-800">
                          <>
                            {/* 1. LE MENU DROPDOWN UNIQUE */}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal />
                                </Button>
                              </DropdownMenuTrigger>

                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel className="text-muted-foreground font-normal text-xs">
                                  Actions
                                </DropdownMenuLabel>

                                {/* Option Détails */}
                                <DropdownMenuItem onClick={() => handleViewDetailsStock(lot)}>
                                  Détails
                                </DropdownMenuItem>

                                {/* CORRECTION : L'item Echantillonner est un simple frère direct de "Détails" */}
                                <DropdownMenuItem
                                  onClick={() => handleOpenEchantillonner(lot)}
                                  className="text-primary cursor-pointer"
                                >
                                  Echantillonner
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>

                            {/* 2. EN DEHORS DU DROPDOWN : Le formulaire s'affiche de manière indépendante */}
                            {openEchantillonner && (
                              <InputForm
                                lotData={DataStockage}
                                onClose={() => {
                                  setOpenEchantillonner(false);
                                  setDataStockage([]);
                                }}
                              />
                            )}
                          </>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              <PaginationContent />
            </CardContent>
          </Card>
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
                </SelectContent>
              </Select>
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
