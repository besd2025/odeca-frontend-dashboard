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
  const [activeTab, setActiveTab] = React.useState("Prêt à trier");
  const [stockingGrade, setStockingGrade] = React.useState(null);
  const [bagsToStock, setBagsToStock] = React.useState("");
  const [lotNumbers, setLotNumbers] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [receptionsAllList, setReceptionsAllList] = React.useState([]);
  const [totalCount, setTotalCount] = React.useState(0);
  const [pointer, setPointer] = React.useState(0);
  const [limit, setLimit] = React.useState(10);

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
        console.log("pendingRes", pendingRes)
        const pendingMapped = pendingRes?.results?.map((item) => {
          const processedGrades = Array.isArray(item?.productions)
            ? item.productions.reduce((acc, curr) => {
              acc[curr.nom_qualite || `Qualité ${curr.qualite || 'Inconnue'}`] = {
                nombre_sacs: curr.nombre_sacs,
                triage_id: curr.id_triage,
                production_id: curr.id,
              };
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
            status: "Prêt à trier",
            taxationQuantities: processedGrades,
            remainingQuantities: processedGrades,
          };
        }) || [];
        setReceptionsAllList(pendingMapped);

        setTotalCount((pendingRes?.count || 0));
      } else if (tab === "En cours de triage") {
        const pendingRes = await fetchData("get", `cafe/triage/get_en_cours_triage/`, { params: { limit, offset: pointer } });
        const pendingMapped = pendingRes?.results?.map((item) => {
          return {
            id: item.id,
            societe: item.nom_societe,
            grades: item?.qualite,
            dateEntree: new Date(item?.debut_triage).toLocaleDateString(),
            //dateSortie: new Date(item?.fin_triage).toLocaleDateString() || "-",
            status: "En cours de triage",
            quantite_trie: item?.quantite_sortie,
            nombre_sacs: item?.nombre_sacs,
          };
        }) || [];
        setReceptionsAllList(pendingMapped);
        setTotalCount((pendingRes?.count || 0));
      } else if (tab === "Trié & Stocké") {
        const confirmedRes = await fetchData("get", `cafe/triage/get_termine_triage/`, { params: { limit, offset: pointer } });
        const confirmedMapped = confirmedRes?.results?.map((item) => {
          return {
            id: item.id,
            societe: item.nom_societe,
            grades: item?.qualite,
            dateEntree: new Date(item?.debut_triage).toLocaleDateString(),
            //dateSortie: new Date(item?.fin_triage).toLocaleDateString() || "-",
            status: "Trié & Stocké",
            quantite_trie: item?.quantite_sortie,
            nombre_sacs: item?.nombre_sacs,
          };
        }) || [];
        console.log(confirmedRes);
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
    lot.status === "Trié & Stocké" || lot.status === "Trié & Tri non requis" || lot.status === "TRIE_STOCKE";
  const isInProgress = (lot) => lot.status === "En cours de triage" || lot.status === "EN_COURS_TRIAGE";
  const isReady = (lot) => lot.status === "Prêt à trier" || lot.status === "PRET A TRIER";

  const [pretTriageNbr, setPretTriageNbr] = React.useState(0);
  const [encoursTriageNbr, setEncoursTriageNbr] = React.useState(0);
  const [finaliseTriageNbr, setFinaliseTriageNbr] = React.useState(0);

  const handleLoadPretTriageNbr = async () => {
    try {
      const res = await fetchData("get", `cafe/usinages/get_pret_pour_triage/`, { params: { pret_triage: "PRET_TRIAGE" } });
      setPretTriageNbr(res?.count || 0);
    } catch (error) {
      console.error("Error loading pret triage nbr:", error);
    }
  };

  const handleLoadEncoursTriageNbr = async () => {
    try {
      const res = await fetchData("get", `cafe/triage/get_en_cours_triage/`, { params: { encours_triage: "EN_COURS_TRIAGE" } });
      setEncoursTriageNbr(res?.count || 0);
    } catch (error) {
      console.error("Error loading encours triage nbr:", error);
    }
  };

  const handleLoadFinaliseTriageNbr = async () => {
    try {
      const res = await fetchData("get", `cafe/triage/get_termine_triage/`, { params: { finalise_triage: "TERMINE" } });
      setFinaliseTriageNbr(res?.count || 0);
    } catch (error) {
      console.error("Error loading finalise triage nbr:", error);
    }
  };

  React.useEffect(() => {
    handleLoadPretTriageNbr();
    handleLoadEncoursTriageNbr();
    handleLoadFinaliseTriageNbr();
  }, []);

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
              {/* <TabsTrigger value="all" className="flex items-center gap-1.5 px-3 py-1 text-xs md:text-sm">
                <Layers className="h-3.5 w-3.5 text-slate-500" />
                <span>Tous ({lots.length})</span>
              </TabsTrigger> */}
              <TabsTrigger value="Prêt à trier" className="flex items-center gap-1.5 px-3 py-1 text-xs md:text-sm">
                <ClipboardList className="h-3.5 w-3.5 text-blue-500" />
                <span>Prêt à trier ({pretTriageNbr})</span>
              </TabsTrigger>
              <TabsTrigger value="En cours de triage" className="flex items-center gap-1.5 px-3 py-1 text-xs md:text-sm">
                <Play className="h-3.5 w-3.5 text-amber-500" />
                <span>En cours de triage ({encoursTriageNbr})</span>
              </TabsTrigger>
              <TabsTrigger value="Trié & Stocké" className="flex items-center gap-1.5 px-3 py-1 text-xs md:text-sm">
                <CheckCircle2 className="h-3.5 w-3.5 text-indigo-500" />
                <span>Trié ({finaliseTriageNbr})</span>
              </TabsTrigger>
              {/* <TabsTrigger value="Trié & Tri non requis" className="flex items-center gap-1.5 px-3 py-1 text-xs md:text-sm">
                <PackageCheck className="h-3.5 w-3.5 text-violet-500" />
                <span>Tri non requis ({lots.filter(l => l.status === "Trié & Tri non requis").length})</span>
              </TabsTrigger>
              <TabsTrigger value="pret_a_stocker" className="flex items-center gap-1.5 px-3 py-1 text-xs md:text-sm">
                <PackageCheck className="h-3.5 w-3.5 text-violet-500" />
                <span>Pret a stocker ({pretAStockerGrades.length})</span>
              </TabsTrigger> */}
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
                {activeTab === "Prêt à trier" && <TableHead>Grade / Poids Initial</TableHead>}
                {activeTab === "En cours de triage" || activeTab === "Trié & Stocké" && <TableHead>Quantités à trier</TableHead>}
                {activeTab === "En cours de triage" && <TableHead>Date Entrée</TableHead>}
                {activeTab === "Trié & Stocké" && <TableHead>Date Sortie</TableHead>}
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
                  {activeTab === "Prêt à trier" && <TableCell>
                    <div className="flex flex-col gap-1">
                      {lot.grades && Object.entries(lot.grades).map(([grade, qty]) => (
                        <div key={grade} className="text-xs flex items-center gap-1.5">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {grade}:
                          </span>
                          <span className="text-slate-600 dark:text-slate-400">{qty?.nombre_sacs ?? qty} sacs</span>
                        </div>
                      ))}
                    </div>
                  </TableCell>}
                  {activeTab === "En cours de triage" || activeTab === "Trié & Stocké" && <TableCell>
                    <div className="flex flex-col gap-1">
                      <div key={lot.id} className="text-xs flex items-center gap-1.5">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {lot.quantite_trie} kg / {lot.nombre_sacs} sacs
                        </span>
                      </div>

                    </div>
                  </TableCell>}

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
        <PaginationContent
          currentPage={Math.floor(pointer / limit) + 1}
          totalPages={Math.ceil(totalCount / limit)}
          totalCount={totalCount}
          pointer={pointer}
          limit={limit}
          onPageChange={(page) => setPointer((page - 1) * limit)}
          onLimitChange={(newLimit) => {
            setLimit(newLimit);
            setPointer(0);
          }}
        />
      </CardContent>


    </Card>
  );
}

