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
      qualite: "Qualité",
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
      qualite: "Qualité",
      dateDegustation: "2026-05-29"
    },
    finalizedAt: "2026-05-29T15:00:00.000Z",
    decisionNotes: "Rapport de Taxation Généré. Qualité conforme aux critères de taxation."
  }
];

export default function RapportsComponent() {
  const [labAnalyses, setLabAnalyses] = useState(initialLabAnalyses);
  const [searchPendingQuery, setSearchPendingQuery] = useState("");
  const [searchHistoryQuery, setSearchHistoryQuery] = useState("");

  // Detail Modal (Fiche Synthèse)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedDetailItem, setSelectedDetailItem] = useState(null);

  // Taxation Report Preview Modal
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [activeAnalysis, setActiveAnalysis] = useState(null);

  // ==============================================================
  // BRANCHEMENT BACKEND : Charger les données depuis le serveur
  // ==============================================================
  useEffect(() => {
    // POUR LE BACKEND : Charger toutes les analyses depuis le serveur
    /*
    async function fetchAnalyses() {
      try {
        const res = await fetch("/api/production/laboratoire/analyses");
        const data = await res.json();
        setLabAnalyses(data);
      } catch (err) {
        console.error("Erreur lors de la récupération des analyses", err);
      }
    }
    fetchAnalyses();
    */
  }, []);

  // Pending: degustation_complete (ready for final decision)
  const pendingDecisions = labAnalyses.filter((item) => item.status === "degustation_complete");
  // Finalized: taxed or returned
  const finalizedReports = labAnalyses.filter(
    (item) => item.status === "finalise_taxe" || item.status === "finalise_retourne"
  );

  // Actions
  const handleGenerateTaxationReport = (item) => {
    // ==============================================================
    // BRANCHEMENT BACKEND : Valider et générer le rapport sur le serveur
    // ==============================================================
    /*
    async function finalizeTaxation() {
      try {
        const payload = {
          status: "finalise_taxe",
          decisionNotes: "Rapport de Taxation Généré. Qualité conforme aux critères de taxation."
        };
        const res = await fetch(`/api/production/laboratoire/analyses/${item.id}/finalize-taxe`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          toast.success("Rapport de taxation généré et finalisé.");
          // Recharger les données du backend
        }
      } catch (err) {
        toast.error("Erreur lors de la finalisation.");
      }
    }
    finalizeTaxation();
    */

    const updatedAnalyses = labAnalyses.map((anal) => {
      if (anal.id === item.id) {
        return {
          ...anal,
          status: "finalise_taxe",
          finalizedAt: new Date().toISOString(),
          decisionNotes: "Rapport de Taxation Généré. Qualité conforme aux critères de taxation.",
        };
      }
      return anal;
    });

    setLabAnalyses(updatedAnalyses);
    
    // Set for active report print preview
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
    // ==============================================================
    // BRANCHEMENT BACKEND : Signaler le retour à l'usine sur le serveur
    // ==============================================================
    /*
    async function finalizeReturn() {
      try {
        const payload = {
          status: "finalise_retourne",
          decisionNotes: "Retour à l'usine - pas de rapport. Échantillon rejeté ou insuffisant."
        };
        const res = await fetch(`/api/production/laboratoire/analyses/${item.id}/finalize-return`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          toast.warning("Échantillon retourné à l'usine.");
          // Recharger les données du backend
        }
      } catch (err) {
        toast.error("Erreur lors du retour à l'usine.");
      }
    }
    finalizeReturn();
    */

    const updatedAnalyses = labAnalyses.map((anal) => {
      if (anal.id === item.id) {
        return {
          ...anal,
          status: "finalise_retourne",
          finalizedAt: new Date().toISOString(),
          decisionNotes: "Retour à l'usine - pas de rapport. Échantillon rejeté ou insuffisant.",
        };
      }
      return anal;
    });

    setLabAnalyses(updatedAnalyses);
    toast.warning(`Échantillon ${item.codeEtiquette} renvoyé à l'usine (Illustration locale)`);
  };

  const filteredPending = pendingDecisions.filter((item) => {
    const q = searchPendingQuery.toLowerCase();
    return (
      item.codeEtiquette.toLowerCase().includes(q) ||
      item.lotNumber.toLowerCase().includes(q) ||
      item.societe.toLowerCase().includes(q)
    );
  });

  const filteredFinalized = finalizedReports.filter((item) => {
    const q = searchHistoryQuery.toLowerCase();
    return (
      item.codeEtiquette.toLowerCase().includes(q) ||
      item.lotNumber.toLowerCase().includes(q) ||
      item.societe.toLowerCase().includes(q) ||
      item.status.toLowerCase().includes(q)
    );
  });

  // Print helper
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">

      <Tabs defaultValue="pending" className="">
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
                <Input placeholder="Rechercher lot, étiquette..." value={searchPendingQuery} onChange={(e) => setSearchPendingQuery(e.target.value)} className="pl-9 h-9 text-sm" />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {filteredPending.length === 0 ? (
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
                        <TableHead>Progrès</TableHead>
                        <TableHead>Note Cupping</TableHead>
                        <TableHead>Qualité</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPending.map((item) => (
                        <TableRow key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                          <TableCell className="pl-6">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align='start'>
                                <DropdownMenuItem className="cursor-pointer font-semibold" onClick={() => {
                                  setSelectedDetailItem(item);
                                  setIsDetailModalOpen(true);
                                }}>
                                  Fiche Synthèse
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="cursor-pointer font-semibold text-emerald-600 dark:text-emerald-400" onClick={() => handleGenerateTaxationReport(item)}>
                                  Rapport Taxation
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer text-red-600 dark:text-red-400 font-semibold" onClick={() => handleReturnToFactory(item)}>
                                  Retour Usine
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                          <TableCell className="font-mono font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">{item.codeEtiquette}</TableCell>
                          <TableCell className="font-semibold">{item.lotNumber}</TableCell>
                          <TableCell className="text-xs">{item.societe}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              <Badge variant="outline" className={`text-[10px] ${item.granulometrie ? "bg-emerald-500/10 text-emerald-600" : "bg-slate-100"}`}>Granulo</Badge>
                              <Badge variant="outline" className={`text-[10px] ${item.triage ? "bg-emerald-500/10 text-emerald-600" : "bg-slate-100"}`}>Triage</Badge>
                              <Badge variant="outline" className={`text-[10px] ${item.degustation ? "bg-emerald-500/10 text-emerald-600" : "bg-slate-100"}`}>Cupping</Badge>
                            </div>
                          </TableCell>
                          <TableCell className="font-bold text-amber-600">
                            {item.degustation ? `${item.degustation.moyenne.toFixed(2)}/100` : "—"}
                          </TableCell>
                          <TableCell>
                            {item.degustation ? (
                              <Badge className={item.degustation.qualite === "Qualité" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"}>
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
                <Input placeholder="Rechercher lot, étiquette, statut..." value={searchHistoryQuery} onChange={(e) => setSearchHistoryQuery(e.target.value)} className="pl-9 h-9 text-sm" />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {filteredFinalized.length === 0 ? (
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
                      {filteredFinalized.map((item) => (
                        <TableRow key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                          <TableCell className="pl-6">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align='start'>
                                <DropdownMenuItem className="cursor-pointer font-semibold" onClick={() => {
                                  setSelectedDetailItem(item);
                                  setIsDetailModalOpen(true);
                                }}>
                                  Fiche Synthèse
                                </DropdownMenuItem>
                                {item.status === "finalise_taxe" && (
                                  <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="cursor-pointer font-semibold" onClick={() => {
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 3. Fiche Synthèse Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="sm:max-w-2xl bg-sidebar border border-slate-200 dark:border-slate-800 shadow-xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
              <FileText className="h-6 w-6 text-primary" /> Fiche Synthèse de Laboratoire
            </DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-slate-400">
              Détail complet des examens physiques et organoleptiques cumulés.
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
                  <span className="text-[10px] font-semibold text-slate-400 block uppercase">Lot usine</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedDetailItem.lotNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 block uppercase">Propriétaire</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{selectedDetailItem.societe}</span>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 block uppercase">Déparcheur</span>
                  <span className="text-xs text-slate-600 dark:text-slate-400">{selectedDetailItem.deparcheur}</span>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 block uppercase">Sacs et quantité</span>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{selectedDetailItem.sacsCount} sacs ({selectedDetailItem.qteEchantillon.toFixed(2)} kg)</span>
                </div>
                <div className="border-t border-slate-100 dark:border-slate-800/80 pt-2 mt-2 col-span-2 md:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 block uppercase">Échantillonneur</span>
                    <span className="text-xs text-slate-600 dark:text-slate-400">{selectedDetailItem.echantillonneur || "—"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 block uppercase">Réceptionniste</span>
                    <span className="text-xs text-slate-600 dark:text-slate-400">{selectedDetailItem.receptionniste}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 block uppercase">Transfert</span>
                    <span className="text-xs text-slate-500">{selectedDetailItem.transfertEchantillon}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 block uppercase">Date Réception</span>
                    <span className="text-xs text-slate-500">{selectedDetailItem.dateReception}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Phase 2: Granulométrie summary */}
                <div className="space-y-2.5 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                  <h4 className="text-xs font-bold flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                    <Scale className="h-3.5 w-3.5 text-primary" /> Analyse Physique
                  </h4>
                  {selectedDetailItem.granulometrie ? (
                    <div className="space-y-1 text-[11px]">
                      <div className="flex justify-between"><span className="text-slate-400">Date</span><span className="font-semibold">{selectedDetailItem.granulometrie.date}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Entrée tamis</span><span className="font-semibold">{selectedDetailItem.granulometrie.quantite} g</span></div>
                      <div className="border-t pt-1 mt-1 space-y-0.5">
                        <div className="flex justify-between"><span className="text-slate-400">7.1 mm:</span><span className="font-bold">{selectedDetailItem.granulometrie.sieve_7_1}%</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">6.3 mm:</span><span className="font-bold">{selectedDetailItem.granulometrie.sieve_6_3}%</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">5.5 mm:</span><span className="font-bold">{selectedDetailItem.granulometrie.sieve_5_5}%</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">4 mm:</span><span className="font-bold">{selectedDetailItem.granulometrie.sieve_4_0}%</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">3 mm:</span><span className="font-bold">{selectedDetailItem.granulometrie.sieve_3_0}%</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">Fond:</span><span className="font-bold">{selectedDetailItem.granulometrie.fond}%</span></div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-slate-400 italic py-2 text-center text-[11px]">Non complétée.</div>
                  )}
                </div>

                {/* Phase 3: Triage summary */}
                <div className="space-y-2.5 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                  <h4 className="text-xs font-bold flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                    <FileText className="h-3.5 w-3.5 text-primary" /> Défauts Physiques
                  </h4>
                  {selectedDetailItem.triage ? (
                    <div className="space-y-1 text-[11px]">
                      <div className="flex justify-between"><span className="text-slate-400">Date triage</span><span className="font-semibold">{selectedDetailItem.triage.date}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Taux total</span><span className="font-extrabold text-red-500">{selectedDetailItem.triage.totalDefectPct.toFixed(2)} %</span></div>
                      <div className="border-t pt-1 mt-1 space-y-0.5">
                        <div className="flex justify-between"><span className="text-slate-400">Vrais défauts:</span><span className="font-bold">{selectedDetailItem.triage.vraisDefauts}%</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">Défectueux:</span><span className="font-bold">{selectedDetailItem.triage.defectueux}%</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">Brisure:</span><span className="font-bold">{selectedDetailItem.triage.brisure}%</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">N et Rat:</span><span className="font-bold">{selectedDetailItem.triage.nEtRat}%</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">Corps étr.:</span><span className="font-bold">{selectedDetailItem.triage.corpsEtrangers}%</span></div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-slate-400 italic py-2 text-center text-[11px]">Non complété.</div>
                  )}
                </div>

                {/* Phase 4: Cupping summary */}
                <div className="space-y-2.5 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                  <h4 className="text-xs font-bold flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                    <Award className="h-3.5 w-3.5 text-amber-500" /> Analyse Sensorielle
                  </h4>
                  {selectedDetailItem.degustation ? (
                    <div className="space-y-1 text-[11px]">
                      <div className="flex justify-between"><span className="text-slate-400">Note de tasse</span><span className="font-extrabold text-amber-600">{selectedDetailItem.degustation.moyenne.toFixed(2)} / 100</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Dégustateurs</span><span className="font-semibold">{selectedDetailItem.degustation.nbDegustateurs} experts</span></div>
                      <div className="flex justify-between items-center"><span className="text-slate-400">Classification</span>
                        <Badge className={`text-[10px] ${selectedDetailItem.degustation.qualite === "Qualité" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"}`}>
                          {selectedDetailItem.degustation.qualite}
                        </Badge>
                      </div>
                      <div className="border-t pt-1 mt-1">
                        <span className="text-[10px] text-slate-400 font-bold block">Observations:</span>
                        <p className="text-[11px] text-slate-500 italic leading-relaxed mt-0.5 line-clamp-3" title={selectedDetailItem.degustation.observation}>
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
                    <Button size="sm" onClick={() => { setIsDetailModalOpen(false); handleGenerateTaxationReport(selectedDetailItem); }} className="bg-emerald-600 hover:bg-emerald-700 font-bold">
                      Générer Rapport Taxation
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => { setIsDetailModalOpen(false); handleReturnToFactory(selectedDetailItem); }} className="text-red-500 hover:bg-red-50 hover:text-red-600 font-bold border-red-200">
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
    </div>
  );
}
