import React, { useState } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Layers, MoreHorizontal, Settings, Trash2, Percent, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { Label } from '@/components/ui/label';
import { fetchData } from "@/app/_utils/api";
export default function Transferts() {
    const [activeTab, setActiveTab] = useState("all");
    const [isFinalizing, setIsFinalizing] = useState(false);
    const [formData, setFormData] = useState({
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
    const receptionsList = [
        {
            id: 1,
            societe: "KIREMA",
            sdls: ["SDL Ngozi", "SDL Kayanza"],
            poidsNet: 1000,
            dateReception: "2022-01-01",
            status: "en attente"
        },
        {
            id: 2,
            societe: "KIRYAMA",
            sdls: ["SDL Gitega", "SDL Muramvya"],
            poidsNet: 1000,
            dateReception: "2022-01-02",
            status: "confirmé"
        }
    ]
    const gradesBySDL = {
        "SDL Ngozi": ["A1", "A2", "COQUE"],
        "SDL Kayanza": ["A1", "A3", "CAFE NATUREL"],
        "SDL Gitega": ["B1", "B2", "B3"],
        "SDL Muramvya": ["B2", "B3", "COQUE"],
        "SDL Karusi": ["A2", "B2", "CAFE Miel"],
    };
    const [activeGrades, setActiveGrades] = useState(Array.from(new Set(Object.values(gradesBySDL).flat())));
    async function loadInitialData() {
        try {
            const [allData] = await Promise.all([
                fetchData("get", `cafe/transfert_sdl_usine/`, { params: { offset: 0, limit: 150 } })
            ]);
            console.log("sdls list", allData)
            // setFormData(pre => ({
            //     ...pre,
            //     societe: allData?.societe?.nom || "",
            //     selectedSDLs: allData?.results?.sdls_list || [],
            //     humidite: allData?.humidite || "",
            //     rendement: allData?.rendement || "",
            //     sacsCount: allData?.sacs_count || "",
            //     poidsBrut: allData?.poids_brut || "",
            //     poidsTare: allData?.poids_tare || "",
            //     dateReception: allData?.date_reception || "",
            //     grades: allData?.transferts?.[0]?.details[0] || {},
            //     gradeSDLs: allData?.gradeSDLs || {}
            // }))


        } catch (err) {
            console.error("Error loading initial data:", err);
        }
    }
    React.useEffect(() => {
        loadInitialData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleGradeRemove = (grade) => {
        setActiveGrades((prev) => prev.filter((g) => g !== grade));
    };

    const brut = parseFloat(formData.poidsBrut) || 0;
    const tare = parseFloat(formData.poidsTare) || 0;
    const poidsNet = Math.max(0, brut - tare);

    const filteredReceptions = receptionsList.filter((lot) => {
        if (activeTab === "all") return true;
        return lot.status.toLowerCase() === activeTab.toLowerCase();
    });
    return (
        <div className="w-full bg-card rounded-md p-2">

            <div className="w-full overflow-x-auto mt-2">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="pl-4">Actions</TableHead>
                            <TableHead>SDLs</TableHead>
                            <TableHead className="text-right">Poids Net (kg)</TableHead>
                            <TableHead className="text-center">Statut</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredReceptions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-slate-500 dark:text-slate-400 font-medium">
                                    Aucun lot trouvé avec ce statut.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredReceptions.map((lot) => (
                                <TableRow className="odd:bg-muted/50" key={lot.id}>
                                    <TableCell className="pl-4 font-medium">
                                        <div className="flex items-center gap-2">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align='start'>
                                                    {lot.status === "en attente" && (
                                                        <Link href={`/odeca-production/usine/reception/confirmation/transfert/grades`}>
                                                            <DropdownMenuItem className="cursor-pointer" >Confirmer</DropdownMenuItem>

                                                        </Link>
                                                    )}
                                                    <DropdownMenuItem className="cursor-pointer text-red-600 dark:text-red-400">Rejeter</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-semibold"><div className="flex flex-col gap-1">
                                        <span className="font-medium text-slate-800 dark:text-slate-200">
                                            {lot.societe}
                                        </span>

                                    </div></TableCell>
                                    <TableCell className="text-right font-semibold">{lot.poidsNet.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}</TableCell>
                                    <TableCell className="text-center lowercase">
                                        {lot.status === "confirmé" ? (
                                            <div className='gap-2 flex items-center justify-center'>
                                                <Badge variant="default" className="gap-1 bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400">
                                                    <CheckCircle2 size={24} />
                                                </Badge>
                                                <span>Confirmé</span>
                                            </div>

                                        ) : (
                                            <div className='gap-2 flex items-center justify-center'>
                                                <Badge variant="secondary" className="gap-1 bg-amber-100 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400">
                                                    <Clock size={24} />
                                                </Badge>
                                                <span>En attente</span>
                                            </div>
                                        )}
                                    </TableCell>
                                </TableRow>
                            )))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
