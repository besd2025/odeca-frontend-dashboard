"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Scroll, Clipboard, CheckCircle, Search, FileText, ArrowRight, Printer, AlertTriangle, Undo2, Award, Scale, HelpCircle, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchData } from "@/app/_utils/api";
import PaginationContent from "@/components/ui/pagination-content";

// ==========================================
// MOCKED DATA (ILLUSTRATION POUR LE DESIGN)
// ==========================================
const initialLabAnalyses = [
  {
    id: "LAB-ANA-1",
    sampleId: "ECH-2026-001",
    transfertEchantillon: "Par coursier Ngozi",
    lotNumber: "LOT-2026-001",
    qteEchantillon: 15.0,
    sacsCount: 150,
    societe: "COCOCA",
    deparcheur: "Usine Ngozi SOGESTAL",
    receptionniste: "Marc Ndayishimiye",
    codeEtiquette: "LAB-ETQ-26-001-5821",
    dateReception: "2026-05-28",
    status: "receptionne"
  },
  {
    id: "LAB-ANA-2",
    sampleId: "ECH-2026-002",
    transfertEchantillon: "Chauffeur ODECA",
    lotNumber: "LOT-2026-002",
    qteEchantillon: 24.5,
    sacsCount: 200,
    societe: "KAWASE COFFEE",
    deparcheur: "Usine Gitega SOGESTAL",
    receptionniste: "Jean-Marie Vianney",
    codeEtiquette: "LAB-ETQ-26-002-3941",
    dateReception: "2026-05-29",
    status: "granulometrie_complete",
    granulometrie: {
      quantite: 300,
      date: "2026-05-29",
      sieve_7_1: 45.0,
      sieve_6_3: 35.0,
      sieve_5_5: 12.0,
      sieve_4_0: 5.0,
      sieve_3_0: 2.0,
      fond: 1.0
    }
  },
  {
    id: "LAB-ANA-3",
    sampleId: "ECH-2026-003",
    transfertEchantillon: "Coursier Kayanza",
    lotNumber: "LOT-2026-003",
    qualite: "15+",
    qteEchantillon: 8.5,
    sacsCount: 85,
    societe: "KIBIRA COFFEE",
    deparcheur: "Usine Kayanza SOGESTAL",
    receptionniste: "Marc Ndayishimiye",
    codeEtiquette: "LAB-ETQ-26-003-8812",
    dateReception: "2026-05-30",
    status: "degustation_complete",
    granulometrie: {
      quantite: 300,
      date: "2026-05-30",
      sieve_7_1: 50.0,
      sieve_6_3: 30.0,
      sieve_5_5: 10.0,
      sieve_4_0: 6.0,
      sieve_3_0: 3.0,
      fond: 1.0
    },
    triage: {
      qteTrier: 300,
      date: "2026-05-30",
      vraisDefauts: 1.5,
      defectueux: 2.0,
      brisure: 0.5,
      nEtRat: 1.0,
      corpsEtrangers: 0.0,
      totalDefectPct: 5.0
    },
    degustation: {
      qteTorrefier: 200,
      observation: "Notes fruitées intenses, très bel équilibre, acidité vive.",
      nbDegustateurs: 3,
      moyenne: 85.0,
      qualite: "15+",
      dateDegustation: "2026-05-31"
    }
  },
  {
    id: "LAB-ANA-4",
    sampleId: "ECH-2026-004",
    transfertEchantillon: "Chauffeur ODECA",
    lotNumber: "LOT-2026-004",
    qteEchantillon: 12.0,
    sacsCount: 100,
    societe: "COPROCA",
    deparcheur: "Usine Ngozi SOGESTAL",
    receptionniste: "Marc Ndayishimiye",
    codeEtiquette: "LAB-ETQ-26-004-7744",
    dateReception: "2026-05-28",
    status: "finalise_taxe",
    granulometrie: {
      quantite: 300,
      date: "2026-05-28",
      sieve_7_1: 42.0,
      sieve_6_3: 38.0,
      sieve_5_5: 11.0,
      sieve_4_0: 6.0,
      sieve_3_0: 2.0,
      fond: 1.0
    },
    triage: {
      qteTrier: 300,
      date: "2026-05-28",
      vraisDefauts: 1.2,
      defectueux: 1.0,
      brisure: 0.8,
      nEtRat: 0.5,
      corpsEtrangers: 0.0,
      totalDefectPct: 3.5
    },
    degustation: {
      qteTorrefier: 200,
      observation: "Excellent corps, notes florales et agrumes bien prononcées.",
      nbDegustateurs: 3,
      moyenne: 84.5,
      qualite: "15+",
      dateDegustation: "2026-05-29"
    },
    finalizedAt: "2026-05-29T15:00:00.000Z",
    decisionNotes: "Rapport de Taxation Généré. Qualité conforme aux critères de taxation."
  }
];

