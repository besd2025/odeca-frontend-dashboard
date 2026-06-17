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
  const handleViewDetailsStock = (lot) => {
    setIsViewingDetailsStock(true);
  };

  const handleLotChange = (value) => {
    setLotsExistants(value);
    console.log("lotsExistants : ", lotsExistants);
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
  const handleConfirmStocking = (e) => {
    e.preventDefault();
    if (!lotsExistants) {
      toast.error(`Veuillez sélectionner un lot existant.`);
      return;
    }
    console.log("lotsExistants : ", lotsExistants);
    console.log("checkedTries : ", checkedTries);
    console.log("checkedNonRequisTries : ", checkedNonRequisTries);
    // console.log("quantities : ", quantities);
    if (checkedTries?.length === 0 && checkedNonRequisTries?.length === 0) {
      toast.error(`Veuillez sélectionner au moins une qualité.`);
      return;
    }

    else {

      const selectedItems = formData
        .filter((g) => checkedTries[g.production_id] === true)
        .reduce((acc, g) => {
          const id = g.production_id;

          // Somme par id unique
          acc[id] = (acc[id] || 0) + g.nombre_sacs_restant;

          return acc;
        }, {});

      // optionnel : revenir à une liste d’objets
      const selectedItemsList = Object.entries(selectedItems).map(([production_id, sacs]) => ({
        production_id: Number(production_id),
        qualite: null,          // car qualite n'est plus unique si plusieurs lignes existent
        sacs_a_stocker: sacs,



      }));
      const selectedNonRequisItems = formData
        .filter((g) => checkedNonRequisTries[g.production_id] === true)
        .reduce((acc, g) => {
          const id = g.production_id;

          // Somme par id unique
          acc[id] = (acc[id] || 0) + g.nombre_sacs_restant;

          return acc;
        }, {});

      // optionnel : revenir à une liste d’objets
      const selectedNonRequisItemsList = Object.entries(selectedNonRequisItems).map(([production_id, sacs]) => ({
        production_id: Number(production_id),
        qualite: null,          // car qualite n'est plus unique si plusieurs lignes existent
        sacs_a_stocker: sacs,
      }));

      // total global (si tu le veux)
      const totalNonRequisSacs = selectedNonRequisItemsList.reduce((sum, item) => sum + item.sacs_a_stocker, 0);
      const totalSacs = selectedItemsList.reduce((sum, item) => sum + item.sacs_a_stocker, 0);
      const total = Object.values(quantitiesSelected).reduce((sum, n) => sum + Number(n), 0);

      if (totalSacs + totalNonRequisSacs < total) {
        toast.error(`La quantité à stocker est supérieure au nombre de sacs disponibles.`);
        return;
      }
      else {


        if (Object.values(checkedTries).includes(true)) {
          const productIds = Object.keys(quantitiesSelected); // Récupère ["1", "4", "6"]

          productIds.map(async (item) => {
            // item vaut successivement "1", puis "4", puis "6"
            const idProduction = Number(item); // Convertit la clé en nombre (1, 4, 6)
            const nombreSacs = quantitiesSelected[item]; // Récupère la valeur associée (3000, 20, 500)
            try {
              const promise = new Promise(async (resolve, reject) => {
                try {
                  const results = await fetchData(
                    "post",
                    `cafe/prestockage_apres_triage/`,
                    {
                      params: {},
                      additionalHeaders: {},
                      body: {
                        "nombre_sacs": nombreSacs,
                        "stockage": lotsExistants,
                        "apres_triage": idProduction
                      },
                    },
                  );

                  if (results.status == 200 || results.status == 201) {

                    resolve({ lot: lotsExistants });
                  } else {
                    reject(new Error("Erreur"));
                  }

                }
                catch (error) {
                  reject(error);
                }
              });

              toast.promise(promise, {
                loading: "Modification...",
                success: (data) => {
                  //onSave(data.lot, finalizedData);
                  setTimeout(() => setOpen(false), 500);
                  return `Données Enregistrées avec succès `;
                },
                error: "Donnée non enregistrée!!!",
              });

              try {
                promise;
              } catch (error) {
                console.error(error);
                setError(error);
              } finally {
                setLoading(false);
              }
            }
            catch (err) {
              console.error("Error loading initial data:", err);
            }

          })

        }
        if (checkedNonRequisTries?.length > 0 && !Object.values(checkedTries).includes(true)) {
          const productIds = Object.keys(nonRequisQuantity); // Récupère ["1", "4", "6"]

          productIds.map(async (item) => {
            // item vaut successivement "1", puis "4", puis "6"
            const idProduction = Number(item); // Convertit la clé en nombre (1, 4, 6)
            const nombreSacs = nonRequisQuantity[item];
            console.log("nombreSacs : ", nombreSacs);
            // Récupère la valeur associée (3000, 20, 500)
            // try {
            //   const promise = new Promise(async (resolve, reject) => {
            //     try {
            //       const results = await fetchData(
            //         "post",
            //         `cafe/prestockage_apres_triage/`,
            //         {
            //           params: {},
            //           additionalHeaders: {},
            //           body: {
            //             "nombre_sacs": nombreSacs,
            //             "stockage": lotsExistants,
            //             "apres_triage": idProduction
            //           },
            //         },
            //       );

            //       if (results.status == 200 || results.status == 201) {

            //         resolve({ lot: lotsExistants });
            //       } else {
            //         reject(new Error("Erreur"));
            //       }

            //     }
            //     catch (error) {
            //       reject(error);
            //     }
            //   });

            //   toast.promise(promise, {
            //     loading: "Modification...",
            //     success: (data) => {
            //       //onSave(data.lot, finalizedData);
            //       setTimeout(() => setOpen(false), 500);
            //       return `Données Enregistrées avec succès `;
            //     },
            //     error: "Donnée non enregistrée!!!",
            //   });

            //   try {
            //     promise;
            //   } catch (error) {
            //     console.error(error);
            //     setError(error);
            //   } finally {
            //     setLoading(false);
            //   }
            // }
            // catch (err) {
            //   console.error("Error loading initial data:", err);
            // }

          })

        }
        else {
          console.log("Mise en Stock des lots requis et non requis : ");
        }
      }
    }




    // if (onStockGrade) {
    //   console.log(stockingGrade.id || stockingGrade.lotId, stockingGrade.grades || stockingGrade.grade, bags, lotNumbers);
    //   onStockGrade(stockingGrade.id || stockingGrade.lotId, stockingGrade.grades || stockingGrade.grade, bags, lotNumbers);
    // }
    // setStockingGrade(null);
  };

  const fetchLots = async () => {

    try {
      if (activeTab === "account") {


        const lotsData = await fetchData("get", `cafe/stock_cafe/get_qualites_pretes_stockage/`, { params: { limit: 10000, offset: 0 } });
        console.log("lotsData : ", lotsData);
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
          console.log("item : ", item);
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
                                onClick={() => handleViewDetailsStock(lot)}
                              >
                                Détails
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
