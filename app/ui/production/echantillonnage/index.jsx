"use client";

import React, { useState, useEffect } from "react";
import ProtectedRoute from "@/app/ui/protection/ProtectedRoute";
import { ROLES } from "@/lib/permissions";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
    Beaker,
    Calendar,
    User,
    Building2,
    ShieldAlert,
    FileText,
    BarChart,
    Scale,
    Search,
    Trash2,
    AlertCircle
} from "lucide-react";
import InputForm from "@/app/ui/production/echantillonnage/InputForm";

const COFFEE_QUALITIES = [
    "FW NGOMA MILD-SDL",
    "FW AA",
    "15+",
    "PB",
    "FW TT",
    "W ABC",
    "W TT",
    "W STOCK LOT",
    "GRADE 1",
    "GRADE 2",
    "ROBUSTA",
    "COQUE"
];

const initialSamples = [
    {
        id: "ECH-2026-001",
        lotNumber: "LOT-2026-001",
        societe: "COCOCA",
        qualite: ["FW AA", "15+", "GRADE 1"],
        sacsCount: 150,
        qtePrelevee: 15000, // 15 kg
        echantillonneur: "Jean Nkurunziza",
        dateEchantillonnage: "2026-05-25",
        deparcheur: "Usine Ngozi SOGESTAL"
    },
    {
        id: "ECH-2026-002",
        lotNumber: "LOT-2026-002",
        societe: "BURUNDI SPECIALTY COFFEE",
        qualite: ["W TT", "W STOCK LOT", "ROBUSTA", "COQUE"],
        sacsCount: 320,
        qtePrelevee: 32000, // 32 kg
        echantillonneur: "Alice Harriman",
        dateEchantillonnage: "2026-05-26",
        deparcheur: "Usine Gitega SOGESTAL"
    },
];

export default function EchantillonnagePage() {
    const [samples, setSamples] = useState(initialSamples);
    const [searchQuery, setSearchQuery] = useState("");
    const [qualityFilter, setQualityFilter] = useState("ALL");



    const handleAddSample = (newSampleData) => {
        const newSample = {
            id: `ECH-2026-0${samples.length + 1}`,
            ...newSampleData
        };
        setSamples((prev) => [newSample, ...prev]);
    };

    const handleDeleteSample = (id) => {
        setSamples((prev) => prev.filter((s) => s.id !== id));
        toast.success("Échantillon supprimé");
    };

    const filteredSamples = samples.filter((sample) => {
        const matchesSearch =
            sample.lotNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            sample.societe.toLowerCase().includes(searchQuery.toLowerCase()) ||
            sample.echantillonneur.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesQuality = qualityFilter === "ALL" || sample.qualite === qualityFilter;

        return matchesSearch && matchesQuality;
    });

    return (
        <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.GENERAL, ROLES.ODECA, ROLES.SUPERVISEUR]}>
            <div className="p-6 max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Beaker className="h-8 w-8 text-primary animate-pulse" /> Échantillonnage
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">
                            Prélèvement légal et étiquetage des échantillons physiques de café destinés aux analyses de laboratoire.
                        </p>
                    </div>

                </div>

                <InputForm onAddSample={handleAddSample} />

                {/* List of Samples Section */}
                <Card className="shadow-xs dark:bg-slate-950 border-slate-200 dark:border-slate-800">
                    <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                <Beaker className="h-5 w-5 text-primary" /> Échantillons Physiques Prélevés
                            </CardTitle>
                            <CardDescription>
                                Historique des prélèvements effectués par société, par qualité, par sacs et quantité prélevée.
                            </CardDescription>
                        </div>
                        {/* Filters */}
                        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                            <div className="relative flex-1 md:w-64">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder="Rechercher Lot, Société..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 h-9 text-sm"
                                />
                            </div>
                            <div className="w-full sm:w-48">
                                <Select value={qualityFilter} onValueChange={setQualityFilter}>
                                    <SelectTrigger className="h-9 text-sm w-full">
                                        <SelectValue placeholder="Filtrer par Qualité..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ALL">Toutes les qualités</SelectItem>
                                        {COFFEE_QUALITIES.map((q) => (
                                            <SelectItem key={q} value={q}>
                                                {q}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {filteredSamples.length === 0 ? (
                            <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center bg-slate-50/50 dark:bg-slate-900/30">
                                <AlertCircle className="h-8 w-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                    Aucun échantillon ne correspond à vos critères de recherche.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>ID Prélèvement</TableHead>
                                            <TableHead>Numéro de Lot</TableHead>
                                            <TableHead>Société / Propriétaire</TableHead>
                                            <TableHead>Déparcheur</TableHead>
                                            <TableHead>Qualité / Grade</TableHead>
                                            <TableHead className="text-right">Sacs Représentés</TableHead>
                                            <TableHead className="text-right">Qté Prélevée</TableHead>
                                            <TableHead>Échantillonneur</TableHead>
                                            <TableHead>Date Prélèvement</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredSamples.map((sample) => (
                                            <TableRow key={sample.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                                                <TableCell>
                                                    {sample.id}
                                                </TableCell>
                                                <TableCell className="font-bold text-slate-950 dark:text-slate-50">
                                                    {sample.lotNumber}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">
                                                            {sample.societe}
                                                        </span>

                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="">
                                                        {sample.deparcheur || "—"}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-wrap gap-1">
                                                        {sample.qualite.map((q) => (
                                                            <Badge key={q} variant="outline" className="bg-primary/5 text-primary border-primary/20 hover:bg-primary/10">
                                                                {q}
                                                            </Badge>
                                                        ))}
                                                    </div>

                                                </TableCell>
                                                <TableCell className="text-right font-semibold text-slate-700 dark:text-slate-300">
                                                    {sample.sacsCount} sacs
                                                </TableCell>
                                                <TableCell className="text-right font-bold text-slate-900 dark:text-white">
                                                    <div className="flex flex-col items-end">
                                                        <span>{(sample.qtePrelevee).toLocaleString()} g</span>
                                                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                                                            {(sample.qtePrelevee / 1000).toFixed(1)} kg
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-slate-600 dark:text-slate-400">
                                                    <div className="flex items-center gap-1.5">
                                                        <User className="h-3 w-3 text-slate-400" />
                                                        <span className="text-sm">{sample.echantillonneur}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-slate-600 dark:text-slate-400 whitespace-nowrap text-sm">
                                                    {sample.dateEchantillonnage}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDeleteSample(sample.id)}
                                                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </ProtectedRoute>
    );
}
