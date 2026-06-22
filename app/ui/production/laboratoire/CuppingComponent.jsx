"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Coffee, Clipboard, Users, CheckCircle, Search, Sparkles, MessageSquare, Inbox, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { fetchData } from "@/app/_utils/api";
// ==========================================
// MOCKED DATA (ILLUSTRATION POUR LE DESIGN)
// ==========================================
const initialLabAnalyses = [
  {
    id: "LAB-ANA-3",
    sampleId: "ECH-2026-003",
    transfertEchantillon: "Coursier Kayanza",
    lotNumber: "LOT-2026-003",
    qteEchantillon: 8.5,
    sacsCount: 85,
    societe: "KIBIRA COFFEE",
    qualite: "15+",
    deparcheur: "Usine Kayanza SOGESTAL",
    receptionniste: "Marc Ndayishimiye",
    codeEtiquette: "LAB-ETQ-26-003-8812",
    dateReception: "2026-05-30",
    status: "triage_complete",
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
  },
  {
    id: "LAB-ANA-4",
    sampleId: "ECH-2026-004",
    transfertEchantillon: "Chauffeur ODECA",
    lotNumber: "LOT-2026-004",
    qteEchantillon: 12.0,
    sacsCount: 100,
    societe: "COPROCA",
    qualite: "15+",
    deparcheur: "Usine Ngozi SOGESTAL",
    receptionniste: "Marc Ndayishimiye",
    codeEtiquette: "LAB-ETQ-26-004-7744",
    dateReception: "2026-05-28",
    status: "degustation_complete",
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
    }
  }
];

