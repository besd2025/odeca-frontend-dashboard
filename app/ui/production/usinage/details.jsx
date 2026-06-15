import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, FileText, Coffee, Check, X } from "lucide-react";
import { toast } from "sonner";
import { fetchData } from "@/app/_utils/api";

export default function UsinageDetails({ lot, onSave, onCancel, readOnly = false }) {
    // Metadata states
    const [dateSortie, setDateSortie] = useState("");
    const [observation, setObservation] = useState("");

    const [apiGrades, setApiGrades] = useState([]);
    const [fullApiGrades, setFullApiGrades] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [allData, setAllData] = useState({});
    const [details, setDetails] = useState({});
    // Load lot data into component state
    useEffect(() => {
        async function loadInitialData() {
            try {
                const [allData, details] = await Promise.all([
                    fetchData("get", `cafe/usinages/${lot}/get_sortie_usinages/`, { params: { offset: 0, limit: 150 } }),
                    fetchData("get", `cafe/usinages/${lot}/`, { params: { offset: 0, limit: 150 } }),
                ]);
                setAllData(allData)
                setDetails(details)
            } catch (err) {
                console.error("Error loading initial data:", err);
            }
        }

        if (lot) {
            loadInitialData();
            setDateSortie(""); // Sera mis à jour via details
            setObservation("");
        }
    }, [lot]);

    // Render a read-only list of outputs
    const renderReadOnlyOutputs = () => {
        // L'API retourne probablement les sorties dans allData (ou details.productions)
        let productions = [];
        if (Array.isArray(allData)) {
            productions = allData;
        } else if (allData && Array.isArray(allData.results)) {
            productions = allData.results;
        } else if (details && Array.isArray(details.productions)) {
            productions = details.productions;
        }

        if (!productions || productions.length === 0) {
            return (
                <div className="text-center p-6 border border-dashed rounded-lg border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 text-slate-500 text-sm">
                    Aucune quantité de sortie enregistrée pour ce lot.
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-lg border border-slate-100 dark:border-slate-900 space-y-2">
                    <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Qualités produites</h4>
                    <div className="space-y-1.5">
                        {productions.map((prod, idx) => {
                            const gradeName = prod.nom_qualite;
                            const kg = prod.quantite_sortie || 0;
                            const sacs = prod.nombre_sacs || 0;

                            return (
                                <div key={idx} className="flex justify-between items-center text-xs text-slate-700 dark:text-slate-300 border-b border-slate-100/50 dark:border-slate-900/50 pb-1 last:border-0 last:pb-0">
                                    <span className="font-medium">{gradeName}</span>
                                    <div className="flex items-center gap-3">
                                        <span className="font-bold text-slate-900 dark:text-white">{kg} kg</span>
                                        <span className="text-slate-500 dark:text-slate-400">({sacs} sacs)</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <form className="space-y-5">
            {/* Header Info */}
            <div className="p-3.5 bg-primary/5 border border-primary/10 rounded-lg text-sm text-slate-700 dark:text-slate-300 space-y-1">
                <div className="flex justify-between items-center">
                    <span className="font-semibold text-primary">SOCIETE ID: {details?.code_societe}</span>
                    <span className="text-xs bg-primary/10 px-2.5 py-0.5 rounded-full font-semibold">{details?.nom_societe}</span>
                </div>
                <div className="text-xs text-slate-500">
                    Usinage débuté le {new Date(details?.date_debut).toLocaleDateString("fr-FR")} à {new Date(details?.date_debut).toLocaleTimeString("fr-FR")}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Left Column: Sorties & Notes */}
                <div className="lg:col-span-1 space-y-4">
                    <Card className="shadow-none dark:bg-slate-950 border-slate-200 dark:border-slate-800">
                        <CardHeader className="py-4">
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <FileText className="h-4.5 w-4.5 text-primary" /> Sorties & Notes
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 py-0 pb-4">
                            <div className="space-y-2">
                                <Label className="font-semibold text-slate-700 dark:text-slate-300">
                                    Date de Sortie d'Usinage
                                </Label>

                                <div className="p-2 border rounded-md bg-slate-50 dark:bg-slate-900/50 text-sm text-slate-800 dark:text-slate-200">
                                    {new Date(details?.date_fin).toLocaleDateString("fr-FR")}
                                </div>

                            </div>

                            <div className="space-y-2">
                                <Label className="font-semibold text-slate-700 dark:text-slate-300">
                                    Observations / Remarques
                                </Label>
                                <div className="p-2.5 border rounded-md bg-slate-50 dark:bg-slate-900/50 text-sm text-slate-700 dark:text-slate-300 min-h-[100px] whitespace-pre-wrap">
                                    {details?.observation || "Aucune observation."}
                                </div>

                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Détails des Quantités Sorties */}
                <div className="lg:col-span-2">
                    <Card className="shadow-none dark:bg-slate-950 border-slate-200 dark:border-slate-800 h-full flex flex-col justify-between">
                        <CardHeader className="py-4">
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <Coffee className="h-4.5 w-4.5 text-primary" /> Détails des Quantités Sorties (Café Vert)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 py-0 pb-4">
                            {renderReadOnlyOutputs()}
                        </CardContent>

                        <CardFooter className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                            <Button type="button" size="sm" onClick={onCancel} className="h-9">
                                Fermer
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </form>
    );
}