export default function RapportsComponent() {
  // UI States Only
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedDetailItem, setSelectedDetailItem] = useState(null);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [activeAnalysis, setActiveAnalysis] = useState(null);

  // Return to factory Modal States
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [returnMotif, setReturnMotif] = useState("");
  const [selectedReturnItem, setSelectedReturnItem] = useState(null);

  // API Data
  const [pendingDecisions, setPendingDecisions] = useState([]);
  const [finalizedReports, setFinalizedReports] = useState([]);
  const [selectedTab, setSelectedTab] = useState("pending");
  const [searchPendingQuery, setSearchPendingQuery] = useState("");
  const [searchHistoryQuery, setSearchHistoryQuery] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pointer, setPointer] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // useEffect(() => {
  //   const fetchReportsData = async () => {
  //     if (selectedTab === "pending") {
  //       try {
  //         const response = await fetchData("get", "cafe/rapports/decisions_en_attente/", {
  //           params: { limit, offset: pointer, search: searchPendingQuery }
  //         });
  //         const data = (response?.results || []).map((item) => ({
  //           id: item.id,
  //           sampleId: item.echantillon_id,
  //           lotNumber: item.numero_lot,
  //           societe: item.societe,
  //           codeEtiquette: item.code_etiquette,
  //           dateReception: item.date_reception,
  //           status: "degustation_complete",
  //           degustation: item.cupping ? {
  //             moyenne: parseFloat(item.cupping.note_finale) || 0,
  //             qualite: item.cupping.qualite || "",
  //             dateDegustation: item.cupping.date_cupping || "",
  //           } : null,
  //         }));
  //         setPendingDecisions(data);
  //         setTotalCount(response?.count || 0);
  //       } catch (error) {
  //         console.error("Error fetching pending decisions:", error);
  //       }
  //     } else if (selectedTab === "history") {
  //       try {
  //         const response = await fetchData("get", "cafe/rapports/historique_rapports/", {
  //           params: { limit, offset: pointer, search: searchHistoryQuery }
  //         });
  //         const data = (response?.results || []).map((item) => ({
  //           id: item.id,
  //           sampleId: item.echantillon_id,
  //           lotNumber: item.numero_lot,
  //           societe: item.societe,
  //           codeEtiquette: item.code_etiquette,
  //           dateReception: item.date_reception,
  //           status: item.statut,
  //           finalizedAt: item.date_finalisation,
  //           decisionNotes: item.notes_decision || "",
  //           degustation: item.cupping ? {
  //             moyenne: parseFloat(item.cupping.note_finale) || 0,
  //             qualite: item.cupping.qualite || "",
  //             dateDegustation: item.cupping.date_cupping || "",
  //           } : null,
  //         }));
  //         setFinalizedReports(data);
  //         setTotalCount(response?.count || 0);
  //       } catch (error) {
  //         console.error("Error fetching finalized reports:", error);
  //       }
  //     }
  //   };
  //   fetchReportsData();
  // }, [selectedTab, limit, pointer, searchPendingQuery, searchHistoryQuery, refreshTrigger]);

  // Actions
  const handleGenerateTaxationReport = (item) => {
    setActiveAnalysis({
      ...item,
      status: "finalise_taxe",
      finalizedAt: new Date().toISOString(),
      decisionNotes: "Rapport de Taxation Généré. Qualité conforme aux critères de taxation.",
    });
    setIsReportOpen(true);
    toast.success(`Rapport de taxation généré pour ${item.codeEtiquette} (Illustration locale)`);
  };

  const handleReturnToFactory = (item) => {
    setSelectedReturnItem(item);
    setReturnMotif("");
    setIsReturnModalOpen(true);
  };

  const handleConfirmReturnToFactory = () => {
    toast.warning(`Échantillon ${selectedReturnItem?.codeEtiquette} renvoyé à l'usine avec le motif : ${returnMotif}`);
    setIsReturnModalOpen(false);
    setSelectedReturnItem(null);
  };



  // Print helper
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">

      <Tabs
        value={selectedTab}
        onValueChange={(val) => {
          setSelectedTab(val);
          setPointer(0);
          setCurrentPage(1);
        }}
        className=""
      >
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="pending">Décisions en cours</TabsTrigger>
          <TabsTrigger value="history">Historique des rapports</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          {/* 1. Pending Decisions Table */}
          <Card className="shadow-md border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
            <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 dark:border-slate-800 p-6">
              <div>
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                  <Scroll className="h-5 w-5 text-primary" /> Échantillons en Attente de Décision Finale
                </CardTitle>
                <CardDescription className="text-slate-500 dark:text-slate-400">
                  Échantillons ayant complété toutes les analyses (granulométrie, triage, cupping) et prêts pour la taxation ou le retour usine.
                </CardDescription>
              </div>
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Rechercher lot, étiquette..."
                  className="pl-9 h-9 text-sm"
                  value={searchPendingQuery}
                  onChange={(e) => {
                    setSearchPendingQuery(e.target.value);
                    setPointer(0);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {initialLabAnalyses.length === 0 ? (
                <div className="text-center p-12 text-slate-500 dark:text-slate-400">
                  <CheckCircle className="h-10 w-10 text-emerald-500 mx-auto mb-3" />
                  <p className="font-semibold text-slate-700 dark:text-slate-300">Toutes les décisions ont été prises !</p>
                  <p className="text-xs text-slate-400 mt-1">Aucun échantillon en attente de décision finale.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-left pl-6 w-16">Action</TableHead>
                        <TableHead>Code Étiquette</TableHead>
                        <TableHead>Numéro de Lot</TableHead>
                        <TableHead>Société</TableHead>
                        <TableHead>Note</TableHead>
                        <TableHead>Qualité</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {initialLabAnalyses.map((item) => (
                        <TableRow key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                          <TableCell className="pl-6">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align='start'>
                                <DropdownMenuItem className="cursor-pointer " onClick={() => {
                                  setSelectedDetailItem(item);
                                  setIsDetailModalOpen(true);
                                }}>
                                  Fiche Synthèse
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="cursor-pointer " onClick={() => handleGenerateTaxationReport(item)}>
                                  Rapport Taxation
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="cursor-pointer " onClick={() => handleReturnToFactory(item)}>
                                  Retour Usine
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                          <TableCell className="font-mono font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">{item.codeEtiquette}</TableCell>
                          <TableCell className="font-semibold">{item.lotNumber}</TableCell>
                          <TableCell className="text-xs">{item.societe}</TableCell>

                          <TableCell className="font-bold text-amber-600">
                            {item.degustation ? `${item.degustation.moyenne.toFixed(2)}/100` : "—"}
                          </TableCell>
                          <TableCell>
                            {item.degustation ? (
                              <Badge className={"bg-secondary/10 text-secondary border-secondary/20"}>
                                {item.degustation.qualite}
                              </Badge>
                            ) : (
                              <span className="text-xs text-slate-400">En cours</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
              {initialLabAnalyses.length > 0 && (
                <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                  <PaginationContent
                    currentPage={currentPage}
                    totalPages={Math.ceil(totalCount / limit)}
                    totalCount={totalCount}
                    pointer={pointer}
                    limit={limit}
                    onPageChange={(page) => {
                      setCurrentPage(page);
                      setPointer((page - 1) * limit);
                    }}
                    onLimitChange={(newLimit) => {
                      setLimit(newLimit);
                      setPointer(0);
                      setCurrentPage(1);
                    }}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          {/* 2. Finalized Reports History Table */}
          <Card className="shadow-md border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
            <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 dark:border-slate-800 p-6">
              <div>
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                  <Clipboard className="h-5 w-5 text-primary" /> 📋 Historique des Rapports Finalisés
                </CardTitle>
                <CardDescription className="text-slate-500 dark:text-slate-400">
                  Registre des rapports de taxation et des échantillons retournés à l'usine.
                </CardDescription>
              </div>
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Rechercher lot, étiquette, statut..."
                  className="pl-9 h-9 text-sm"
                  value={searchHistoryQuery}
                  onChange={(e) => {
                    setSearchHistoryQuery(e.target.value);
                    setPointer(0);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {initialLabAnalyses.length === 0 ? (
                <div className="text-center p-12 text-slate-500 dark:text-slate-400">
                  <Scroll className="h-10 w-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                  <p className="font-medium">Aucun rapport finalisé.</p>
                  <p className="text-xs text-slate-400 mt-1">Les échantillons finalisés apparaîtront ici.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="pl-6 w-16">Action</TableHead>
                        <TableHead>Code Étiquette</TableHead>
                        <TableHead>Numéro de Lot</TableHead>
                        <TableHead>Société</TableHead>
                        <TableHead>Note Cupping</TableHead>
                        <TableHead>Qualité</TableHead>
                        <TableHead>Date Finalisation</TableHead>
                        <TableHead className="pr-6">Décision</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {initialLabAnalyses.map((item) => (
                        <TableRow key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                          <TableCell className="pl-6">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align='start'>
                                <DropdownMenuItem className="cursor-pointer" onClick={() => {
                                  setSelectedDetailItem(item);
                                  setIsDetailModalOpen(true);
                                }}>
                                  Fiche Synthèse
                                </DropdownMenuItem>
                                {item.status === "finalise_taxe" && (
                                  <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="cursor-pointer" onClick={() => {
                                      setActiveAnalysis(item);
                                      setIsReportOpen(true);
                                    }}>
                                      Rapport de Taxation
                                    </DropdownMenuItem>
                                  </>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                          <TableCell className="font-mono font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">{item.codeEtiquette}</TableCell>
                          <TableCell className="font-semibold">{item.lotNumber}</TableCell>
                          <TableCell className="text-xs">{item.societe}</TableCell>
                          <TableCell className="font-bold text-amber-600">
                            {item.degustation ? `${item.degustation.moyenne.toFixed(2)}/100` : "—"}
                          </TableCell>
                          <TableCell>
                            {item.degustation ? (
                              <Badge className={item.degustation.qualite === "Qualité" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"}>
                                {item.degustation.qualite}
                              </Badge>
                            ) : "—"}
                          </TableCell>
                          <TableCell className="text-xs text-slate-500 whitespace-nowrap">
                            {item.finalizedAt ? item.finalizedAt.split("T")[0] : "—"}
                          </TableCell>
                          <TableCell className="pr-6">
                            {item.status === "finalise_taxe" ? (
                              <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Rapport Taxé</Badge>
                            ) : (
                              <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">Retourné à l'usine</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
              {initialLabAnalyses.length > 0 && (
                <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                  <PaginationContent
                    currentPage={currentPage}
                    totalPages={Math.ceil(totalCount / limit)}
                    totalCount={totalCount}
                    pointer={pointer}
                    limit={limit}
                    onPageChange={(page) => {
                      setCurrentPage(page);
                      setPointer((page - 1) * limit);
                    }}
                    onLimitChange={(newLimit) => {
                      setLimit(newLimit);
                      setPointer(0);
                      setCurrentPage(1);
                    }}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 3. Fiche Synthèse Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="sm:max-w-4xl bg-sidebar border border-slate-200 dark:border-slate-800 shadow-xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
              <FileText className="h-6 w-6 text-primary" /> Fiche Synthèse de Laboratoire
            </DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-slate-400">
              Détail complet des examens physiques
            </DialogDescription>
          </DialogHeader>

          {selectedDetailItem && (
            <div className="space-y-6 pt-4 text-slate-950 dark:text-white text-sm">

              {/* Badge with code */}
              <div className="flex items-center gap-2">
                <Badge className="bg-emerald-50 text-emerald-600 font-mono tracking-widest dark:bg-emerald-950/30 dark:text-emerald-400">{selectedDetailItem.codeEtiquette}</Badge>
              </div>

              {/* Phase 1: Reception Metadata */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50/50 dark:bg-slate-900/30 p-4 rounded-xl border border-slate-100 dark:border-slate-900 text-xs">
                <div>
                  <span className="font-semibold text-slate-400 block uppercase">Lot usine</span>
                  <span className="font-bold">{selectedDetailItem.lotNumber}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-400 block uppercase">Propriétaire</span>
                  <span className="font-semibold ">{selectedDetailItem.societe}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-400 block uppercase">Déparcheur</span>
                  <span className="">{selectedDetailItem.deparcheur}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-400 block uppercase">Sacs et quantité</span>
                  <span className="font-semibold ">{selectedDetailItem.sacsCount} sacs ({selectedDetailItem.qteEchantillon.toFixed(2)} kg)</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-400 block uppercase">Qualité</span>
                  <span className="font-semibold ">{selectedDetailItem.qualite}</span>
                </div>
                <div className="border-t border-slate-100 dark:border-slate-800/80 pt-2 mt-2 col-span-2 md:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <span className="font-semibold text-slate-400 block uppercase">Échantillonneur</span>
                    <span className="">{selectedDetailItem.echantillonneur || "—"}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-400 block uppercase">Réceptionniste</span>
                    <span className="">{selectedDetailItem.receptionniste}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-400 block uppercase">Transfert</span>
                    <span className="">{selectedDetailItem.transfertEchantillon}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-400 block uppercase">Date Réception</span>
                    <span className="">{selectedDetailItem.dateReception}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Phase 2: Granulométrie summary */}
                <div className="space-y-2.5 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                  <h4 className="font-bold flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                    <Scale className="h-3.5 w-3.5 text-primary" /> Analyse Physique
                  </h4>
                  {selectedDetailItem.granulometrie ? (
                    <div className="space-y-1">
                      <div className="flex justify-between"><span className="text-slate-600">Date</span><span className="font-semibold">{selectedDetailItem.granulometrie.date}</span></div>
                      <div className="flex justify-between"><span className="text-slate-600">Entrée tamis</span><span className="font-semibold">{selectedDetailItem.granulometrie.quantite} g</span></div>
                      <div className="border-t pt-1 mt-1 space-y-0.5">
                        <div className="flex justify-between"><span className="text-slate-600">7.1 mm:</span><span className="font-bold">{selectedDetailItem.granulometrie.sieve_7_1}%</span></div>
                        <div className="flex justify-between"><span className="text-slate-600">6.3 mm:</span><span className="font-bold">{selectedDetailItem.granulometrie.sieve_6_3}%</span></div>
                        <div className="flex justify-between"><span className="text-slate-600">5.5 mm:</span><span className="font-bold">{selectedDetailItem.granulometrie.sieve_5_5}%</span></div>
                        <div className="flex justify-between"><span className="text-slate-600">4 mm:</span><span className="font-bold">{selectedDetailItem.granulometrie.sieve_4_0}%</span></div>
                        <div className="flex justify-between"><span className="text-slate-600">3 mm:</span><span className="font-bold">{selectedDetailItem.granulometrie.sieve_3_0}%</span></div>
                        <div className="flex justify-between"><span className="text-slate-600">Fond:</span><span className="font-bold">{selectedDetailItem.granulometrie.fond}%</span></div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-slate-400 italic py-2 text-center text-[11px]">Non complétée.</div>
                  )}
                </div>

                {/* Phase 3: Triage summary */}
                <div className="space-y-2.5 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                  <h4 className="font-bold flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                    <FileText className="h-3.5 w-3.5 text-primary" /> Défauts Physiques
                  </h4>
                  {selectedDetailItem.triage ? (
                    <div className="space-y-1">
                      <div className="flex justify-between"><span className="text-slate-600">Date triage</span><span className="font-semibold">{selectedDetailItem.triage.date}</span></div>
                      <div className="flex justify-between"><span className="text-slate-600">Taux total</span><span className="font-extrabold text-red-500">{selectedDetailItem.triage.totalDefectPct.toFixed(2)} %</span></div>
                      <div className="border-t pt-1 mt-1 space-y-0.5">
                        <div className="flex justify-between"><span className="text-slate-600">Vrais défauts:</span><span className="font-bold">{selectedDetailItem.triage.vraisDefauts}%</span></div>
                        <div className="flex justify-between"><span className="text-slate-600">Défectueux:</span><span className="font-bold">{selectedDetailItem.triage.defectueux}%</span></div>
                        <div className="flex justify-between"><span className="text-slate-600">Brisure:</span><span className="font-bold">{selectedDetailItem.triage.brisure}%</span></div>
                        <div className="flex justify-between"><span className="text-slate-600">N et Rat:</span><span className="font-bold">{selectedDetailItem.triage.nEtRat}%</span></div>
                        <div className="flex justify-between"><span className="text-slate-600">Corps étr.:</span><span className="font-bold">{selectedDetailItem.triage.corpsEtrangers}%</span></div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-slate-400 italic py-2 text-center text-[11px]">Non complété.</div>
                  )}
                </div>

                {/* Phase 4: Cupping summary */}
                <div className="space-y-2.5 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                  <h4 className=" font-bold flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                    <Award className="h-3.5 w-3.5 text-amber-500" /> Analyse Sensorielle
                  </h4>
                  {selectedDetailItem.degustation ? (
                    <div className="space-y-1">
                      <div className="flex justify-between"><span className="text-slate-600">Note de tasse</span><span className="font-extrabold text-amber-600">{selectedDetailItem.degustation.moyenne.toFixed(2)} / 100</span></div>
                      <div className="flex justify-between"><span className="text-slate-600">Dégustateurs</span><span className="font-semibold">{selectedDetailItem.degustation.nbDegustateurs} experts</span></div>
                      <div className="flex justify-between items-center"><span className="text-slate-600">Classification</span>
                        <Badge className={` ${selectedDetailItem.degustation.qualite === "Qualité" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"}`}>
                          {selectedDetailItem.degustation.qualite}
                        </Badge>
                      </div>
                      <div className="border-t pt-1 mt-1">
                        <span className="text-slate-600 font-bold block">Observations:</span>
                        <p className="text-slate-500 italic leading-relaxed mt-0.5 line-clamp-3" title={selectedDetailItem.degustation.observation}>
                          "{selectedDetailItem.degustation.observation}"
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-slate-400 italic py-2 text-center text-[11px]">Non complétée.</div>
                  )}
                </div>
              </div>

              {/* Final Decisions log if already finalized */}
              {(selectedDetailItem.status === "finalise_taxe" || selectedDetailItem.status === "finalise_retourne") && (
                <div className="flex items-start gap-3 p-4 bg-emerald-500/5 dark:bg-emerald-950/10 rounded-xl border border-emerald-500/10">
                  <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-sm text-slate-800 dark:text-slate-200">
                      Décision Finale Validée
                    </span>
                    <p className="text-xs text-slate-500 mt-1">
                      {selectedDetailItem.decisionNotes} (Finalisé le {selectedDetailItem.finalizedAt ? selectedDetailItem.finalizedAt.split("T")[0] : selectedDetailItem.dateReception})
                    </p>
                  </div>
                </div>
              )}

              <DialogFooter className="pt-4 border-t border-slate-100 dark:border-slate-800 gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDetailModalOpen(false)}>
                  Fermer
                </Button>
                {selectedDetailItem.status === "degustation_complete" && (
                  <>
                    <Button size="sm" onClick={() => { setIsDetailModalOpen(false); handleGenerateTaxationReport(selectedDetailItem); }} className="bg-secondary font-bold">
                      Générer Rapport Taxation
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => { setIsDetailModalOpen(false); handleReturnToFactory(selectedDetailItem); }} className="text-destructive font-bold border-red-200">
                      Retour Usine
                    </Button>
                  </>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 4. Taxation Report Print Preview Modal */}
      <Dialog open={isReportOpen} onOpenChange={setIsReportOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto bg-white text-slate-900 border border-slate-300 dark:bg-white dark:text-slate-900 p-8 shadow-2xl">
          <DialogHeader className="border-b border-slate-200 pb-4">
            <DialogTitle className="text-xl font-extrabold tracking-tight text-slate-900 flex justify-between items-center w-full">
              <span>RAPPORT D'ANALYSE ET DE TAXATION DU CAFÉ</span>
              <Badge className="bg-emerald-600 text-white border-none font-mono">ODECA-LAB</Badge>
            </DialogTitle>
            <DialogDescription className="text-slate-500 font-medium">
              Document officiel certifié par l'Office du Café (ODECA).
            </DialogDescription>
          </DialogHeader>

          {activeAnalysis && (
            <div id="print-area" className="py-6 space-y-6 text-sm text-slate-800 leading-relaxed font-sans">

              {/* Header Title */}
              <div className="text-center border-b-2 border-slate-900 pb-4">
                <h1 className="text-2xl font-black tracking-wider uppercase text-slate-900">CERTIFICAT DE QUALITÉ ET DE TAXATION</h1>
                <p className="text-xs font-bold text-slate-500 mt-1">DATE D'EMISSION : {new Date().toISOString().split("T")[0]}</p>
                <p className="text-xs font-bold text-emerald-700 tracking-widest font-mono mt-1">N° DE CODE ANONYME : {activeAnalysis.codeEtiquette}</p>
              </div>

              {/* Informative details */}
              <div className="grid grid-cols-2 gap-6 pt-2">
                <div className="space-y-1">
                  <p><span className="font-bold text-slate-500">PROPRIÉTAIRE :</span> <span className="font-bold">{activeAnalysis.societe}</span></p>
                  <p><span className="font-bold text-slate-500">ORIGINE / USINE :</span> <span>{activeAnalysis.deparcheur}</span></p>
                  <p><span className="font-bold text-slate-500">NUMÉRO DE LOT :</span> <span className="font-bold">{activeAnalysis.lotNumber}</span></p>
                </div>
                <div className="space-y-1 text-right">
                  <p><span className="font-bold text-slate-500">ÉCHANTILLON REÇU LE :</span> <span>{activeAnalysis.dateReception}</span></p>
                  <p><span className="font-bold text-slate-500">VOLUME REPRÉSENTÉ :</span> <span>{activeAnalysis.sacsCount} sacs ({activeAnalysis.qteEchantillon.toFixed(2)} kg)</span></p>
                  <p><span className="font-bold text-slate-500">RÉCEPTIONNISTE :</span> <span>{activeAnalysis.receptionniste}</span></p>
                </div>
              </div>

              {/* Technical results table */}
              <div className="space-y-4 pt-4">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1">1. ANALYSE PHYSIQUE ET MECANIQUE (GRANULOMÉTRIE)</h3>
                <div className="grid grid-cols-6 gap-2 text-center text-xs">
                  <div className="border border-slate-200 p-2 rounded bg-slate-50"><span className="block font-bold text-slate-500">7.1 mm</span><span className="font-bold">{activeAnalysis.granulometrie?.sieve_7_1.toFixed(2)}%</span></div>
                  <div className="border border-slate-200 p-2 rounded bg-slate-50"><span className="block font-bold text-slate-500">6.3 mm</span><span className="font-bold">{activeAnalysis.granulometrie?.sieve_6_3.toFixed(2)}%</span></div>
                  <div className="border border-slate-200 p-2 rounded bg-slate-50"><span className="block font-bold text-slate-500">5.5 mm</span><span className="font-bold">{activeAnalysis.granulometrie?.sieve_5_5.toFixed(2)}%</span></div>
                  <div className="border border-slate-200 p-2 rounded bg-slate-50"><span className="block font-bold text-slate-500">4.0 mm</span><span className="font-bold">{activeAnalysis.granulometrie?.sieve_4_0.toFixed(2)}%</span></div>
                  <div className="border border-slate-200 p-2 rounded bg-slate-50"><span className="block font-bold text-slate-500">3.0 mm</span><span className="font-bold">{activeAnalysis.granulometrie?.sieve_3_0.toFixed(2)}%</span></div>
                  <div className="border border-slate-200 p-2 rounded bg-slate-50"><span className="block font-bold text-slate-500">Fond</span><span className="font-bold">{activeAnalysis.granulometrie?.fond.toFixed(2)}%</span></div>
                </div>
              </div>

              {/* Defects table */}
              <div className="space-y-4 pt-4">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1">2. TRIAGE MANUEL & DÉFAUTS</h3>
                <table className="w-full text-xs text-left border-collapse border border-slate-200">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                      <th className="p-2 border-r border-slate-200">Type de Défauts</th>
                      <th className="p-2 text-right">Pourcentage Retenu (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-200">
                      <td className="p-2 border-r border-slate-200 font-medium">Vrais défauts plus brisure</td>
                      <td className="p-2 text-right font-semibold">{activeAnalysis.triage?.vraisDefauts.toFixed(2)}%</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-2 border-r border-slate-200 font-medium">Défectueux</td>
                      <td className="p-2 text-right font-semibold">{activeAnalysis.triage?.defectueux.toFixed(2)}%</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-2 border-r border-slate-200 font-medium">Brisure</td>
                      <td className="p-2 text-right font-semibold">{activeAnalysis.triage?.brisure.toFixed(2)}%</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-2 border-r border-slate-200 font-medium">N et Rat (Noirs & Ratatinés)</td>
                      <td className="p-2 text-right font-semibold">{activeAnalysis.triage?.nEtRat.toFixed(2)}%</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-2 border-r border-slate-200 font-medium">Corps étrangers</td>
                      <td className="p-2 text-right font-semibold">{activeAnalysis.triage?.corpsEtrangers.toFixed(2)}%</td>
                    </tr>
                    <tr className="bg-slate-50/50 font-bold">
                      <td className="p-2 border-r border-slate-200 text-slate-700 uppercase">Taux total de défauts physiques</td>
                      <td className="p-2 text-right text-red-600 font-extrabold text-sm">{activeAnalysis.triage?.totalDefectPct.toFixed(2)}%</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Cupping section */}
              <div className="space-y-4 pt-4">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1">3. APPRÉCIATION SENSORIELLE & CUPPING</h3>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 grid grid-cols-3 gap-4">
                  <div className="text-center border-r border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 block uppercase">Note de tasse</span>
                    <span className="text-2xl font-black text-amber-700">{activeAnalysis.degustation?.moyenne.toFixed(2)} / 100</span>
                  </div>
                  <div className="text-center border-r border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 block uppercase">Appréciation</span>
                    <span className="text-lg font-black text-emerald-700">{activeAnalysis.degustation?.qualite}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] font-bold text-slate-500 block uppercase">Dégustateurs</span>
                    <span className="text-base font-bold text-slate-700">{activeAnalysis.degustation?.nbDegustateurs} experts agréés</span>
                  </div>
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded-lg">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Profil Aromatique en Tasse</span>
                  <p className="text-xs italic text-slate-600 leading-relaxed mt-1 font-medium">
                    "{activeAnalysis.degustation?.observation}"
                  </p>
                </div>
              </div>

              {/* Taxation & signatures */}
              <div className="border-t-2 border-slate-900 pt-6 grid grid-cols-2 gap-8">
                <div>
                  <h4 className="font-bold text-xs text-slate-500 uppercase">DÉCISION DU CONSEIL DE TAXATION :</h4>
                  <div className="mt-2 p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded font-bold text-xs">
                    CONFORME • GRADE ACCORDÉ ET APTE À L'EXPORTATION PREMIUM (TAXE VALIDÉE).
                  </div>
                </div>
                <div className="text-center flex flex-col justify-end items-center h-28 space-y-1">
                  <div className="w-48 border-b border-slate-400"></div>
                  <span className="text-[10px] font-bold text-slate-400 block">SIGNATURE ET TIMBRE DU LABORATOIRE</span>
                  <span className="text-xs font-bold text-slate-800">DIRECTEUR DU LAB ODECA</span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="border-t border-slate-200 pt-4 gap-2">
            <Button variant="outline" onClick={() => setIsReportOpen(false)} className="font-bold border-slate-300">
              Fermer
            </Button>
            <Button onClick={handlePrint} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
              <Printer className="mr-2 h-4 w-4" /> Imprimer le Rapport
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Return to Factory Modal */}
      <Dialog open={isReturnModalOpen} onOpenChange={setIsReturnModalOpen}>
        <DialogContent className="sm:max-w-lg bg-sidebar border border-slate-200 dark:border-slate-800 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Undo2 className="h-5 w-5 text-destructive" /> Retour à l'usine
            </DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-slate-400">
              Veuillez indiquer le motif du retour pour le lot <span className="font-semibold text-slate-700 dark:text-slate-300">{selectedReturnItem?.lotNumber}</span>.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="motif" className="text-sm font-semibold">Motif de retour</Label>
              {/* <Select >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un motif" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Taux d'humidité trop élevé">Retriage nécessaire</SelectItem>
                  <SelectItem value="Présence de défauts majeurs">Défectueux </SelectItem>
                </SelectContent>
              </Select> */}
              <textarea
                id="motif"
                className="flex w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300 min-h-[120px]"
                placeholder="Ex: Taux d'humidité trop élevé, présence de défauts majeurs..."
                value={returnMotif}
                onChange={(e) => setReturnMotif(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsReturnModalOpen(false)}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmReturnToFactory}
              disabled={!returnMotif.trim()}
            >
              Confirmer le retour
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
