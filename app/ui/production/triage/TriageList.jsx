import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Eye,
  ClipboardList,
  AlertCircle,
  CheckCircle2,
  PackageCheck,
  Play,
  Tag,
  MoreHorizontal,
  Layers,
} from "lucide-react";
import PaginationContent from "@/components/ui/pagination-content";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StockageForm from "../stockage/StockageForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import { fetchData } from "@/app/_utils/api";
// Status helpers
const STATUS_CONFIG = {
  "Prêt à trier": {
    badge: (
      <Badge
        variant="outline"
        className="border-blue-200 bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800 flex items-center gap-1 whitespace-nowrap"
      >
        <ClipboardList className="h-3 w-3" />
        Prêt à trier
      </Badge>
    ),
  },
  "En cours de triage": {
    badge: (
      <Badge
        variant="outline"
        className="border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800 flex items-center gap-1 whitespace-nowrap"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
        </span>
        En cours de triage
      </Badge>
    ),
  },
  "Trié & Stocké": {
    badge: (
      <Badge
        variant="outline"
        className="border-secondary/20 bg-secondary/10 text-secondary dark:bg-secondary/30 dark:text-secondary dark:border-secondary/30 flex items-center gap-1 whitespace-nowrap"
      >
        <CheckCircle2 className="h-3.5 w-3.5" />
        Trié & Stocké
      </Badge>
    ),
  },
  "Trié & Tri non requis": {
    badge: (
      <Badge
        variant="outline"
        className="border-secondary/20 bg-secondary/10 text-secondary dark:bg-secondary/30 dark:text-secondary dark:border-secondary/30 flex items-center gap-1 whitespace-nowrap"
      >
        <PackageCheck className="h-3.5 w-3.5" />
        Tri non requis
      </Badge>
    ),
  },
};

