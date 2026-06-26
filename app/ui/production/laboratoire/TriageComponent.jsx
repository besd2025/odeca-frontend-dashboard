"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Sliders, Clipboard, Calendar, CheckCircle, Search, AlertCircle, Inbox, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { fetchData } from "@/app/_utils/api";
import PaginationContent from "@/components/ui/pagination-content";
// ==========================================
// MOCKED DATA (ILLUSTRATION POUR LE DESIGN)
// ==========================================
const initialLabAnalyses = [
  {
    id: "LAB-ANA-2",
    sampleId: "ECH-2026-002",
    transfertEchantillon: "Chauffeur ODECA",
    lotNumber: "LOT-2026-002",
    qteEchantillon: 24.5,
    sacsCount: 200,
    societe: "KAWASE COFFEE",
    qualite: "Washed",
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
    qualite: "Natural",
    deparcheur: "Usine Kayanza SOGESTAL",
    receptionniste: "Marc Ndayishimiye",
    codeEtiquette: "LAB-ETQ-26-003-8812",
    dateReception: "2026-05-30",
    status: "triage_complete",
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
    }
  }
];

export default function TriageComponent() {
  // UI States Only
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedDetailItem, setSelectedDetailItem] = useState(null);
  const [pendingData, setPendingData] = useState([]);
  const [completedData, setCompletedData] = useState([]);
  const [searchPendingQuery, setSearchPendingQuery] = useState("");
  const [searchHistoryQuery, setSearchHistoryQuery] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pointer, setPointer] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [formData, setFormData] = useState({
    qteTrier: "300",
    dateTriage: "",
    vraisDefauts: "",
    defectueux: "",
    brisure: "",
    nEtRat: "",
    corpsEtrangers: "",
  });
  const handleOpenModal = (analysis) => {
    setSelectedAnalysis(analysis);
    const syncedDate = analysis.granulometrie?.date || new Date().toISOString().split("T")[0];
    setFormData({
      qteTrier: "300",
      dateTriage: syncedDate,
      vraisDefauts: "",
      defectueux: "",
      brisure: "",
      nEtRat: "",
      corpsEtrangers: "",
    });
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const val_vraisDefauts = parseFloat(formData.vraisDefauts) || 0;
  const val_defectueux = parseFloat(formData.defectueux) || 0;
  const val_brisure = parseFloat(formData.brisure) || 0;
  const val_nEtRat = parseFloat(formData.nEtRat) || 0;
  const val_corpsEtrangers = parseFloat(formData.corpsEtrangers) || 0;

  const totalDefects = parseFloat((val_vraisDefauts + val_defectueux + val_brisure + val_nEtRat + val_corpsEtrangers).toFixed(2));
  const isDefectValid = totalDefects <= 100;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isDefectValid) {
      toast.error("La somme des défauts ne peut pas dépasser 100% !");
      return;
    }
    const body = {
      granulometrie_id: selectedAnalysis?.id,
      quantite_trier: formData.qteTrier,
      vrais_defauts_brisure: formData.vraisDefauts,
      defectueux: formData.defectueux,
      brisure: formData.brisure,
      n_et_rat: formData.nEtRat,
      corps_etrangers: formData.corpsEtrangers
    }
    console.log("data", body);
    try {
      const response = await fetchData("post", "cafe/tirage_manuel/enregistrer_triage/",
        { params: {}, additionalHeaders: {}, body: body });
      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Erreur de mise à jour du triage");
      }

      toast.success("Triage manuel validé et enregistré");
      setIsModalOpen(false);
      setSelectedAnalysis(null);
      setRefreshTrigger((prev) => prev + 1);
      return { lot: selectedAnalysis?.id };
    } catch (error) {
      console.error(error);
      toast.error("Donnée non enregistrée!!!");
      throw error;
    }
  };
  const [selectedTab, setSelectedTab] = useState("pending");
  React.useEffect(() => {
    const fetchPendingAnalyses = async () => {
      if (selectedTab === "pending") {


        try {
          const response = await fetchData("get", "cafe/tirage_manuel/pret_pour_triage/", {
            params: { limit, offset: pointer, search: searchPendingQuery }
          });
          console.log("les analyses:", response);
          const dataResponse = response?.results || [];
          setTotalCount(response?.count || 0);
          const analyses = dataResponse.map((item) => ({
            id: item.id,
            sampleId: item.echantillon_id,
            transfertEchantillon: item.transfert_echantillon,
            lotNumber: item.numero_lot,
            qualite: item.qualite,
            qteEchantillon: item.quantite_echantillon,
            sacsCount: item.sacs_count,
            societe: item.societe,
            deparcheur: item.deparcheur,
            receptionniste: item.receptionniste,
            codeEtiquette: item.code_etiquette,
            dateReception: item.date_reception,
            status: "granulometrie_complete",
            granulometrie: {
              quantite: item?.quantite,
              date: item?.date_granulometrie ? new Date(item.date_granulometrie).toLocaleDateString() : "",
              sieve_7_1: item?.tami_7_1,
              sieve_6_3: item?.tami_6_3,
              sieve_5_5: item?.tami_5_5,
              sieve_4_0: item?.tami_4_0,
              sieve_3_0: item?.tami_3_0,
              fond: item?.fond
            }
          }));
          console.log("les analyses", analyses);
          setPendingData(analyses);
        } catch (error) {
          console.error("Error fetching pending analyses:", error);
        }
      }
      if (selectedTab === "history") {
        try {
          const response = await fetchData("get", "cafe/tirage_manuel/historique_triages/", {
            params: { limit, offset: pointer, search: searchHistoryQuery }
          });
          console.log("les analyse_EEEE:", response);
          const dataResponse2 = response?.results || [];
          setTotalCount(response?.count || 0);
          const analyses = dataResponse2.map((item) => ({
            id: item.id,
            sampleId: item.echantillon_id,
            transfertEchantillon: item.transfert_echantillon,
            lotNumber: item.lot_number,
            qualite: item.qualite,
            qteEchantillon: item.quantite_trier,
            sacsCount: item.sacs_count,
            societe: item.societe,
            deparcheur: item.deparcheur,
            receptionniste: item.receptionniste,
            codeEtiquette: item.code_etiquette,
            dateReception: item.date_reception,
            status: "triage_complete",
            granulometrie: {
              quantite: item?.quantite,
              date: item?.date_analyse ? new Date(item.date_analyse).toLocaleDateString() : "",
              sieve_7_1: item?.tami_7_1,
              sieve_6_3: item?.tami_6_3,
              sieve_5_5: item?.tami_5_5,
              sieve_4_0: item?.tami_4_0,
              sieve_3_0: item?.tami_3_0,
              fond: item?.fond
            },
            triage: {
              date: item?.date ? new Date(item.date).toLocaleDateString() : "",
              vraisDefauts: parseFloat(item?.vrais_defauts_brisure) || 0,
              defectueux: parseFloat(item?.defectueux) || 0,
              brisure: parseFloat(item?.brisure) || 0,
              nEtRat: parseFloat(item?.n_et_rat) || 0,
              corpsEtrangers: parseFloat(item?.corps_etrangers) || 0,
              totalDefectPct: parseFloat(item?.vrais_defauts_brisure || 0) +
                parseFloat(item?.defectueux || 0) +
                parseFloat(item?.brisure || 0) +
                parseFloat(item?.n_et_rat || 0) +
                parseFloat(item?.corps_etrangers || 0)
            }
          }));
          console.log("les analyses", analyses);
          setCompletedData(analyses);
        } catch (error) {
          console.error("Error fetching pending analyses:", error);
        }

      }
    };


    fetchPendingAnalyses();
  }, [selectedTab, limit, pointer, searchPendingQuery, searchHistoryQuery, refreshTrigger]);

  const filteredPending = pendingData || [];
  const filteredHistory = completedData || [];

  return (
    <div className="space-y-6">

      <Tabs
        className=""
        value={selectedTab}
        onValueChange={(val) => {
          setSelectedTab(val);
          setPointer(0);
          setCurrentPage(1);
        }}
      >
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="pending">Pret pour le triage</TabsTrigger>
          <TabsTrigger value="history">Status des triages</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          {/* 1. Pending Samples Table */}
          <Card className="shadow-md border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
            <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 dark:border-slate-800 p-6">
              <div>
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                  <Inbox className="h-5 w-5 text-primary" /> Échantillons en Attente de Triage Manuel
                </CardTitle>
                <CardDescription className="text-slate-500 dark:text-slate-400">
                  Échantillons ayant passé l'analyse granulométrique, prêts pour le triage physique des défauts.
                </CardDescription>
              </div>
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Rechercher code, lot..."
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
              {filteredPending.length === 0 ? (
                <div className="text-center p-12 text-slate-500 dark:text-slate-400">
                  <CheckCircle className="h-10 w-10 text-emerald-500 mx-auto mb-3" />
                  <p className="font-semibold text-slate-700 dark:text-slate-300">Tous les échantillons ont été triés !</p>
                  <p className="text-xs text-slate-400 mt-1">Aucun échantillon en attente de triage manuel ou trouvé pour cette recherche.</p>
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
                        <TableHead>Date Granulométrie</TableHead>
                        <TableHead>Tamis 7.1mm / 6.3mm</TableHead>
                        <TableHead>Fond</TableHead>
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
                                <DropdownMenuItem className="cursor-pointer" onClick={() => handleOpenModal(item)}>
                                  Saisir Triage
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {/* <DropdownMenuItem className="cursor-pointer text-red-600 dark:text-red-400" onClick={() => toast.info(`Échantillon ${item.codeEtiquette} rejeté (démo)`)}>
                                  Rejeter
                                </DropdownMenuItem> */}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                          <TableCell className="font-mono font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">{item.codeEtiquette}</TableCell>
                          <TableCell className="font-bold text-slate-700 dark:text-slate-300">{item.lotNumber}</TableCell>
                          <TableCell>{item.societe}</TableCell>
                          <TableCell className="text-xs text-slate-500">{item.granulometrie?.date}</TableCell>
                          <TableCell className="text-xs text-slate-600 dark:text-slate-400">
                            {item.granulometrie?.sieve_7_1}% / {item.granulometrie?.sieve_6_3}%
                          </TableCell>
                          <TableCell className="text-xs text-slate-600 dark:text-slate-400">{item.granulometrie?.fond}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
              {filteredPending.length > 0 && (
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
          {/* 2. History Table */}
          <Card className="shadow-md border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
            <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 dark:border-slate-800 p-6">
              <div>
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                  <Clipboard className="h-5 w-5 text-primary" /> Fiches de Triage Manuel Validées
                </CardTitle>
                <CardDescription className="text-slate-500 dark:text-slate-400">
                  Historique complet des fiches de triages validées en aveugle.
                </CardDescription>
              </div>
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Rechercher code, lot..."
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
              {completedData.length === 0 ? (
                <div className="text-center p-12 text-slate-500 dark:text-slate-400">
                  <Sliders className="h-10 w-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                  <p className="font-medium">Aucun triage manuel enregistré ou trouvé.</p>
                  <p className="text-xs text-slate-400 mt-1">Validez le triage d'un échantillon ci-dessus.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="pl-6 w-16">Action</TableHead>
                        <TableHead>Code Étiquette</TableHead>
                        <TableHead>Societe</TableHead>
                        <TableHead>Qualite</TableHead>
                        <TableHead>Quantite</TableHead>
                        <TableHead>Vrais Défauts</TableHead>
                        <TableHead>Défectueux</TableHead>
                        <TableHead>Brisure</TableHead>
                        <TableHead>N & Rat</TableHead>
                        <TableHead>Corps Étr.</TableHead>
                        <TableHead className="text-right">Taux Total</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="pr-6">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {completedData.map((item) => (
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
                                  Détails
                                </DropdownMenuItem>
                                {/* <DropdownMenuItem className="cursor-pointer " >
                                  Torrefier
                                </DropdownMenuItem> */}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                          <TableCell className="font-mono font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">{item.codeEtiquette}</TableCell>
                          <TableCell className="font-bold">{item.societe}</TableCell>
                          <TableCell className="font-bold">{item.qualite} </TableCell>
                          <TableCell className="font-bold ">{item.qteEchantillon} g</TableCell>
                          <TableCell className="text-xs text-slate-500">{item.triage.vraisDefauts.toFixed(2)} %</TableCell>
                          <TableCell className="text-xs text-slate-500">{item.triage.defectueux.toFixed(2)} %</TableCell>
                          <TableCell className="text-xs text-slate-500">{item.triage.brisure.toFixed(2)} %</TableCell>
                          <TableCell className="text-xs text-slate-500">{item.triage.nEtRat.toFixed(2)} %</TableCell>
                          <TableCell className="text-xs text-slate-500">{item.triage.corpsEtrangers.toFixed(2)} %</TableCell>
                          <TableCell className="text-right font-extrabold text-slate-800 dark:text-slate-200">{item.triage.totalDefectPct.toFixed(2)} %</TableCell>
                          <TableCell className="text-xs text-slate-500 whitespace-nowrap">{item.triage.date}</TableCell>
                          <TableCell className="pr-6">
                            {item.status === "triage_complete" ? (
                              <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[10px]">Attente Torréfaction</Badge>
                            ) : (
                              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]">Dégusté</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
              {filteredHistory.length > 0 && (
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

      {/* 3. Triage Dialog Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-2xl bg-sidebar border border-slate-200 dark:border-slate-800 shadow-xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
              <Sliders className="h-6 w-6 text-primary" /> Fiche de Triage Manuel
            </DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-slate-400">
              Renseignez les pourcentages de défauts physiques pour cet échantillon.
            </DialogDescription>
          </DialogHeader>

          {selectedAnalysis && (
            <form onSubmit={handleSubmit} className="space-y-6 pt-4">

              {/* Prefilled Analysis Info */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50/50 dark:bg-slate-900/30 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block font-semibold uppercase">Code Étiquette</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">{selectedAnalysis.codeEtiquette}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold uppercase">Numéro de Lot</span>
                  <span className="font-bold">{selectedAnalysis.lotNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold uppercase">Granulométrie du</span>
                  <span className="font-semibold">{selectedAnalysis.granulometrie?.date}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold uppercase">Qualité</span>
                  <span className="font-semibold">{selectedAnalysis.qualite}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold uppercase">Calibre dominant</span>
                  <span className="font-semibold">7.1mm: {selectedAnalysis.granulometrie?.sieve_7_1}% • Fond: {selectedAnalysis.granulometrie?.fond}%</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="qteTrier" className="font-bold text-slate-700 dark:text-slate-300">Quantité à trier (g)</Label>
                  <Input type="number" id="qteTrier" name="qteTrier" value={formData.qteTrier} onChange={handleChange} className="font-semibold" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateTriage" className="font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    Date du Triage (Synchronisée) <Badge variant="outline" className="text-[10px] bg-slate-100 dark:bg-slate-900 border-none font-bold">ReadOnly</Badge>
                  </Label>
                  <div className="relative">
                    <Input type="text" id="dateTriage" value={formData.dateTriage} readOnly className="bg-slate-50/50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 border-dashed cursor-not-allowed pl-10 font-medium" />
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  </div>
                </div>
              </div>

              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Proportion des défauts physiques (en %)</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { id: "vraisDefauts", label: "Vrais défauts + brisure" },
                  { id: "defectueux", label: "Défectueux" },
                  { id: "brisure", label: "Brisure" },
                  { id: "nEtRat", label: "N et Rat" },
                  { id: "corpsEtrangers", label: "Corps étrangers" },
                ].map((defect) => (
                  <div key={defect.id} className="space-y-1.5 p-3 bg-slate-50/50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-900">
                    <Label htmlFor={defect.id} className="text-xs font-bold text-slate-600 dark:text-slate-400">{defect.label}</Label>
                    <Input type="number" step="0.01" min="0" max="100" id={defect.id} name={defect.id} value={formData[defect.id]} onChange={handleChange} placeholder="%" required />
                  </div>
                ))}
              </div>

              {/* Total Defects */}
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-primary" />
                  <div>
                    <span className="text-xs font-semibold text-slate-500">Taux total de défauts</span>
                    <p className="text-lg font-extrabold text-slate-900 dark:text-white">{totalDefects} %</p>
                  </div>
                </div>
                <Badge variant="outline" className={isDefectValid ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"}>
                  {isDefectValid ? "Conforme (<= 100%)" : "Non-conforme (> 100%)"}
                </Badge>
              </div>

              <DialogFooter className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Annuler</Button>
                <Button type="submit" disabled={!isDefectValid} className="font-semibold">
                  <CheckCircle className="mr-2 h-4 w-4" /> Enregistrer le Triage Manuel
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* 4. Details Dialog Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="sm:max-w-xl bg-sidebar border border-slate-200 dark:border-slate-800 shadow-xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
              <Sliders className="h-6 w-6 text-primary" /> Détails du Triage Manuel
            </DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-slate-400">
              Fiche complète des défauts physiques identifiés pour cet échantillon.
            </DialogDescription>
          </DialogHeader>

          {selectedDetailItem && (
            <div className="space-y-6 pt-4 text-slate-950 dark:text-white text-sm">
              {/* Metadata Grid */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50/50 dark:bg-slate-900/30 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block uppercase">Code Étiquette</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm tracking-wider">{selectedDetailItem.codeEtiquette}</span>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase font-semibold">Numéro de Lot</span>
                  <span className="font-bold">{selectedDetailItem.lotNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-uppercase font-semibold">Société</span>
                  <span className="font-semibold">{selectedDetailItem.societe}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-uppercase font-semibold">Qualité</span>
                  <span className="font-semibold">{selectedDetailItem.qualite}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-uppercase font-semibold">Date Triage</span>
                  <span className="font-semibold">{selectedDetailItem.triage.date}</span>
                </div>
              </div>

              {/* Defects Details */}
              <div className="space-y-3 bg-slate-50/20 dark:bg-slate-900/10 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                <h4 className="font-bold text-slate-900 dark:text-white border-b pb-1.5 flex items-center gap-1.5">
                  <Sliders className="h-4 w-4 text-primary" /> Proportion des Défauts Physiques
                </h4>
                <div className="grid grid-cols-2 gap-4 text-xs font-medium">
                  <div>
                    <span className="text-slate-400 block">Quantité triée</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{selectedDetailItem.triage.qteTrier} g</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Date du triage</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{selectedDetailItem.triage.date}</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 pt-2">
                  {[
                    { label: "Vrais défauts", value: selectedDetailItem.triage.vraisDefauts },
                    { label: "Défectueux", value: selectedDetailItem.triage.defectueux },
                    { label: "Brisure", value: selectedDetailItem.triage.brisure },
                    { label: "N et Rat", value: selectedDetailItem.triage.nEtRat },
                    { label: "Corps étrangers", value: selectedDetailItem.triage.corpsEtrangers },
                  ].map((defect) => (
                    <div key={defect.label} className="p-2.5 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-900 text-center">
                      <span className="text-[10px] text-slate-400 block font-semibold uppercase">{defect.label}</span>
                      <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200">{defect.value.toFixed(2)} %</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50/50 dark:bg-red-950/10 rounded-lg border border-red-200/50 dark:border-red-900/30 mt-2">
                  <span className="text-xs font-semibold text-slate-500">Taux total de défauts</span>
                  <span className="text-sm font-extrabold text-red-600 dark:text-red-400">
                    {selectedDetailItem.triage.totalDefectPct.toFixed(2)} %
                  </span>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Statut suivant</span>
                {selectedDetailItem.status === "triage_complete" ? (
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20">Triage terminée</Badge>
                ) : (
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">En cours de triage</Badge>
                )}
              </div>

              <DialogFooter className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button type="button" variant="outline" onClick={() => setIsDetailModalOpen(false)}>
                  Fermer
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
