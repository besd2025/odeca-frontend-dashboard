"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchData } from "@/app/_utils/api";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Tag, Clipboard, Inbox, Calendar, User, FileText, ArrowRight, Truck, CheckCircle, Search, Trash2, ShieldAlert, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PaginationContent from "@/components/ui/pagination-content";

// ==========================================
// MOCKED DATA (ILLUSTRATION POUR LE DESIGN)
// ==========================================
const initialPendingSamples = [
  {
    id: "ECH-2026-001",
    lotNumber: "LOT-2026-001",
    societe: "COCOCA",
    deparcheur: "Usine Ngozi SOGESTAL",
    qualite: "15+",
    sacsCount: 150,
    qtePrelevee: 15000, // en grammes (15 kg)
    dateEchantillonnage: "2026-05-25",
    echantillonneur: "Jean Nkurunziza"
  },
  {
    id: "ECH-2026-002",
    lotNumber: "LOT-2026-002",
    societe: "BURUNDI SPECIALTY COFFEE",
    deparcheur: "Usine Gitega SOGESTAL",
    qualite: "FWTT",
    sacsCount: 320,
    qtePrelevee: 32000, // en grammes (32 kg)
    dateEchantillonnage: "2026-05-26",
    echantillonneur: "Alice Harriman"
  },
  {
    id: "ECH-2026-003",
    lotNumber: "LOT-2026-003",
    societe: "KIBIRA COFFEE",
    deparcheur: "Usine Kayanza SOGESTAL",
    qualite: "TT",
    sacsCount: 85,
    qtePrelevee: 8500, // en grammes (8.5 kg)
    dateEchantillonnage: "2026-05-27",
    echantillonneur: "Pierre Nkurunziza"
  }
];

const initialLabAnalyses = [
  {
    id: "LAB-ANA-1",
    sampleId: "ECH-2026-004",
    transfertEchantillon: "Par coursier Ngozi",
    lotNumber: "LOT-2026-004",
    qteEchantillon: 15.0, // kg
    qualite: "15+",
    sacsCount: 120,
    societe: "COPROCA",
    deparcheur: "Usine Ngozi SOGESTAL",
    echantillonneur: "Jean Nkurunziza",
    receptionniste: "Marc Ndayishimiye",
    codeEtiquette: "LAB-ETQ-26-004-9843",
    dateReception: "2026-05-28",
    status: "receptionne",
    createdAt: "2026-05-28T10:00:00.000Z"
  },
  {
    id: "LAB-ANA-2",
    sampleId: "ECH-2026-005",
    transfertEchantillon: "Chauffeur ODECA",
    lotNumber: "LOT-2026-005",
    qteEchantillon: 24.5, // kg
    qualite: "FWTT",
    sacsCount: 200,
    societe: "KAWASE COFFEE",
    deparcheur: "Usine Gitega SOGESTAL",
    echantillonneur: "Alice Harriman",
    receptionniste: "Jean-Marie Vianney",
    codeEtiquette: "LAB-ETQ-26-005-2311",
    dateReception: "2026-05-29",
    status: "granulometrie_complete",
    createdAt: "2026-05-29T11:00:00.000Z"
  }
];