export default function TriageList({ lots, onStartTriage, onLabelDirect, onFinalize, onViewDetails, onStockGrade }) {
  const [activeTab, setActiveTab] = React.useState("all");
  const [stockingGrade, setStockingGrade] = React.useState(null);
  const [bagsToStock, setBagsToStock] = React.useState("");
  const [lotNumbers, setLotNumbers] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [receptionsAllList, setReceptionsAllList] = React.useState([]);
  const [totalCount, setTotalCount] = React.useState(0);
  const [pointer, setPointer] = React.useState(0);
  const [limit, setLimit] = React.useState(20);

  const getPretAStockerGrades = (lotsList) => {
    const list = [];
    lotsList.forEach((lot) => {
      if (lot.status === "Trié & Stocké" || lot.status === "Trié & Tri non requis") {
        const sourceQuantities = lot.status === "Trié & Stocké" ? lot.taxationQuantities : lot.grades;
        const remaining = lot.remainingQuantities !== undefined ? lot.remainingQuantities : { ...sourceQuantities };

        if (remaining) {
          Object.entries(remaining).forEach(([grade, qty]) => {
            const bags = parseInt(qty) || 0;
            if (bags > 0) {
              list.push({
                lotId: lot.id,
                societe: lot.societe,
                grade,
                bags,
                type: lot.status === "Trié & Stocké" ? "Trié" : "Direct",
                originalLot: lot
              });
            }
          });
        }
      }
    });
    return list;
  };

  const pretAStockerGrades = getPretAStockerGrades(lots);

  const handleOpenStocking = (gradeItem) => {
    setStockingGrade(gradeItem);
    setBagsToStock(gradeItem.bags.toString());
    const numLots = Math.ceil(gradeItem.bags / 320);
    setLotNumbers(Array(numLots).fill(""));
  };

  const handleBagsChange = (val) => {
    setBagsToStock(val);
    const bags = parseInt(val) || 0;
    if (bags > 0) {
      const numLots = Math.ceil(bags / 320);
      setLotNumbers((prev) => {
        const next = [...prev];
        if (next.length < numLots) {
          while (next.length < numLots) next.push("");
        } else if (next.length > numLots) {
          next.length = numLots;
        }
        return next;
      });
    } else {
      setLotNumbers([]);
    }
  };

  const handleConfirmStocking = (e) => {
    e.preventDefault();
    if (!stockingGrade) return;

    const bags = parseInt(bagsToStock) || 0;
    if (bags <= 0 || bags > stockingGrade.bags) {
      toast.error(`Veuillez saisir une quantité valide entre 1 et ${stockingGrade.bags} sacs.`);
      return;
    }

    const numLots = Math.ceil(bags / 320);
    for (let i = 0; i < numLots; i++) {
      if (!lotNumbers[i] || !lotNumbers[i].trim()) {
        toast.error(`Veuillez renseigner le numéro de lot pour le Lot #${i + 1}.`);
        return;
      }
    }

    if (onStockGrade) {
      onStockGrade(stockingGrade.lotId, stockingGrade.grade, bags, lotNumbers);
    }
    setStockingGrade(null);
  };

  const filteredLots = lots.filter((lot) => {
    if (activeTab === "all") return true;
    if (activeTab === "pret_a_stocker") return false;
    return lot.status.toLowerCase() === activeTab.toLowerCase();
  });

  const loadDataForTab = async (tab) => {
    setLoading(true);
    try {
      if (tab === "Prêt à trier") {
        const pendingRes = await fetchData("get", `cafe/usinages/get_pret_pour_triage/`, { params: { limit, offset: pointer } });
        const pendingMapped = pendingRes?.results?.map((item) => {
          const processedGrades = Array.isArray(item?.productions)
            ? item.productions.reduce((acc, curr) => {
              acc[curr.nom_qualite || `Qualité ${curr.qualite || 'Inconnue'}`] = curr.nombre_sacs;
              return acc;
            }, {})
            : (item?.productions || {});

          return {
            id: item.id,
            societe: item.nom_societe,
            sdls: [],
            grades: processedGrades,
            dateEntree: new Date(item?.date_debut).toLocaleDateString(),
            dateSortie: new Date(item?.date_fin).toLocaleDateString(),
            status: "PRET A TRIER",
            taxationQuantities: processedGrades,
            remainingQuantities: processedGrades,
          };
        }) || [];
        console.log("pendingMapped", pendingRes);
        setReceptionsAllList(pendingMapped);

        setTotalCount((pendingRes?.count || 0));
      } else if (tab === "En cours") {
        const pendingRes = await fetchData("get", `cafe/transfert_sdl_usine_detail_comfimation/get_transfert_comfirmed_par_societe/`, { params: { etat_selection: "EN_COURS", limit, offset: pointer } });
        const pendingMapped = pendingRes?.results?.map((item) => {
          const sdlsData = item?.transfert_details_comfirmation || [];
          return {
            id: item?.id,
            code_societe: item?.code_societe || "",
            societe: item?.nom_societe || "",
            sdls: sdlsData.map(d => d.sdl_nom || d.id || d).filter(v => typeof v === 'string' || typeof v === 'number'),
            grades: {},
            dateTransfert: item?.transfer_date || "-",
            dateReception: "-",
            usinageQuantitiesTotal: item?.total_quantite_confirme || 0,
            status: item?.pret_usine || "",
          };
        }) || [];
        setReceptionsAllList(pendingMapped);
        setTotalCount(pendingRes?.count || 0);
      } else if (tab === "Finalisé") {
        const confirmedRes = await fetchData("get", `cafe/usinages/`, { params: { processing_status: "TERMINE", limit, offset: pointer } });
        const confirmedMapped = confirmedRes?.results?.map((item) => {
          const sdlsData = item?.transfert_details_comfirmation || [];
          const processedGrades = Array.isArray(item?.productions)
            ? item.productions.reduce((acc, curr) => {
              acc[curr.nom_qualite || `Qualité ${curr.qualite || 'Inconnue'}`] = curr.nombre_sacs;
              return acc;
            }, {})
            : (item?.productions || {});

          return {
            id: item?.id,
            code_societe: item?.societe || "",
            societe: item?.nom_societe || "",
            sdls: sdlsData.map(d => d.sdl_nom || d.id || d).filter(v => typeof v === 'string' || typeof v === 'number'),
            grades: processedGrades,
            dateSortie: new Date(item?.date_fin).toLocaleDateString() || "-",
            dateUsinage: new Date(item?.date_debut).toLocaleDateString() || "-",
            usinageQuantitiesTotal: item?.quantite_total || 0,
            status: item?.processing_status || "",
          };
        }) || [];
        setReceptionsAllList(confirmedMapped);
        setTotalCount(confirmedRes?.count || 0);
      }
    } catch (error) {
      console.error(`Error fetching data for tab ${tab}:`, error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadDataForTab(activeTab);
  }, [activeTab, pointer, limit]);







  const isStocked = (lot) =>
    lot.status === "Trié & Stocké" || lot.status === "Trié & Tri non requis";
  const isInProgress = (lot) => lot.status === "En cours de triage";
  const isReady = (lot) => lot.status === "Prêt à trier";

  return (
    <Card className="shadow-xs dark:bg-slate-950 border-slate-200 dark:border-slate-800">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-primary" /> Suivi des Lots de Triage
        </CardTitle>
        <CardDescription>
          Liste des lots prêts à trier, en cours de triage et étiquetés/stockés.
        </CardDescription>
        {/* <StockageForm /> */}
      </CardHeader>
      <CardContent className="space-y-4">
        {lots.length > 0 && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="flex w-full overflow-x-auto justify-start h-10 p-1 bg-slate-100 dark:bg-slate-900 select-none mb-4 gap-1">
              <TabsTrigger value="all" className="flex items-center gap-1.5 px-3 py-1 text-xs md:text-sm">
                <Layers className="h-3.5 w-3.5 text-slate-500" />
                <span>Tous ({lots.length})</span>
              </TabsTrigger>
              <TabsTrigger value="Prêt à trier" className="flex items-center gap-1.5 px-3 py-1 text-xs md:text-sm">
                <ClipboardList className="h-3.5 w-3.5 text-blue-500" />
                <span>Prêt à trier ({receptionsAllList?.filter(l => l.status === "PRET A TRIER").length})</span>
              </TabsTrigger>
              <TabsTrigger value="En cours de triage" className="flex items-center gap-1.5 px-3 py-1 text-xs md:text-sm">
                <Play className="h-3.5 w-3.5 text-amber-500" />
                <span>En cours de triage ({lots.filter(l => l.status === "En cours de triage").length})</span>
              </TabsTrigger>
              <TabsTrigger value="Trié & Stocké" className="flex items-center gap-1.5 px-3 py-1 text-xs md:text-sm">
                <CheckCircle2 className="h-3.5 w-3.5 text-indigo-500" />
                <span>Trié ({lots.filter(l => l.status === "Trié & Stocké").length})</span>
              </TabsTrigger>
              <TabsTrigger value="Trié & Tri non requis" className="flex items-center gap-1.5 px-3 py-1 text-xs md:text-sm">
                <PackageCheck className="h-3.5 w-3.5 text-violet-500" />
                <span>Tri non requis ({lots.filter(l => l.status === "Trié & Tri non requis").length})</span>
              </TabsTrigger>
              <TabsTrigger value="pret_a_stocker" className="flex items-center gap-1.5 px-3 py-1 text-xs md:text-sm">
                <PackageCheck className="h-3.5 w-3.5 text-violet-500" />
                <span>Pret a stocker ({pretAStockerGrades.length})</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}


        {activeTab === "pret_a_stocker" ? (
          pretAStockerGrades.length === 0 ? (
            <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center bg-slate-50/50 dark:bg-slate-900/30">
              <AlertCircle className="h-8 w-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Aucun grade prêt à stocker pour le moment. Finalisez un triage ou marquez un lot pour stockage direct.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code Lot d'Origine</TableHead>
                  <TableHead>Société / Propriétaire</TableHead>
                  <TableHead>Grade / Qualité</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Sacs Disponibles</TableHead>
                  <TableHead className="text-right sticky right-0 bg-sidebar shadow-2xl">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {receptionsAllList.map((item, idx) => (
                  console.log("item", item),
                  <TableRow key={`${item.lotId}-${item.grade}-${idx}`} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                    <TableCell className="font-bold text-slate-900 dark:text-white whitespace-nowrap">
                      {item.lotId}
                    </TableCell>
                    <TableCell className="font-medium text-slate-800 dark:text-slate-200">
                      {item.societe}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                        {item.grade}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={item.type === "Trié" ? "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400" : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"}>
                        {item.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-bold text-slate-900 dark:text-white">
                      {item.bags} sacs
                    </TableCell>
                    <TableCell className="text-right sticky right-0 bg-background shadow-2xl border-l border-slate-200 dark:border-slate-800">
                      <Button
                        size="sm"
                        className="bg-primary text-white hover:bg-primary/95 text-xs h-8 flex items-center gap-1.5 ml-auto"
                        onClick={() => handleOpenStocking(item)}
                      >
                        <PackageCheck className="h-3.5 w-3.5" /> Stocker
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )
        ) : lots.length === 0 ? (
          <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center bg-slate-50/50 dark:bg-slate-900/30">
            <AlertCircle className="h-8 w-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Aucun lot à trier pour le moment. Les lots finalisés en usinage apparaissent ici.
            </p>
          </div>
        ) : filteredLots.length === 0 ? (
          <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center bg-slate-50/50 dark:bg-slate-900/30">
            <AlertCircle className="h-8 w-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Aucun lot avec le statut "{activeTab}" pour le moment.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code Lot</TableHead>
                <TableHead>Société & SDLs</TableHead>
                <TableHead>Grade / Poids Initial</TableHead>
                <TableHead>Date Entrée</TableHead>
                <TableHead>Date Sortie</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right sticky right-0 bg-sidebar shadow-2xl">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {receptionsAllList.map((lot) => (
                <TableRow key={lot.id}>
                  {/* Code Lot */}
                  <TableCell className="font-bold text-slate-900 dark:text-white whitespace-nowrap">
                    {lot.id}
                  </TableCell>

                  {/* Société & SDLs */}
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {lot.societe}
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {lot.sdls?.map((sdl) => (
                          <span
                            key={sdl}
                            className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded"
                          >
                            {sdl}
                          </span>
                        ))}
                      </div>
                    </div>
                  </TableCell>

                  {/* Grade / Poids */}
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {lot.grades && Object.entries(lot.grades).map(([grade, qty]) => (
                        <div key={grade} className="text-xs flex items-center gap-1.5">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {grade}:
                          </span>
                          <span className="text-slate-600 dark:text-slate-400">{qty} sacs</span>
                        </div>
                      ))}
                    </div>
                  </TableCell>

                  {/* Date Entrée */}
                  <TableCell className="text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    {lot.dateEntree || <span className="text-slate-400">—</span>}
                  </TableCell>

                  {/* Date Sortie */}
                  <TableCell className="text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    {lot.dateSortie || <span className="text-slate-400">—</span>}
                  </TableCell>

                  {/* Statut */}
                  <TableCell>
                    {STATUS_CONFIG[lot.status]?.badge ?? (
                      <Badge variant="outline">{lot.status}</Badge>
                    )}
                  </TableCell>

                  {/* Actions */}
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
                        {isStocked(lot) ? (
                          <DropdownMenuItem>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onViewDetails(lot)}
                              className="h-8 text-xs flex items-center gap-1.5 w-full"
                            >
                              <Eye className="h-3.5 w-3.5" /> Détails
                            </Button>
                          </DropdownMenuItem>
                        ) : isInProgress(lot) ? (
                          <DropdownMenuItem>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => onFinalize(lot)}
                              className="h-8 text-xs  flex items-center gap-1.5 w-full"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5 text-white" /> Finaliser le triage
                            </Button>
                          </DropdownMenuItem>
                        ) : isReady(lot) ? (
                          <DropdownMenuItem>
                            <div className="flex flex-col gap-2">
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => onStartTriage(lot)}
                                className="h-8 text-xs flex items-center gap-1.5"
                              >
                                <Play className="h-3.5 w-3.5 text-white" /> Trier
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onLabelDirect(lot)}
                                className="h-8 text-xs flex items-center gap-1.5"
                              >
                                <Tag className="h-3.5 w-3.5" /> Tri non requis
                              </Button>
                            </div>
                          </DropdownMenuItem>
                        ) : null}

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
                <div><span className="font-semibold text-primary">Lot d'origine:</span> {stockingGrade.lotId}</div>
                <div><span className="font-semibold text-primary">Société:</span> {stockingGrade.societe}</div>
                <div><span className="font-semibold text-primary">Grade:</span> {stockingGrade.grade}</div>
                <div><span className="font-semibold text-primary">Sacs disponibles:</span> {stockingGrade.bags} sacs</div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">Nombre de sacs à stocker</Label>
                <Input
                  type="number"
                  min="1"
                  max={stockingGrade.bags}
                  value={bagsToStock}
                  onChange={(e) => handleBagsChange(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {lotNumbers.map((_, i) => {
                  const bags = parseInt(bagsToStock) || 0;
                  const bagsForThisLot = (i === lotNumbers.length - 1) ? (bags % 320 || 320) : 320;
                  const isComplete = bagsForThisLot === 320;
                  return (
                    <div key={i} className="space-y-1.5 border border-slate-100 dark:border-slate-800 p-2.5 rounded-lg bg-slate-50/50 dark:bg-slate-900/20">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          Lot #{i + 1} ({bagsForThisLot} sacs)
                        </span>
                        <Badge variant="outline" className={isComplete ? "border-emerald-200 bg-emerald-50 text-emerald-700 text-[10px]" : "border-amber-200 bg-amber-50 text-amber-700 text-[10px]"}>
                          {isComplete ? "Complet" : "Incomplet"}
                        </Badge>
                      </div>
                      <Label htmlFor={`lot-num-${i}`} className="text-xs text-slate-500">Numéro de Lot</Label>
                      <Input
                        id={`lot-num-${i}`}
                        value={lotNumbers[i] || ""}
                        onChange={(e) => {
                          const newNums = [...lotNumbers];
                          newNums[i] = e.target.value;
                          setLotNumbers(newNums);
                        }}
                        placeholder={`Saisir le numéro du lot #${i + 1}`}
                        required
                        className="h-8 text-xs bg-transparent"
                      />
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <Button variant="outline" type="button" onClick={() => setStockingGrade(null)} size="sm">
                  Annuler
                </Button>
                <Button type="submit" className="bg-primary text-white" size="sm">
                  Enregistrer
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}

