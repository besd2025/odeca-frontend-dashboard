
"use client";

import React, { useState } from "react";
import ProtectedRoute from "@/app/ui/protection/ProtectedRoute";
import { ROLES } from "@/lib/permissions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Settings } from "lucide-react";
import { toast } from "sonner";
import OutputForm from "./OutputForm";
import ProcessingList from "./ProcessingList";
import InputForm from "./InputForm";
import { fetchData } from "@/app/_utils/api";
import UsinageDetails from "./details";
const INITIAL_LOTS = [
    {
        id: "LOT-2026-001",
        societe: "SOGESTAL Ngozi",
        selectedSDLs: ["SDL Ngozi", "SDL Gitega"],
        dateUsinage: "2026-05-15",
        usinageQuantities: { "A1": 9000, "A2": 6000 },
        status: "Finalisé",
        dateSortie: "2026-05-18",
        observation: "Usinage excellent, bon rendement global. Conversion du café déparché A1/A2 en café vert (FW/W).",
        outputFW: {
            "FW NGOMA MILD-SDL": { kg: 7200, sacs: 120 },
            "FW AA": { kg: 4800, sacs: 80 }
        },
        outputW: {
            "W ABC": { kg: 1200, sacs: 20 }
        },
        outputNaturel: {},
        outputMiel: {},
        outputRobusta: {},
        outputAnaerobic: {}
    },
    {
        id: "LOT-2026-002",
        societe: "SOGESTAL Kayanza",
        selectedSDLs: ["SDL Kayanza"],
        dateUsinage: "2026-05-27",
        usinageQuantities: { "B1": 2500, "B2": 1200 },
        usinageQuantitiesTotal: 3700,
        status: "En cours"
    },
    {
        id: "LOT-2026-003",
        societe: "SOGESTAL Muramvya",
        selectedSDLs: ["SDL Muramvya", "SDL Bururi"],
        dateUsinage: "2026-05-27",
        usinageQuantities: { "C1": 2500, "C2": 1200 },
        usinageQuantitiesTotal: 3700,
        status: "Reception"
    },
];


export default function UsinagePage() {
    const [lots, setLots] = useState(INITIAL_LOTS);
    const [activeLot, setActiveLot] = useState(null);
    const [isFinalizing, setIsFinalizing] = useState(false);
    const [isViewingDetails, setIsViewingDetails] = useState(false);
    const [id, setId] = useState("");
    const [formData, setFormData] = useState({
        id: "",
        societe: "",
        selectedSDLs: [],
        humidite: "",
        rendement: "",
        sacsCount: "",
        poidsBrut: "",
        poidsTare: "",
        dateReception: "",
        grades: {},
        gradeSDLs: {}
    });
    const handleAddLot = (newLot) => {
        // Generate a unique sequential ID
        const lotId = `USID-2026-${String(lots.length + 1).padStart(3, "0")}`;
        const lotWithId = {
            id: lotId,
            ...newLot,
            status: "En cours"
        };
        setLots((prev) => [lotWithId, ...prev]);
    };


    // async function loadInitialData() {
    //     try {
    //         const [allData] = await Promise.all([
    //             fetchData("get", `cafe/usinages/quantites_usinage/`, { params: { offset: 0, limit: 150 } })
    //         ]);
    //         console.log(allData)
    //         setFormData(pre => ({
    //             ...pre,
    //             societe: allData?.societe?.nom || "",
    //             selectedSDLs: allData?.results?.sdls_list || [],
    //             humidite: allData?.humidite || "",
    //             rendement: allData?.rendement || "",
    //             sacsCount: allData?.sacs_count || "",
    //             poidsBrut: allData?.poids_brut || "",
    //             poidsTare: allData?.poids_tare || "",
    //             dateReception: allData?.date_reception || "",
    //             grades: allData?.transferts?.[0]?.details[0] || {},
    //             gradeSDLs: allData?.gradeSDLs || {}
    //         }))


    //     } catch (err) {
    //         console.error("Error loading initial data:", err);
    //     }
    // }
    // React.useEffect(() => {
    //     loadInitialData();
    // }, []);

    const handleFinalizeLot = (lot) => {
        setActiveLot(lot);
        setIsFinalizing(true);
    };

    const handleViewDetails = (lot) => {
        setActiveLot(lot);
        setIsViewingDetails(true);
    };

    const handleSaveOutputs = (lotId, outputData) => {
        setLots((prevLots) =>
            prevLots.map((lot) => {
                if (lot.id === lotId) {
                    return {
                        ...lot,
                        ...outputData,
                        status: "Finalisé"
                    };
                }
                return lot;
            })
        );
        setIsFinalizing(false);
        setActiveLot(null);
    };

    const handlerIdChange = (value) => {
        setId(value);
    }
    return (
        <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.GENERAL, ROLES.ODECA, ROLES.SUPERVISEUR]}>
            <div className="p-6 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Settings className="h-8 w-8 text-primary" /> Usinage
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">
                            Saisie des quantités de café déparché entrées en usinage, suivi en temps réel et ventilation des grades obtenus en sortie.
                        </p>
                    </div>

                </div>
                {/* Component 2: List of active and completed lots */}
                <ProcessingList
                    lots={lots}
                    onFinalize={handleFinalizeLot}
                    onViewDetails={handleViewDetails}
                    onIdChange={handlerIdChange}
                />

                {/* Component 3 (Modal): Output form to finalize a lot */}
                <Dialog open={isFinalizing} onOpenChange={setIsFinalizing}>
                    <DialogContent className="sm:max-w-4xl md:max-w-2xl lg:max-w-[90vw] bg-sidebar border border-slate-200 dark:border-slate-800 shadow-xl overflow-y-auto max-h-[90vh]">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                                Finalisation de l'Usinage
                            </DialogTitle>
                            <DialogDescription className="text-slate-500 dark:text-slate-400">
                                Veuillez renseigner les quantités obtenues en sortie de déparchage ainsi que la date de sortie.
                            </DialogDescription>
                        </DialogHeader>
                        {activeLot && (
                            <OutputForm
                                lot={activeLot}
                                onSave={handleSaveOutputs}
                                onCancel={() => {
                                    setIsFinalizing(false);
                                    setActiveLot(null);
                                }}
                                readOnly={false}
                            />
                        )}
                    </DialogContent>
                </Dialog>


                {/* Dialog for viewing lot details */}
                <Dialog open={isViewingDetails} onOpenChange={setIsViewingDetails}>
                    <DialogContent className="sm:max-w-4xl md:max-w-2xl lg:max-w-[90vw] bg-sidebar border border-slate-200 dark:border-slate-800 shadow-xl overflow-y-auto max-h-[90vh]">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
                                Fiche Récapitulative d'Usinage
                            </DialogTitle>
                            <DialogDescription className="text-slate-500 dark:text-slate-400">
                                Détail complet des intrants, extrants et métadonnées d'usinage associés à ce lot.
                            </DialogDescription>
                        </DialogHeader>

                        <UsinageDetails
                            lot={activeLot}
                            onCancel={() => {
                                setIsViewingDetails(false);
                                setActiveLot(null);
                            }}
                            readOnly={true}
                        />

                    </DialogContent>
                </Dialog>

            </div>
        </ProtectedRoute>
    );
}