export default function ReceptionPage() {
  const [samples, setSamples] = useState(initialPendingSamples);
  const [labAnalyses, setLabAnalyses] = useState(initialLabAnalyses);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSample, setSelectedSample] = useState(null);

  // Detail Modal States
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedDetailItem, setSelectedDetailItem] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchPendingQuery, setSearchPendingQuery] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pointer, setPointer] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [formData, setFormData] = useState({
    id: "",
    transfertEchantillon: "",
    lotNumber: "",
    qteEchantillon: "",
    sacsCount: "",
    societe: "",
    deparcheur: "",
    echantillonneur: "",
    receptionniste: "",
    prenom_receptionniste: "",
    phone_receptionniste: "",
    codeEtiquette: "",
    dateReception: new Date().toISOString().split("T")[0],
  });

  // ==============================================================
  // BRANCHEMENT BACKEND : Charger les données depuis le serveur
  // ==============================================================
  useEffect(() => {
    // POUR LE BACKEND : Charger les échantillons physiques en attente et l'historique
    /*
    async function fetchData() {
      try {
        const samplesRes = await fetch("/api/production/samples/pending-reception");
        const samplesData = await samplesRes.json();
        setSamples(samplesData);

        const analysesRes = await fetch("/api/production/laboratoire/analyses");
        const analysesData = await analysesRes.json();
        setLabAnalyses(analysesData);
      } catch (err) {
        console.error("Erreur de chargement des données", err);
      }
    }
    fetchData();
    */
  }, []);

  // Filter out samples already received in the lab (if any)
  const receivedSampleIds = labAnalyses.map((analysis) => analysis.sampleId);
  const pendingSamples = samples.filter((sample) => !receivedSampleIds.includes(sample.id));

  // Open modal for a specific pending sample
  const handleOpenConfirmModal = (sample) => {
    setSelectedSample(sample);

    // Auto-generate anonymous label code: LAB-ETQ-26-XXXXX
    const numericPart = String(sample.id).split("-").pop() || Math.floor(100 + Math.random() * 900).toString();
    const randomPart = Math.floor(1000 + Math.random() * 9000).toString();
    //const codeEtiquette = `LAB-ETQ-26-${numericPart}-${randomPart}`;

    // Convert quantity from grams to kilograms if it is large, or display directly
    const qtyInKg = sample.qtePrelevee ? (sample.qtePrelevee / 1000).toFixed(2) : "0.00";

    setFormData({
      id: sample.id || "",
      transfertEchantillon: "",
      lotNumber: sample.lotNumber || "",
      qteEchantillon: qtyInKg,
      sacsCount: sample.sacsCount || "",
      societe: sample.societe || "",
      deparcheur: sample.deparcheur || "",
      echantillonneur: sample.echantillonneur || "",
      receptionniste: "",
      prenom_receptionniste: "",
      phone_receptionniste: "",
      codeEtiquette: "",
      dateReception: new Date().toISOString().split("T")[0],
    });

    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedSample) {
      toast.error("Échantillon invalide.");
      return;
    }
    if (!formData.receptionniste) {

      toast.error("Veuillez renseigner le nom du réceptionniste.");
      return;
    }
    if (!formData.codeEtiquette) {

      toast.error("Veuillez renseigner le code etiquette.");
      return;
    }
    if (!formData.dateReception) {

      toast.error("Veuillez renseigner la date de reception.");
      return;
    }

    const newAnalysis = {
      id: `LAB-ANA-${Date.now()}`,
      sampleId: selectedSample.id,
      transfertEchantillon: formData.transfertEchantillon || "Coursier ODECA",
      lotNumber: formData.lotNumber,
      qteEchantillon: parseFloat(formData.qteEchantillon),
      sacsCount: parseInt(formData.sacsCount) || 0,
      societe: formData.societe,
      deparcheur: formData.deparcheur,
      echantillonneur: formData.echantillonneur,
      receptionniste: formData.receptionniste,
      codeEtiquette: formData.codeEtiquette,
      dateReception: formData.dateReception,
      status: "receptionne",
      createdAt: new Date().toISOString(),
    };
    console.log(formData?.id);
    try {
      const res = await fetchData(
        "post",
        `/cafe/comfirmation_echantillon/`,
        {
          params: {},
          additionalHeaders: {},
          body: {
            "echantillon": selectedSample.id,
            "code_etiquette": formData.codeEtiquette,
            "receptioniste_nom": formData.receptionniste,
            "receptioniste_prenom": formData.prenom_receptionniste,
            "receptioniste_phone": formData.phone_receptionniste,
            "date_comfirmation": formData.dateReception,

          },
        }
      );

      if (res.status !== 200 && res.status !== 201) {
        throw new Error("Erreur de mise à jour du triage");
      }

      toast.success("Données enregistrées avec succès");
      setIsModalOpen(false);
      setSelectedSample(null);
      setRefreshTrigger((prev) => prev + 1);
      return { lot: selectedSample?.lotNumber };
    } catch (error) {
      console.error(error);
      toast.error("Donnée non enregistrée!!!");
      throw error;
    }

  };

  const handleDeleteAnalysis = (id) => {
    setEchantillonsHisto(echantillonsHisto.filter((item) => item.id !== id));
    toast.success("Enregistrement de laboratoire supprimé (Illustration locale)");
  };

  const [data, setData] = useState([])
  const [echantillons, setEchantillons] = useState([]);
  const [echantillonsHisto, setEchantillonsHisto] = useState([]);
  const [tabs, setTabs] = useState("reception");

  const filteredAnalyses = echantillonsHisto || [];
  const filteredPending = echantillons || [];

  React.useEffect(() => {
    const fetchEchantillons = async () => {
      if (tabs === "reception") {
        try {
          const response = await fetchData("get", `cafe/echantillonage/en-attente-reception/`, {
            params: { limit, offset: pointer, search: searchPendingQuery }
          });
          const dataResponse = response?.results || [];
          setTotalCount(response?.count || 0);

          const formattedData = dataResponse.map((item) => ({
            id: item.id,
            id_prelevement: item?.id_prelevement,
            lotNumber: item?.numero_lot,
            societe: item?.societe_proprietaire,
            deparcheur: item?.deparcheur_usine,
            sacsCount: item?.nombre_sacs,
            qtePrelevee: item?.volume_preleve,
            qualite: item?.qualite_nom,
            dateEchantillonnage: item?.date_prelevement,
            echantillonneur: item.nomAgentEchantillonneur
          }));

          setEchantillons(formattedData);

        } catch (error) {
          console.error("Error fetching pending samples:", error);
        }
      } else if (tabs === "history") {
        try {
          const response = await fetchData("get", `cafe/echantillonage/historique_echantillonage/`, {
            params: { limit, offset: pointer, search: searchQuery }
          });
          const dataResponse = response?.results || [];
          setTotalCount(response?.count || 0);
          const formattedData = dataResponse.map((item) => ({
            id: item.id,
            id_prelevement: item?.id_prelevement,
            lotNumber: item?.numero_lot,
            societe: item?.societe_proprietaire,
            deparcheur: item?.deparcheur_usine,
            sacsCount: item?.nombre_sacs,
            qtePrelevee: item?.quantite || item?.volume_preleve || 0,
            qteEchantillon: item?.quantite || item?.volume_preleve || 0,
            qualite: item?.qualite_nom,
            dateEchantillonnage: item?.date_prelevement,
            echantillonneur: item.nomAgentEchantillonneur || item?.echantillonneur,
            receptionniste: item?.receptionniste || item?.receptioniste_nom,
            codeEtiquette: item?.code_etiquette || item?.codeEtiquette,
            dateReception: item?.date_reception || item?.date_comfirmation || item?.date_prelevement,
            sampleId: item?.id_prelevement,
          }));

          setEchantillonsHisto(formattedData);
          console.log("EchantillonseeeeeeYYYY", response);
        } catch (error) {
          console.error("Error fetching pending samples:", error);
        }
      }
    };
    fetchEchantillons();
  }, [tabs, limit, pointer, searchQuery, searchPendingQuery, refreshTrigger]);

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
      return { lot: selectedSample?.lotNumber };
    } catch (error) {
      console.error(error);
      toast.error("Donnée non enregistrée!!!");
      throw error;
    }

  };
  return (
    <div className="space-y-6">
      <Tabs
        value={tabs}
        onValueChange={(val) => {
          setTabs(val);
          setPointer(0);
          setCurrentPage(1);
        }}
        className=""
      >
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="reception">Réception</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>
        <TabsContent value="reception">
          {/* 1. Pending Physical Samples Section */}
          <Card className="shadow-md border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
            <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 dark:border-slate-800 p-6">
              <div>
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                  <Inbox className="h-5 w-5 text-primary" /> Échantillons en Attente de Réception
                </CardTitle>
                <CardDescription className="text-slate-500 dark:text-slate-400">
                  Liste des prélèvements physiques effectués en usine et prêtes à être codés au laboratoire.
                </CardDescription>
              </div>
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Rechercher prélèvement, lot..."
                  value={searchPendingQuery}
                  onChange={(e) => {
                    setSearchPendingQuery(e.target.value);
                    setPointer(0);
                    setCurrentPage(1);
                  }}
                  className="pl-9 h-9 text-sm"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {filteredPending.length === 0 ? (
                <div className="text-center p-12 text-slate-500 dark:text-slate-400">
                  <CheckCircle className="h-10 w-10 text-emerald-500 mx-auto mb-3" />
                  <p className="font-semibold text-slate-700 dark:text-slate-300">Tous les échantillons ont été réceptionnés !</p>
                  <p className="text-xs text-slate-400 mt-1">Aucun nouveau prélèvement en attente.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-left pl-6 w-16">Action</TableHead>
                        <TableHead>ID Prélèvement</TableHead>
                        <TableHead>Numéro de Lot</TableHead>
                        <TableHead>Société / Propriétaire</TableHead>
                        <TableHead>Déparcheur / Usine</TableHead>
                        <TableHead className="text-right">Qualite</TableHead>
                        <TableHead className="text-right">Sacs</TableHead>
                        <TableHead className="text-right">Volume Prélevé</TableHead>
                        <TableHead>Date d'Echantillon</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPending?.map((sample) => (
                        <TableRow key={sample.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                          <TableCell className="pl-6">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align='start'>
                                <DropdownMenuItem className="cursor-pointer" onClick={() => handleOpenConfirmModal(sample)}>
                                  Confirmer Réception
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer text-red-600 dark:text-red-400" onClick={() => toast.info(`Prélèvement ${sample.id} rejeté (démo)`)}>
                                  Rejeter
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                          <TableCell className="font-semibold">{sample.id_prelevement}</TableCell>
                          <TableCell className="font-bold text-slate-700 dark:text-slate-300">{sample.lotNumber}</TableCell>
                          <TableCell>{sample.societe}</TableCell>
                          <TableCell className="text-xs text-slate-500">{sample.deparcheur}</TableCell>
                          <TableCell className="text-xs text-slate-500">{sample.qualite}</TableCell>
                          <TableCell className="text-right">{sample.sacsCount} sacs</TableCell>
                          <TableCell className="text-right font-semibold">{sample.qtePrelevee}</TableCell>
                          <TableCell className="text-xs text-slate-500">{sample.dateEchantillonnage}</TableCell>
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
          {/* 2. Received Samples History Section */}
          <Card className="shadow-md border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
            <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 dark:border-slate-800 p-6">
              <div>
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                  <Clipboard className="h-5 w-5 text-primary" /> 📋 Historique des Échantillons Réceptionnés
                </CardTitle>
                <CardDescription className="text-slate-500 dark:text-slate-400">
                  Registre des codages à l'aveugle et des réceptions d'échantillons au laboratoire.
                </CardDescription>
              </div>
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Rechercher étiquette, lot, propriétaire..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPointer(0);
                    setCurrentPage(1);
                  }}
                  className="pl-9 h-9 text-sm"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {echantillonsHisto?.length === 0 ? (
                <div className="text-center p-12 text-slate-500 dark:text-slate-400">
                  <Tag className="h-10 w-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                  <p className="font-medium">Aucun échantillon réceptionné pour le moment.</p>
                  <p className="text-xs text-slate-400 mt-1">Validez un prélèvement d'usine ci-dessus.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="pl-6 w-16">Action</TableHead>
                        <TableHead>Code Étiquette</TableHead>
                        <TableHead>Numéro de Lot</TableHead>
                        <TableHead>Société / Propriétaire</TableHead>
                        <TableHead className="text-right">Qualite</TableHead>
                        <TableHead className="text-right">Quantité</TableHead>
                        <TableHead>Réceptionniste</TableHead>
                        <TableHead>Date Réception</TableHead>
                        <TableHead>Statut</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAnalyses?.map((item) => (
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
                                {/* <DropdownMenuItem
                                  onClick={() => handleAnalyse(item.id)}
                                >
                                  Analyser
                                </DropdownMenuItem> */}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="cursor-pointer text-red-600 dark:text-red-400 font-semibold" onClick={() => handleDeleteAnalysis(item.id)}>
                                  Supprimer
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                          <TableCell className="font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">
                            {item.id_prelevement}
                          </TableCell>
                          <TableCell className="font-semibold text-slate-700 dark:text-slate-300">{item.lotNumber}</TableCell>
                          <TableCell>{item.societe}</TableCell>
                          <TableCell className="text-right font-semibold">{item.qualite}</TableCell>
                          <TableCell className="text-right font-semibold">{item.qteEchantillon} kg</TableCell>
                          <TableCell className="text-xs">{item.receptionniste}</TableCell>
                          <TableCell className="text-xs text-slate-500 whitespace-nowrap">{item.date_prelevement}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                              Réceptionné
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
              {filteredAnalyses.length > 0 && (
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

      {/* 3. Confirm Check-in Dialog Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-2xl bg-sidebar border border-slate-200 dark:border-slate-800 shadow-xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
              <Tag className="h-6 w-6 text-primary" /> Réceptionner & Coder l'Échantillon
            </DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-slate-400">
              Validez la réception du prélèvement physique et attribuez un code anonyme à l'échantillon.
            </DialogDescription>
          </DialogHeader>

          {selectedSample && (
            <form onSubmit={handleSubmit} className="space-y-6 pt-4 text-slate-950 dark:text-white">
              {/* Prefilled Factory Metadata */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50/50 dark:bg-slate-900/30 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-sm">
                <div>
                  <span className="text-slate-400 block uppercase">ID Prélèvement</span>
                  <span className="font-bold">{selectedSample.id}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-uppercase">Numéro de Lot</span>
                  <span className="font-bold">{selectedSample.lotNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-uppercase">Propriétaire / Société</span>
                  <span className="font-semibold">{selectedSample.societe}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-uppercase">Usine de déparchage</span>
                  <span className="font-semibold">{selectedSample.deparcheur}</span>
                </div>
                <div className="col-span-2 border-t border-slate-100 dark:border-slate-800/80 pt-2 grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-400 block ">Volume total représenté</span>
                    <span>{selectedSample.sacsCount} sacs</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold">Échantillonneur</span>
                    <span>{selectedSample.echantillonneur}</span>
                  </div>
                  <div>
                    <span className=" font-semibold uppercase flex items-center gap-1"><Tag className="h-4 w-4 text-secondary" /> Qualité de l'échantillon</span>
                    <span className="text-secondary font-semibold text-xl ml-5">{selectedSample.qualite}</span>
                  </div>
                </div>
              </div>

              {/* Lab Specific Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="qteEchantillon" className="font-bold text-slate-700 dark:text-slate-300">
                    Quantité de l’échantillon (kg)
                  </Label>
                  <div className="relative">
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      id="qteEchantillon"
                      name="qteEchantillon"
                      value={formData.qteEchantillon}
                      onChange={handleChange}
                      className="pl-10 text-slate-950 dark:text-white"
                      required
                    />
                    <FileText className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="receptionniste" className="font-bold text-slate-700 dark:text-slate-300">
                    Réceptionniste
                  </Label>
                  <div className="relative">
                    <Input
                      type="text"
                      id="receptionniste"
                      name="receptionniste"
                      value={formData.receptionniste}
                      onChange={handleChange}
                      placeholder="Nom"
                      className="pl-10 text-slate-950 dark:text-white"
                      required
                    />
                    <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prenom_receptionniste" className="font-bold text-slate-700 dark:text-slate-300">
                    Prenom du réceptionniste
                  </Label>
                  <div className="relative">
                    <Input
                      type="text"
                      id="prenom_receptionniste"
                      name="prenom_receptionniste"
                      value={formData.prenom_receptionniste}
                      onChange={handleChange}
                      placeholder="Prenom"
                      className="pl-10 text-slate-950 dark:text-white"
                      required
                    />
                    <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone_receptionniste" className="font-bold text-slate-700 dark:text-slate-300">
                    Telephone du réceptionniste
                  </Label>
                  <div className="relative">
                    <Input
                      type="text"
                      id="phone_receptionniste"
                      name="phone_receptionniste"
                      value={formData.phone_receptionniste}
                      onChange={handleChange}
                      placeholder="Telephone"
                      className="pl-10 text-slate-950 dark:text-white"
                      required
                    />
                    <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateReception" className="font-bold text-slate-700 dark:text-slate-300">
                    Date de réception
                  </Label>
                  <div className="relative">
                    <Input
                      type="date"
                      id="dateReception"
                      name="dateReception"
                      value={formData.dateReception}
                      onChange={handleChange}
                      className="pl-10 text-slate-950 dark:text-white"
                      required
                    />
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  </div>
                </div>

                {/* Anonymous Label Code generated */}
                <div className="space-y-2">
                  <Label className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <Clipboard className="h-4 w-4" /> Code Étiquette Généré
                  </Label>
                  <Input
                    type="text"
                    id="codeEtiquette"
                    name="codeEtiquette"
                    value={formData.codeEtiquette}
                    onChange={handleChange}
                    className="bg-emerald-50/30 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-400 font-bold select-all tracking-wider font-mono"
                  />
                </div>
              </div>

              <DialogFooter className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit">
                  Confirmer & Coder l'Échantillon
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
              <Clipboard className="h-6 w-6 text-primary" /> Détails de l'Échantillon Réceptionné
            </DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-slate-400">
              Fiche complète de réception de l'échantillon au laboratoire.
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
                  <span className="text-slate-400 block uppercase font-semibold">ID Prélèvement</span>
                  <span className="font-bold">{selectedDetailItem.sampleId}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-uppercase font-semibold">Numéro de Lot</span>
                  <span className="font-bold">{selectedDetailItem.lotNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-uppercase font-semibold">Propriétaire / Société</span>
                  <span className="font-semibold">{selectedDetailItem.societe}</span>
                </div>
                <div className="col-span-2 border-t border-slate-100 dark:border-slate-800/80 pt-2 grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-400 block font-uppercase font-semibold">Usine de déparchage</span>
                    <span className="font-semibold">{selectedDetailItem.deparcheur}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-uppercase font-semibold">Volume total représenté</span>
                    <span>{selectedDetailItem.sacsCount} sacs</span>
                  </div>
                </div>
              </div>

              {/* Lab Specific Details */}
              <div className="space-y-3 bg-slate-50/20 dark:bg-slate-900/10 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                <h4 className="font-bold text-slate-900 dark:text-white border-b pb-1.5 flex items-center gap-1.5">
                  <Tag className="h-4 w-4 text-primary" /> Informations Laboratoire
                </h4>
                <div className="grid grid-cols-2 gap-4 text-xs font-medium">
                  <div>
                    <span className="text-slate-400 block">Quantité de l'échantillon</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{selectedDetailItem.qteEchantillon} kg</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Réceptionniste</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{selectedDetailItem.receptionniste}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Date de réception</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{selectedDetailItem.dateReception}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Statut</span>
                    <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 mt-0.5">
                      Réceptionné
                    </Badge>
                  </div>
                </div>
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
