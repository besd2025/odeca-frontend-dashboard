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
import { BarChart3, Calculator, Clipboard, Calendar, CheckCircle, Search, AlertTriangle, Inbox, MoreHorizontal, Scale } from "lucide-react";
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
    id: "LAB-ANA-1",
    sampleId: "ECH-2026-001",
    transfertEchantillon: "Par coursier Ngozi",
    lotNumber: "LOT-2026-001",
    qualite: "15+",
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
    qualite: "FWTT",
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
    qualite: "TT",
    qteEchantillon: 8.5,
    sacsCount: 85,
    societe: "KIBIRA COFFEE",
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
    }
  }
];

export default function GranulometrieComponent() {
  // UI States Only
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedDetailItem, setSelectedDetailItem] = useState(null);

  const [formData, setFormData] = useState({
    quantite: "300",
    dateGranulo: new Date().toISOString().split("T")[0],
    sieve_7_1: "",
    sieve_6_3: "",
    sieve_5_5: "",
    sieve_4_0: "",
    sieve_3_0: "",
    fond: "",
  });

  // Static Data Presentation
  const pendingAnalyses = initialLabAnalyses.filter((item) => item.status === "receptionne");
  const completedAnalyses = initialLabAnalyses.filter(
    (item) => item.status !== "receptionne" && item.granulometrie
  );

  // Open modal for a specific pending analysis
  const handleOpenModal = (analysis) => {
    setSelectedAnalysis(analysis);
    setFormData({
      quantite: "300",
      dateGranulo: new Date().toISOString().split("T")[0],
      sieve_7_1: "",
      sieve_6_3: "",
      sieve_5_5: "",
      sieve_4_0: "",
      sieve_3_0: "",
      fond: "",
    });
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Live sum calculation
  const val_7_1 = parseFloat(formData.sieve_7_1) || 0;
  const val_6_3 = parseFloat(formData.sieve_6_3) || 0;
  const val_5_5 = parseFloat(formData.sieve_5_5) || 0;
  const val_4_0 = parseFloat(formData.sieve_4_0) || 0;
  const val_3_0 = parseFloat(formData.sieve_3_0) || 0;
  const val_fond = parseFloat(formData.fond) || 0;

  const totalSum = parseFloat((val_7_1 + val_6_3 + val_5_5 + val_4_0 + val_3_0 + val_fond).toFixed(2));
  const isSumPerfect = totalSum === 100.00;

  const handleAutoFillFond = () => {
    const partialSum = val_7_1 + val_6_3 + val_5_5 + val_4_0 + val_3_0;
    if (partialSum > 100) {
      toast.error("La somme des tamis dépasse déjà 100% !");
      return;
    }
    const remaining = parseFloat((100 - partialSum).toFixed(2));
    setFormData((prev) => ({ ...prev, fond: remaining.toString() }));
    toast.success(`Fond calculé : ${remaining}%`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isSumPerfect) {
      toast.warning(`La somme totale est de ${totalSum}%. Elle doit être de 100%.`);
      return;
    }

    const tamisList = [
      { id: "sieve_7_1", label: "7.1 mm" },
      { id: "sieve_6_3", label: "6.3 mm" },
      { id: "sieve_5_5", label: "5.5 mm" },
      { id: "sieve_4_0", label: "4 mm" },
      { id: "sieve_3_0", label: "3 mm" },
      { id: "fond", label: "Fond" }
    ];

    try {
      for (const tamis of tamisList) {
        const valeur = formData[tamis.id];

        try {
          const res = await fetchData(
            "post",
            `/cafe/determination_caribre/`,
            {
              params: {},
              additionalHeaders: {},
              body: {
                "calibre_nom": tamis.label,
                "pourcentage": parseFloat(valeur),
                "granulometrie": selectedAnalysis?.id,
              },
            }
          );

          if (res.status !== 200 && res.status !== 201) {
            throw new Error("Erreur de mise à jour du triage");
          }

          toast.success("Données enregistrées avec succès");
          return { lot: selectedAnalysis?.id };
        } catch (error) {
          console.error(error);
          toast.error("Donnée non enregistrée!!!");
          throw error;
        }

      }

      toast.success("Analyse granulométrique validée et enregistrée !");
      setIsModalOpen(false);
      setSelectedAnalysis(null);
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de l'enregistrement.");
    }
  };
  const [granulometrieAttente, setGranulometrieAttente] = useState([]);
  const [granulometrieHisto, setGranulometrieHisto] = useState([]);
  const [selectedTab, setSelectedTab] = useState("en_attente");
  const [granulometrieConfirmer, setGranulometrieConfirmer] = useState([]);
  const [searchAttenteQuery, setSearchAttenteQuery] = useState("");
  const [searchPendingQuery, setSearchPendingQuery] = useState("");
  const [searchHistoryQuery, setSearchHistoryQuery] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pointer, setPointer] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  useEffect(() => {
    const fetchPendingSamples = async () => {
      if (selectedTab === "en_attente") {
        try {
          const data = await fetchData(
            "get",
            `cafe/granulometrie/echantillons_attente/`,
            { params: { limit, offset: pointer, search: searchAttenteQuery } },
          );
          console.log(data, "dataaaa")
          // Traitement des données pour l'affichage
          const formattedData = (data?.results || []).map((item) => ({
            id: item.id,
            sampleId: "",
            transfertEchantillon: "Par coursier Ngozi",
            lotNumber: item.numero_lot,
            qualite: item.qualite,
            qteEchantillon: item?.quantite,
            sacsCount: item?.nombre_sacs,
            societe: item?.societe,
            deparcheur: item?.nom,
            receptionniste: item.receptionniste,
            codeEtiquette: item.code_etiquette,
            dateReception: new Date(item.date_reception).toLocaleDateString(),
            status: "receptionne"
          }));
          console.log(formattedData, "formattedData")

          setGranulometrieAttente(formattedData);
          setTotalCount(data?.count || 0);

        } catch (error) {
          console.error("Error fetching pending samples:", error);
        }
      }
      else if (selectedTab === "pending") {
        try {
          const data = await fetchData(
            "get",
            `cafe/granulometrie/pret_analyse/`,
            { params: { limit, offset: pointer, search: searchPendingQuery } },
          );
          console.log(data, "dataaaa")
          // Traitement des données pour l'affichage
          const formattedData = (data?.results || []).map((item) => ({
            id: item.id_granulometrie,
            sampleId: "",
            transfertEchantillon: "Par coursier Ngozi",
            lotNumber: item.numero_lot,
            qualite: item.qualite,
            qteEchantillon: item?.quantite,
            sacsCount: item?.nombre_sacs,
            societe: item?.societe,
            deparcheur: item?.nom,
            receptionniste: item.receptionniste,
            codeEtiquette: item.code_etiquette,
            dateReception: new Date(item.date_reception).toLocaleDateString(),
            status: "receptionne"
          }));

          setGranulometrieConfirmer(formattedData);
          setTotalCount(data?.count || 0);

        } catch (error) {
          console.error("Error fetching pending samples:", error);
        }
      }

      else if (selectedTab === "history") {
        try {
          const data = await fetchData(
            "get",
            `cafe/granulometrie/historique_analyses/`,
            { params: { limit, offset: pointer, search: searchHistoryQuery } },
          );
          console.log(data, "datahisto")
          // Traitement des données pour l'affichage
          const formattedData = (data?.results || []).map((item) => ({

            id: item.id,
            sampleId: item?.code_echantillon,
            transfertEchantillon: "Chauffeur ODECA",
            lotNumber: item.numero_lot,
            qualite: item.qualite,
            qteEchantillon: item?.quantite,
            sacsCount: item?.nombre_sacs,
            societe: item?.societe,
            deparcheur: item?.nom,
            receptionniste: item.receptionniste,
            codeEtiquette: item.code_etiquette,
            dateReception: item.date_reception,
            status: "granulometrie_complete",
            granulometrie: {
              quantite: item?.quantite,
              date: new Date(item.date_analyse).toLocaleString(),
              sieve_7_1: item?.tami_7_1,
              sieve_6_3: item?.tami_6_3,
              sieve_5_5: item?.tami_5_5,
              sieve_4_0: item?.tami_4_0,
              sieve_3_0: item?.tami_3_0,
              fond: item?.fond
            }
          }));

          setGranulometrieHisto(formattedData);
          setTotalCount(data?.count || 0);

        } catch (error) {
          console.error("Error fetching pending samples:", error);
        }

      }
    };

    fetchPendingSamples();
  }, [selectedTab, limit, pointer, searchAttenteQuery, searchPendingQuery, searchHistoryQuery, refreshTrigger]);

  const handleAnalyse = async (id) => {
    try {
      const res = await fetchData(
        "post",
        `/cafe/granulometrie/`,
        {
          params: {},
          additionalHeaders: {},
          body: {
            "comfirm_echantillon": id,
            "quanite": 300,
          },
        }
      );

      if (res.status !== 200 && res.status !== 201) {
        throw new Error("Erreur de mise à jour du triage");
      }

      toast.success("Données enregistrées avec succès");
      return { lot: id }
    } catch (error) {
      console.error(error);
      toast.error("Donnée non enregistrée!!!");
      throw error;
    }

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
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="en_attente">En attente</TabsTrigger>
          <TabsTrigger value="pending">Pret pour l'analyse</TabsTrigger>
          <TabsTrigger value="history">Status des analyses</TabsTrigger>
        </TabsList>

        <TabsContent value="en_attente">
          {/* 1. Pending Samples Table */}
          <Card className="shadow-md border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
            <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 dark:border-slate-800 p-6">
              <div>
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                  <Inbox className="h-5 w-5 text-primary" /> Échantillons en Attente d'Analyse Granulométrique
                </CardTitle>
                <CardDescription className="text-slate-500 dark:text-slate-400">
                  Échantillons réceptionnés au laboratoire n'ayant pas encore été testés au tamis.
                </CardDescription>
              </div>
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Rechercher code, lot..."
                  className="pl-9 h-9 text-sm"
                  value={searchAttenteQuery}
                  onChange={(e) => {
                    setSearchAttenteQuery(e.target.value);
                    setPointer(0);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {granulometrieAttente.length === 0 ? (
                <div className="text-center p-12 text-slate-500 dark:text-slate-400">
                  <CheckCircle className="h-10 w-10 text-emerald-500 mx-auto mb-3" />
                  <p className="font-semibold text-slate-700 dark:text-slate-300">Tous les échantillons ont été analysés !</p>
                  <p className="text-xs text-slate-400 mt-1">Aucun échantillon en attente de granulométrie.</p>
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
                        <TableHead>Qualité</TableHead>
                        <TableHead className="text-right">Quantité (kg)</TableHead>
                        <TableHead>Date Réception</TableHead>
                        <TableHead>Réceptionniste</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {granulometrieAttente.map((item) => (
                        <TableRow key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                          <TableCell className="pl-6">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align='start'>
                                <DropdownMenuItem className="cursor-pointer" onClick={() => handleAnalyse(item?.id)}>
                                  Analyser
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="cursor-pointer text-red-600 dark:text-red-400" onClick={() => toast.info(`Échantillon ${item.codeEtiquette} rejeté (démo)`)}>
                                  Rejeter
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                          <TableCell className="font-mono font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">{item.codeEtiquette}</TableCell>
                          <TableCell className="font-bold text-slate-700 dark:text-slate-300">{item.lotNumber}</TableCell>
                          <TableCell>{item.societe}</TableCell>
                          <TableCell>{item.qualite}</TableCell>
                          <TableCell className="text-right font-semibold">{item.qteEchantillon} kg</TableCell>
                          <TableCell className="text-xs text-slate-500">{item.dateReception}</TableCell>
                          <TableCell className="text-xs">{item.receptionniste}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
              {granulometrieAttente.length > 0 && (
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
        <TabsContent value="pending">
          {/* 1. Pending Samples Table */}
          <Card className="shadow-md border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
            <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 dark:border-slate-800 p-6">
              <div>
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                  <Inbox className="h-5 w-5 text-primary" /> Échantillons en Attente d'Analyse Granulométrique
                </CardTitle>
                <CardDescription className="text-slate-500 dark:text-slate-400">
                  Échantillons réceptionnés au laboratoire n'ayant pas encore été testés au tamis.
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
              {granulometrieConfirmer.length === 0 ? (
                <div className="text-center p-12 text-slate-500 dark:text-slate-400">
                  <CheckCircle className="h-10 w-10 text-emerald-500 mx-auto mb-3" />
                  <p className="font-semibold text-slate-700 dark:text-slate-300">Tous les échantillons ont été analysés !</p>
                  <p className="text-xs text-slate-400 mt-1">Aucun échantillon en attente de granulométrie.</p>
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
                        <TableHead>Qualité</TableHead>
                        <TableHead className="text-right">Quantité (kg)</TableHead>
                        <TableHead>Date Réception</TableHead>
                        <TableHead>Réceptionniste</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {granulometrieConfirmer.map((item) => (
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
                                  Saisir Granulométrie
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="cursor-pointer text-red-600 dark:text-red-400" onClick={() => toast.info(`Échantillon ${item.codeEtiquette} rejeté (démo)`)}>
                                  Rejeter
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                          <TableCell className="font-mono font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">{item.codeEtiquette}</TableCell>
                          <TableCell className="font-bold text-slate-700 dark:text-slate-300">{item.lotNumber}</TableCell>
                          <TableCell>{item.societe}</TableCell>
                          <TableCell>{item.qualite}</TableCell>
                          <TableCell className="text-right font-semibold">{item.qteEchantillon} kg</TableCell>
                          <TableCell className="text-xs text-slate-500">{item.dateReception}</TableCell>
                          <TableCell className="text-xs">{item.receptionniste}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
              {granulometrieConfirmer.length > 0 && (
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
                  <Clipboard className="h-5 w-5 text-primary" /> Analyses Granulométriques
                </CardTitle>
                <CardDescription className="text-slate-500 dark:text-slate-400">
                  Historique des calibres physiques calculés par échantillon anonyme.
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
              {granulometrieHisto.length === 0 ? (
                <div className="text-center p-12 text-slate-500 dark:text-slate-400">
                  <Clipboard className="h-10 w-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                  <p className="font-medium">Aucune analyse granulométrique terminée.</p>
                  <p className="text-xs text-slate-400 mt-1">Saisissez et validez les fractions tamisées d'un échantillon ci-dessus.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="pl-6 w-16">Action</TableHead>
                        <TableHead>Code Étiquette</TableHead>
                        <TableHead>Qualite</TableHead>
                        <TableHead>Société</TableHead>
                        <TableHead>Poids (g)</TableHead>
                        <TableHead>7.1 mm</TableHead>
                        <TableHead>6.3 mm</TableHead>
                        <TableHead>5.5 mm</TableHead>
                        <TableHead>4.0 mm</TableHead>
                        <TableHead>3.0 mm</TableHead>
                        <TableHead>Fond</TableHead>
                        <TableHead>Date Analyse</TableHead>
                        <TableHead className="pr-6">Statut Suivant</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {granulometrieHisto.map((item) => (
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
                                <DropdownMenuSeparator />
                                {item.status === "granulometrie_complete" && (
                                  <DropdownMenuItem className="cursor-pointer text-primary" onClick={() => toast.info(`Échantillon ${item.codeEtiquette} rejeté (démo)`)}>
                                    Triage manuel
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                          <TableCell className="font-mono font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">{item.codeEtiquette}</TableCell>
                          <TableCell className={`text-destructive`}>{item.qualite}</TableCell>
                          <TableCell>{item.societe}</TableCell>
                          <TableCell className="font-medium">{item.granulometrie.quantite} g</TableCell>
                          <TableCell className="text-slate-600 dark:text-slate-400">{item.granulometrie.sieve_7_1.toFixed(2)} %</TableCell>
                          <TableCell className="text-slate-600 dark:text-slate-400">{item.granulometrie.sieve_6_3.toFixed(2)} %</TableCell>
                          <TableCell className="text-slate-600 dark:text-slate-400">{item.granulometrie.sieve_5_5.toFixed(2)} %</TableCell>
                          <TableCell className="text-slate-600 dark:text-slate-400">{item.granulometrie.sieve_4_0.toFixed(2)} %</TableCell>
                          <TableCell className="text-slate-600 dark:text-slate-400">{item.granulometrie.sieve_3_0.toFixed(2)} %</TableCell>
                          <TableCell className="text-slate-600 dark:text-slate-400">{item.granulometrie.fond.toFixed(2)} %</TableCell>
                          <TableCell className="text-xs text-slate-500 whitespace-nowrap">{item.granulometrie.date}</TableCell>
                          <TableCell className="pr-6">
                            {item.status === "granulometrie_complete" ? (
                              <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[10px]">Analyse terminée</Badge>
                            ) : (
                              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]">Analyse en cours</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
              {granulometrieHisto.length > 0 && (
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

      {/* 3. Sifting Dialog Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-2xl bg-sidebar border border-slate-200 dark:border-slate-800 shadow-xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
              <BarChart3 className="h-6 w-6 text-primary" /> Fiche d'Analyse Granulométrique
            </DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-slate-400">
              Renseignez le poids fractionnaire retenu sur chaque tamis pour cet échantillon anonyme.
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
                  <span className="text-slate-400 block font-semibold uppercase">Société</span>
                  <span className="font-semibold">{selectedAnalysis.societe}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold uppercase">Qualité</span>
                  <span className="font-semibold">{selectedAnalysis.qualite}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold uppercase">Quantité reçue</span>
                  <span className="font-semibold">{selectedAnalysis.qteEchantillon.toFixed(2)} kg</span>
                </div>
              </div>

              {/* Date & Weight */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantite" className="font-bold text-slate-700 dark:text-slate-300">Quantité en entrée (g)</Label>
                  <Input type="number" id="quantite" name="quantite" value={formData.quantite} onChange={handleChange} className="font-semibold" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateGranulo" className="font-bold text-slate-700 dark:text-slate-300">Date de l'analyse</Label>
                  <Input type="date" id="dateGranulo" name="dateGranulo" value={formData.dateGranulo} onChange={handleChange} required />
                </div>
              </div>

              {/* Sieve Inputs */}
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Poids par maille de tamis (en %)</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { id: "sieve_7_1", label: "Tamis 7.1 mm" },
                  { id: "sieve_6_3", label: "Tamis 6.3 mm" },
                  { id: "sieve_5_5", label: "Tamis 5.5 mm" },
                  { id: "sieve_4_0", label: "Tamis 4 mm" },
                  { id: "sieve_3_0", label: "Tamis 3 mm" },
                  { id: "fond", label: "Tamis Fond" },
                ].map((sieve) => (
                  <div key={sieve.id} className="space-y-1.5 p-3 bg-slate-50/50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-900">
                    <Label htmlFor={sieve.id} className="text-xs font-bold text-slate-500">{sieve.label}</Label>
                    <Input type="number" step="0.01" min="0" max="100" id={sieve.id} name={sieve.id} value={formData[sieve.id]} onChange={handleChange} placeholder="%" required />
                  </div>
                ))}
              </div>

              {/* Live Sum */}
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-slate-400" />
                  <div>
                    <span className="text-xs font-semibold text-slate-500">Total cumulé</span>
                    <p className={`text-lg font-extrabold ${isSumPerfect ? "text-emerald-600 dark:text-emerald-400" : "text-amber-500"}`}>
                      {totalSum} % / 100%
                    </p>
                  </div>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={handleAutoFillFond} className="font-semibold text-xs border-dashed">
                  Calculer le Fond restant
                </Button>
              </div>

              {!isSumPerfect && (
                <div className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 text-amber-800 dark:text-amber-300 text-xs">
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-amber-500" />
                  <p>Le total cumulé doit être exactement égal à 100% pour valider l'analyse.</p>
                </div>
              )}

              <DialogFooter className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Annuler</Button>
                <Button type="submit" disabled={!isSumPerfect} className="font-semibold">
                  <CheckCircle className="mr-2 h-4 w-4" /> Enregistrer l'Analyse Physique
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
              <Scale className="h-6 w-6 text-primary" /> Détails de l'Analyse Granulométrique
            </DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-slate-400">
              Fiche complète des fractions physiques calculées par tamis pour cet échantillon.
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
                  <span className=" text-secondary text-lg">{selectedDetailItem.qualite}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-uppercase font-semibold">Quantité reçue</span>
                  <span className="font-semibold">{selectedDetailItem.qteEchantillon.toFixed(2)} kg</span>
                </div>
              </div>

              {/* Granulometrie Details */}
              <div className="space-y-3 bg-slate-50/20 dark:bg-slate-900/10 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                <h4 className="font-bold text-slate-900 dark:text-white border-b pb-1.5 flex items-center gap-1.5">
                  <BarChart3 className="h-4 w-4 text-primary" /> Fractions Physiques par Tamis
                </h4>
                <div className="grid grid-cols-2 gap-4 text-xs font-medium">
                  <div>
                    <span className="text-slate-400 block">Date d'analyse</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{selectedDetailItem.granulometrie.date}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Quantité en entrée</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{selectedDetailItem.granulometrie.quantite} g</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 pt-2">
                  {[
                    { label: "Tamis 7.1 mm", value: selectedDetailItem.granulometrie.sieve_7_1 },
                    { label: "Tamis 6.3 mm", value: selectedDetailItem.granulometrie.sieve_6_3 },
                    { label: "Tamis 5.5 mm", value: selectedDetailItem.granulometrie.sieve_5_5 },
                    { label: "Tamis 4.0 mm", value: selectedDetailItem.granulometrie.sieve_4_0 },
                    { label: "Tamis 3.0 mm", value: selectedDetailItem.granulometrie.sieve_3_0 },
                    { label: "Fond", value: selectedDetailItem.granulometrie.fond },
                  ].map((sieve) => (
                    <div key={sieve.label} className="p-2.5 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-900 text-center">
                      <span className="text-[10px] text-slate-400 block font-semibold uppercase">{sieve.label}</span>
                      <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{sieve.value.toFixed(2)} %</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between p-3 bg-emerald-50/50 dark:bg-emerald-950/10 rounded-lg border border-emerald-200/50 dark:border-emerald-900/30 mt-2">
                  <span className="text-xs font-semibold text-slate-500">Total cumulé</span>
                  <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                    {(selectedDetailItem.granulometrie.sieve_7_1 + selectedDetailItem.granulometrie.sieve_6_3 + selectedDetailItem.granulometrie.sieve_5_5 + selectedDetailItem.granulometrie.sieve_4_0 + selectedDetailItem.granulometrie.sieve_3_0 + selectedDetailItem.granulometrie.fond).toFixed(2)} %
                  </span>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Statut suivant</span>
                {selectedDetailItem.status === "granulometrie_complete" ? (
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20">Analyse terminée</Badge>
                ) : (
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Analyse en cours</Badge>
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
