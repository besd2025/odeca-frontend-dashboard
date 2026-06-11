"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ProtectedRoute from "@/app/ui/protection/ProtectedRoute";
import { ROLES } from "@/lib/permissions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { PackageCheck, RotateCcw, Warehouse } from "lucide-react";
import StockedList from "./StockedList";
import RetourList from "../echantillonnage/retours/RetourList";
import StockageForm from "./StockageForm";
import { Button } from "@/components/ui/button";
import { fetchData } from "@/app/_utils/api";
import { searchParams } from "next/navigation";
// ---------- Mock data ----------

const STOCKED_LOTS = [
    {
        id: "STOCK-2026-001",
        societe: "SOGESTAL Ngozi",
        sdls: ["SDL Ngozi", "SDL Gitega"],
        grades: { "FW NGOMA MILD-SDL": 420, "FW AA": 78, "W ABC": 20 },
        nombreSacs: 216,
        dateStockage: "2026-05-20",
    },
    {
        id: "STOCK-2026-002",
        societe: "SOGESTAL Kayanza",
        sdls: ["SDL Kayanza"],
        grades: { "FW AA": 40, "15+": 20 },
        nombreSacs: 60,
        dateStockage: "2026-05-24",
    },
    {
        id: "STOCK-2026-003",
        societe: "COCOCA",
        sdls: ["SDL Gitega", "SDL Karusi"],
        grades: { "ROBUSTA NATURAL CLEAN SUPER": 58 },
        nombreSacs: 58,
        dateStockage: "2026-05-26",
    },
    {
        id: "STOCK-2026-004",
        societe: "SOGESTAL Mumirwa",
        sdls: ["SDL Muramvya"],
        grades: { "GRADE 1": 18 },
        nombreSacs: 18,
        dateStockage: "2026-05-28",
    },
    {
        id: "STOCK-2026-005",
        societe: "SOGESTAL Ngozi",
        sdls: ["SDL Gitega"],
        grades: { "W ABC": 3 },
        nombreSacs: 3,
        dateStockage: "2026-05-28",
    },
];

const RETOUR_LOTS = [
    {
        id: "STOCK-2026-R01",
        societe: "SOGESTAL Kayanza",
        sdls: ["SDL Kayanza"],
        grades: { "W TT": 12 },
        motifRetour: "Taux d'humidité trop élevé (supérieur à 12%). Nécessite un séchage complémentaire et un re-triage.",
        dateRetour: "2026-05-22",
        status: "En réusinage",
    },
    {
        id: "STOCK-2026-R02",
        societe: "COCOCA",
        sdls: ["SDL Karusi"],
        grades: { "COQUE": 8 },
        motifRetour: "Défauts de triage constatés lors du contrôle qualité en laboratoire. Présence de fèves noires.",
        dateRetour: "2026-05-25",
        status: "Retourné",
    },
];