export default function CuppingComponent() {
  // UI States Only
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedDetailItem, setSelectedDetailItem] = useState(null);

  const [formData, setFormData] = useState({
    qteTorrefier: "200",
    observation: "",
    nbDegustateurs: "3",
    moyenne: "",
    qualite: "Qualité",
  });

  // Static Data Presentation
  const pendingAnalyses = initialLabAnalyses.filter((item) => item.status === "triage_complete");
  const completedAnalyses = initialLabAnalyses.filter(
    (item) => item.status !== "receptionne" && item.status !== "granulometrie_complete" && item.status !== "triage_complete" && item.degustation
  );

  const handleOpenModal = (analysis) => {
    setSelectedAnalysis(analysis);
    setFormData({
      qteTorrefier: "200",
      observation: "",
      nbDegustateurs: "3",
      moyenne: "",
      qualite: "Qualité",
    });
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    const avgVal = parseFloat(formData.moyenne);
    if (isNaN(avgVal) || avgVal < 0 || avgVal > 100) {
      toast.error("Veuillez renseigner une moyenne valide entre 0 et 100.");
      return;
    }
    const body = {
      triage_id: selectedAnalysis?.id,
      quantite_torrefier: formData.qteTorrefier,
      observation: formData.observation,
      nombre_degustateurs: formData.nbDegustateurs,
      note_moyenne: formData.moyenne,
    }
    console.log("body", body);
    try {
      const response = await fetchData("post", "cafe/torrefaction/enregistrer_torrefaction/",
        { params: {}, additionalHeaders: {}, body: body });
      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Erreur de mise à jour du triage");
      }

      toast.success("Torréfaction & Dégustation validées avec succès ! ");
      setIsModalOpen(false);
      setSelectedAnalysis(null);
    } catch (error) {
      console.error(error);
      toast.error("Donnée non enregistrée!!!");
      throw error;
    }
  };
  const [selectedTab, setSelectedTab] = useState("pending");
  const [pendingData, setPendingData] = useState([]);
  const [completedData, setCompletedData] = useState([]);
  React.useEffect(() => {
    const fetchPendingAnalyses = async () => {
      if (selectedTab === "pending") {


        try {
          const response = await fetchData("get", "cafe/torrefaction/pret_pour_torrefaction/",
            { params: {}, additionalHeaders: {}, body: {} });
          console.log("les analyses:", response);
          const analyses = response?.results?.map((item) => ({
            id: item.id,
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
            taux_defauts: item.taux_defauts,
            date_triage: new Date(item.date_triage).toLocaleDateString()

          }));
          console.log("les analyses", analyses);
          setPendingData(analyses);
        } catch (error) {
          console.error("Error fetching pending analyses:", error);
        }
      }
      if (selectedTab === "history") {
        try {
          const response = await fetchData("get", "cafe/degustation/historique_degustations/",
            { params: {}, additionalHeaders: {}, body: {} });
          console.log("les analyse_EEEE:", response);
          const analyses = response?.results?.map((item) => ({
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
  }, [selectedTab]);


  return (
    <div className="space-y-6">

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="pending">Pret pour la dégustation</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          {/* 1. Pending Samples Table */}
          <Card className="shadow-md border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
            <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 dark:border-slate-800 p-6">
              <div>
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                  <Inbox className="h-5 w-5 text-amber-600" /> Échantillons en Attente de Dégustation
                </CardTitle>
                <CardDescription className="text-slate-500 dark:text-slate-400">
                  Échantillons ayant passé le triage manuel, prêts pour la torréfaction et l'évaluation en tasse.
                </CardDescription>
              </div>
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input placeholder="Rechercher code, lot..." className="pl-9 h-9 text-sm" />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {pendingData.length === 0 ? (
                <div className="text-center p-12 text-slate-500 dark:text-slate-400">
                  <CheckCircle className="h-10 w-10 text-emerald-500 mx-auto mb-3" />
                  <p className="font-semibold text-slate-700 dark:text-slate-300">Tous les échantillons ont été dégustés !</p>
                  <p className="text-xs text-slate-400 mt-1">Aucun échantillon en attente de cupping.</p>
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
                        <TableHead>Date Triage</TableHead>
                        <TableHead className="text-right">Taux Défauts</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingData.map((item) => (
                        <TableRow key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                          <TableCell className="pl-6">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align='start'>
                                <DropdownMenuItem className="cursor-pointer font-semibold" onClick={() => handleOpenModal(item)}>
                                  Torréfier
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="cursor-pointer text-red-600 dark:text-red-400 font-semibold" onClick={() => toast.info(`Échantillon ${item.codeEtiquette} rejeté (démo)`)}>
                                  Rejeter
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                          <TableCell className="font-mono font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">{item.codeEtiquette}</TableCell>
                          <TableCell className="font-bold text-slate-700 dark:text-slate-300">{item.lotNumber}</TableCell>
                          <TableCell>{item.societe}</TableCell>
                          <TableCell>{item.qualite}</TableCell>
                          <TableCell className="text-xs text-slate-500">{item.date_triage}</TableCell>
                          <TableCell className="text-right font-bold text-slate-800 dark:text-slate-200">{item.taux_defauts}%</TableCell>
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
          {/* 2. History Table */}
          <Card className="shadow-md border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
            <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 dark:border-slate-800 p-6">
              <div>
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                  <Clipboard className="h-5 w-5 text-primary" />Fiches de Cupping Validées
                </CardTitle>
                <CardDescription className="text-slate-500 dark:text-slate-400">
                  Historique des évaluations organoleptiques des cafés testés en aveugle.
                </CardDescription>
              </div>
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input placeholder="Rechercher code, lot, qualité..." className="pl-9 h-9 text-sm" />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {completedData.length === 0 ? (
                <div className="text-center p-12 text-slate-500 dark:text-slate-400">
                  <Coffee className="h-10 w-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                  <p className="font-medium">Aucun cupping enregistré.</p>
                  <p className="text-xs text-slate-400 mt-1">Validez la dégustation d'un échantillon ci-dessus.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="pl-6 w-16">Action</TableHead>
                        <TableHead>Code Étiquette</TableHead>
                        <TableHead>Torréfié (g)</TableHead>
                        <TableHead>Dégustateurs</TableHead>
                        <TableHead>Observations</TableHead>
                        <TableHead>Note Cupping</TableHead>
                        <TableHead>Appréciation</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="pr-6">Suivant</TableHead>
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
                                <DropdownMenuItem className="cursor-pointer font-semibold" onClick={() => {
                                  setSelectedDetailItem(item);
                                  setIsDetailModalOpen(true);
                                }}>
                                  Détails
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                          <TableCell className="font-mono font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">{item.codeEtiquette}</TableCell>
                          <TableCell>{item.degustation.qteTorrefier} g</TableCell>
                          <TableCell>{item.degustation.nbDegustateurs} experts</TableCell>
                          <TableCell className="max-w-xs truncate text-xs text-slate-500" title={item.degustation.observation}>{item.degustation.observation}</TableCell>
                          <TableCell className="font-extrabold text-amber-600">{item.degustation.moyenne.toFixed(2)} / 100</TableCell>
                          <TableCell>
                            <Badge className={item.degustation.qualite === "Qualité" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"}>
                              {item.degustation.qualite}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs text-slate-500 whitespace-nowrap">{item.date_triage}</TableCell>
                          <TableCell className="pr-6">
                            {item.status === "degustation_complete" ? (
                              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]">Attente Décision</Badge>
                            ) : (
                              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]">Finalisé</Badge>
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

      {/* 3. Cupping Dialog Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-2xl bg-sidebar border border-slate-200 dark:border-slate-800 shadow-xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
              <Coffee className="h-6 w-6 text-amber-600 animate-pulse" /> Fiche de Torréfaction & Cupping
            </DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-slate-400">
              Renseignez l'évaluation organoleptique et la note de tasse finale.
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
                  <span className="text-slate-400 block font-semibold uppercase">Qualité</span>
                  <span className="font-bold text-primary text-xl uppercase">{selectedAnalysis.qualite}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold uppercase">Triage du</span>
                  <span className="font-semibold">{selectedAnalysis.triage?.date}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold uppercase">Taux total de défauts</span>
                  <span className="font-bold text-red-500">{selectedAnalysis.triage?.totalDefectPct.toFixed(2)} %</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="qteTorrefier" className="font-bold text-slate-700 dark:text-slate-300">Quantité à torréfier (g)</Label>
                  <Input type="number" id="qteTorrefier" name="qteTorrefier" value={formData.qteTorrefier} onChange={handleChange} className="font-semibold" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nbDegustateurs" className="font-bold text-slate-700 dark:text-slate-300">Nombres des dégustateurs</Label>
                  <div className="relative">
                    <Input type="number" step="1" min="1" id="nbDegustateurs" name="nbDegustateurs" value={formData.nbDegustateurs} onChange={handleChange} className="pl-10 font-medium" required />
                    <Users className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="moyenne" className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    Note Moyenne (/ 100)
                  </Label>
                  <Input type="number" step="0.01" min="0" max="100" id="moyenne" name="moyenne" value={formData.moyenne} onChange={handleChange} placeholder="Ex: 84.50" className="font-bold" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="observation" className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <MessageSquare className="h-4 w-4 text-slate-400" /> Observation (Torréfaction & Tasse)
                </Label>
                <textarea
                  id="observation"
                  name="observation"
                  value={formData.observation}
                  onChange={handleChange}
                  placeholder="Notes sur la torréfaction et le profil aromatique en tasse..."
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent dark:bg-input/10 px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
                  required
                />
              </div>

              <DialogFooter className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Annuler</Button>
                <Button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white font-semibold">
                  <CheckCircle className="mr-2 h-4 w-4" /> Enregistrer la Note & l'Appréciation
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
              <Coffee className="h-6 w-6 text-amber-600" /> Détails de la Dégustation
            </DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-slate-400">
              Fiche complète de l'évaluation organoleptique pour cet échantillon.
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
                  <span className="text-slate-400 block font-uppercase font-semibold">Date Dégustation</span>
                  <span className="font-semibold">{selectedDetailItem.degustation.dateDegustation}</span>
                </div>
              </div>

              {/* Cupping Details */}
              <div className="space-y-3 bg-slate-50/20 dark:bg-slate-900/10 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                <h4 className="font-bold text-slate-900 dark:text-white border-b pb-1.5 flex items-center gap-1.5">
                  <Coffee className="h-4 w-4 text-amber-600" /> Évaluation Organoleptique
                </h4>
                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="p-3 bg-amber-50/50 dark:bg-amber-950/10 rounded-lg border border-amber-200/50 dark:border-amber-900/30 text-center">
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Note de Tasse</span>
                    <span className="text-xl font-extrabold text-amber-600 dark:text-amber-400">{selectedDetailItem.degustation.moyenne.toFixed(2)}</span>
                    <span className="text-[10px] text-slate-400 block">/ 100</span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-900 text-center">
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Dégustateurs</span>
                    <span className="text-lg font-extrabold text-slate-800 dark:text-slate-200">{selectedDetailItem.degustation.nbDegustateurs}</span>
                    <span className="text-[10px] text-slate-400 block">experts</span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-900 text-center">
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Torréfié</span>
                    <span className="text-lg font-extrabold text-slate-800 dark:text-slate-200">{selectedDetailItem.degustation.qteTorrefier}</span>
                    <span className="text-[10px] text-slate-400 block">grammes</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-900 mt-2">
                  <span className=" font-semibold">Appréciation de la qualité</span>
                  <Badge className="bg-secondary/80 text-white border-secondary-500/20 text-lg">
                    {selectedDetailItem.degustation.qualite}
                  </Badge>
                </div>

                {/* Observation */}
                <div className="pt-2">
                  <span className=" font-bold block uppercase">Observations</span>
                  <p className="text-xs text-slate-600 dark:text-slate-400 italic leading-relaxed mt-1 p-3 bg-slate-50/50 dark:bg-slate-900/30 rounded-lg border border-slate-100 dark:border-slate-800">
                    "{selectedDetailItem.degustation.observation}"
                  </p>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Statut suivant</span>
                {selectedDetailItem.status === "degustation_complete" ? (
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Attente Décision</Badge>
                ) : (
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Finalisé</Badge>
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
