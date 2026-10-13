"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
const XLSX = require("xlsx");
import { saveAs } from "file-saver";
import { toast } from "sonner";
import { fetchData } from "@/app/_utils/api";
// MockData pour le total cumulatif des quantités collectées par société (Café Washed)
// TODO API: Remplacer MOCK_CUMULATIF_WASHED par un appel API à fetchData("get", "cafe/cumulatif_washed/")
const MOCK_CUMULATIF_WASHED = [
    {
        id: "SOC-001",
        societe: "SODEICO SARL",
        total_quantite_washed: 45800,
        qualite: [{ label: "Qualité A", quantite: 23000 }, { label: "Qualité B", quantite: 22800 }],
        nb_achats: 32,
    },
    {
        id: "SOC-002",
        societe: "COPROTRAC",
        total_quantite_washed: 38400,
        qualite: [{ label: "Fully Washed", quantite: 38400 }],
        nb_achats: 27,
    },
];

export default function CumulatifWashedListTable({ isLoading: externalLoading }) {
    const [data, setData] = React.useState({});

    React.useEffect(() => {
        const getAchats = async () => {
            try {
                const QtesWashed = await fetchData("get", "cafe/achat_cafe_parche/total_quantite", {
                    params: {},
                    additionalHeaders: {}
                });
                const Nombre_Societe = await fetchData("get", "cafe/achat_cafe_parche/get_nombre_socites", {
                    params: {},
                    additionalHeaders: {}
                });
                const Nombre_Achats = await fetchData("get", "cafe/achat_cafe_parche/get_nombre_achat", {
                    params: {},
                    additionalHeaders: {}
                });
                console.log("newData: ", QtesWashed);
                console.log("newData: ", Nombre_Achats);
                const newData =
                {
                    total_societe: Nombre_Societe?.total_societe,
                    total_quantite_washed: QtesWashed?.total_quantite,
                    nb_achats: Nombre_Achats?.total_achat,
                };
                setData(newData);
            } catch (error) {
                console.error("Error fetching individual achats:", error);
            }
        };

        getAchats();
    }, []);


    return (
        <div className="space-y-4">
            {/* Cartes Synthétiques */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-sidebar">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Washed Collecté
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-secondary">
                            {data?.total_quantite_washed >= 1000 ? (
                                <>
                                    {(data?.total_quantite_washed / 1000).toLocaleString("fr-FR", {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                                    <span className="text-sm"> T</span>
                                </>
                            ) : (
                                <>
                                    {data?.total_quantite_washed?.toLocaleString("fr-FR") || 0}
                                    <span className="text-sm"> Kg</span>
                                </>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-sidebar">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Sociétés Actives
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {data?.total_societe || 0} Sociétés
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Avec collecte de café washed enregistrée
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-sidebar">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Opérations
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold ">
                            {data?.nb_achats?.toLocaleString("fr-FR") || 0} Achats
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Operations cumulées d'achat
                        </p>
                    </CardContent>
                </Card>
            </div>


        </div>
    );
}