export default function StockagePage() {
    const searchParams = useSearchParams();
    const [selectedLot, setSelectedLot] = useState(null);
    const [isViewingDetails, setIsViewingDetails] = useState(false);
    const [stockedLots, setStockedLots] = useState(STOCKED_LOTS);
    const [isCreatingStock, setIsCreatingStock] = useState(false);
    const [formData, setFormData] = useState({
        id: "",
        societe: "",
        sdls: [],
        humidite: "",
        rendement: "",
        sacsCount: "",
        poidsBrut: "",
        poidsTare: "",
        dateReception: "",
        grades: {},
        gradeSDLs: {}
    })
    const handleStore = () => {
        setIsCreatingStock(false);
    }

    // const code_societe = React.searchParams.get("id")
    // console.log("this is code", "code_societe")
    const handleViewDetails = (lot) => {
        setSelectedLot(lot);
        setIsViewingDetails(true);
    };


    async function loadInitialData() {
        try {

            const [allData] = await Promise.all([
                fetchData("get", `cafe/usinages/quantites_usinage/`, { params: { offset: 0, limit: 150 } })
            ]);
            console.log(allData)
            setFormData(pre => ({
                ...pre,
                societe: allData?.societe?.nom || "",
                selectedSDLs: allData?.results?.sdls_list || [],
                humidite: allData?.humidite || "",
                rendement: allData?.rendement || "",
                sacsCount: allData?.sacs_count || "",
                poidsBrut: allData?.poids_brut || "",
                poidsTare: allData?.poids_tare || "",
                dateReception: allData?.date_reception || "",
                grades: allData?.transferts?.[0]?.details[0] || {},
                gradeSDLs: allData?.gradeSDLs || {}
            }))


        } catch (err) {
            console.error("Error loading initial data:", err);
        }
    }
    React.useEffect(() => {
        loadInitialData();
    }, []);
    return (
        <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.GENERAL, ROLES.ODECA, ROLES.SUPERVISEUR]}>
            <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Warehouse className="h-8 w-8 text-primary" /> Stockage & Retours
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">
                            Suivi des lots de café stockés en entrepôt et des lots retournés pour un cycle de réusinage.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button size="sm" onClick={() => setIsCreatingStock(true)}>Nouveau Stockage</Button>
                    </div>
                </div>
                <StockedList lots={stockedLots} onViewDetails={handleViewDetails} />

                <Dialog open={isCreatingStock} onOpenChange={setIsCreatingStock}>
                    <DialogContent className="sm:max-w-2xl bg-sidebar border border-slate-200 dark:border-slate-800 shadow-xl overflow-y-auto ">

                        <StockageForm onCancel={() => setIsCreatingStock(false)} onStore={handleStore} />
                    </DialogContent>
                </Dialog>

                {/* Details Dialog */}
                <Dialog open={isViewingDetails} onOpenChange={setIsViewingDetails}>
                    <DialogContent className="sm:max-w-2xl bg-sidebar border border-slate-200 dark:border-slate-800 shadow-xl overflow-y-auto max-h-[90vh]">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
                                Fiche du Lot {selectedLot?.id}
                            </DialogTitle>
                            <DialogDescription className="text-slate-500 dark:text-slate-400">
                                Informations détaillées sur le lot sélectionné.
                            </DialogDescription>
                        </DialogHeader>
                        {selectedLot && (
                            <div className="space-y-4">
                                {/* Lot info banner */}
                                <div className="p-3.5 bg-primary/5 border border-primary/10 rounded-lg text-sm space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-primary">Lot : {selectedLot.id}</span>
                                        <span className="text-xs bg-primary/10 px-2.5 py-0.5 rounded-full font-semibold">
                                            {selectedLot.societe}
                                        </span>
                                    </div>
                                    {selectedLot.sdls && (
                                        <div className="text-xs text-slate-500 dark:text-slate-400">
                                            SDLs : {selectedLot.sdls.join(", ")}
                                        </div>
                                    )}
                                </div>

                                {/* Info grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Grades */}
                                    <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-lg border border-slate-100 dark:border-slate-900 space-y-2">
                                        <span className="text-xs font-bold text-secondary uppercase tracking-wider">
                                            Grades / Qualité (Café Vert)
                                        </span>
                                        <div className="space-y-1.5 mt-2">
                                            {selectedLot.grades && Object.entries(selectedLot.grades).map(([grade, qty]) => (
                                                <div key={grade} className="flex justify-between items-center text-sm">
                                                    <span className="">{grade}</span>
                                                    <span className="font-bold text-slate-900 dark:text-white">{qty} sacs</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Metadata */}
                                    <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-lg border border-slate-100 dark:border-slate-900 space-y-3">
                                        {selectedLot.nombreSacs !== undefined && (
                                            <div>
                                                <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">
                                                    Nombre de Sacs
                                                </span>
                                                <span className="text-lg font-bold text-primary dark:text-white">
                                                    {selectedLot.nombreSacs} sacs
                                                </span>
                                            </div>
                                        )}
                                        {selectedLot.dateStockage && (
                                            <div>
                                                <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">
                                                    Date de Stockage
                                                </span>
                                                <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                                    {selectedLot.dateStockage}
                                                </span>
                                            </div>
                                        )}
                                        {selectedLot.dateRetour && (
                                            <div>
                                                <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">
                                                    Date de Retour
                                                </span>
                                                <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                                    {selectedLot.dateRetour}
                                                </span>
                                            </div>
                                        )}
                                        {selectedLot.status && (
                                            <div>
                                                <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">
                                                    Statut
                                                </span>
                                                <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                                    {selectedLot.status}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Motif retour if applicable */}
                                {selectedLot.motifRetour && (
                                    <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-100 dark:border-red-900 space-y-1">
                                        <span className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
                                            Motif de Retour
                                        </span>
                                        <p className="text-sm text-red-700 dark:text-red-300 leading-relaxed">
                                            {selectedLot.motifRetour}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </ProtectedRoute>
    );
}
