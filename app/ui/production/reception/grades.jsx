"use client";
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
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Layers, MoreHorizontal, Settings, Trash2, Percent, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { fetchData } from "@/app/_utils/api";
export default function Grades() {
    const [isFinalizing, setIsFinalizing] = useState(false);
    const [activeTab, setActiveTab] = useState("all");
    const [loading, setLoading] = useState(false);
    const [gradesList, setGradesList] = useState([]);
    const searchParams = useSearchParams();
    const lotId = searchParams?.get("id") || "";
    const sdl = searchParams?.get("sdls") || "";
    const [open, setOpen] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        gradeId: "",
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
    const gradesBySDL = [
        {
            id: 1,
            grade: "A1",
            poidsNet: 1000,
            dateReception: "2022-01-01",
            status: "en attente",
            origin: "SDL-1",
            originId: 1,
        },
    ]


    // Pagination state
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [pointer, setPointer] = useState(0);
    const [gradedetail, setGradedetail] = useState("");
    const [gradeOptions, setGradeOptions] = useState([]);
    const handleTabChange = (val) => {
        setActiveTab(val);
        setPointer(0);
        setCurrentPage(1);
    };

    const TRIAGE_GRADES = ["A1", "A2", "A3", "A4", "B1", "B2", "B3", "COQUE", "CAFE NATUREL", "CAFE MIEL", "ANAEROBIC", "ROBUSTA"];


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleGradeChange = (value) => {
        setFormData((prev) => ({ ...prev, gradeId: value }));
    };

    const loadGradesData = async (tab) => {
        setLoading(true);

        try {

            // Fetch all grades
            const res = await fetchData("get", `cafe/transfert_sdl_usine/${lotId}/get_transfert_detail/`, {
                params: { offset: pointer, limit },
            });
            const mapped = res?.results?.map((item) => ({
                id: item?.id,
                grade: item?.grade?.grade_name,
                poidsNet: item?.quantite,
                dateReception: item?.date_reception,
                status: item?.comfirmation_status,
            })) || [];

            setGradesList(mapped);
            console.log("mapped: ", mapped)
            setTotalCount(res?.count || 0);


        } catch (error) {
            console.error(`Error fetching grades data for tab ${tab}:`, error);
            setGradesList([]);
            setTotalCount(0);
        } finally {
            setLoading(false);
        }
    };


    const onPageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        setPointer((pageNumber - 1) * limit);
    };

    const onLimitChange = (newLimit) => {
        setLimit(newLimit);
        setPointer(0);
        setCurrentPage(1);
    };

    React.useEffect(() => {
        if (activeTab) {
            loadGradesData(activeTab);
        }
    }, [activeTab, pointer, limit]);

    const brut = parseFloat(formData.poidsBrut) || 0;
    const tare = parseFloat(formData.poidsTare) || 0;
    const poidsNet = Math.max(0, brut - tare);
    const [idGrade, setIdGrade] = useState("");
    const activegradedetails = async (id_grade, grade) => {
        setGradedetail(grade)
        setIsFinalizing(true)
        // Fetch all grades
        const res = await fetchData("get", `cafe/transfert_sdl_usine_detail/${id_grade}/`, {
            params: { offset: pointer, limit },
        });
        const fetchedGrades = await fetchData("get", `cafe/grades/get_all_grades/`);
        setFormData((prev) => ({
            ...prev,
            societe: res.transfer?.sdl?.societe?.nom_societe,
            selectedSDLs: [],
            humidite: "",
            rendement: "",
            sacsCount: "",
            poidsBrut: "",
            poidsTare: "",
            dateReception: "",
            grades: {},
            gradeSDLs: {}
        }));
        const options = fetchedGrades?.map((item) => ({
            value: item.id,
            label: item.grade_name,
        })) || [];
        setGradeOptions(options);
        setIdGrade(id_grade);
    }

    const confirmationGrade = async () => {
        const dataform = {
            transfert_detail: idGrade,
            humidity: formData.humidite,
            grade: formData.gradeId,
            quantite_confirme_brut: formData.poidsBrut,
            quantite_confirme_tare: formData.poidsTare,
            nombre_sac: formData.sacsCount,
            comfiramtion_status: "CONFIRMEE"
        }
        console.log(dataform)
        if (!formData.gradeId || !formData.humidite || !formData.poidsBrut || !formData.poidsTare || !formData.sacsCount) {
            toast.error("Veuillez remplir tous les champs");
            setLoading(false);

        }
        else {
            const promise = new Promise(async (resolve, reject) => {
                try {


                    const results = await fetchData(
                        "post",
                        `/cafe/transfert_sdl_usine_detail_comfimation/`,
                        {
                            params: {},
                            additionalHeaders: {},
                            body: dataform,
                        }
                    );
                    if (results.status === 201) {

                        resolve({ idGrade });
                    } else {
                        reject(new Error("Erreur lors de la modification"));
                    }

                } catch (error) {
                    reject(error);
                }
            });

            toast.promise(promise, {
                loading: "Modification en cours...",
                success: (data) => {
                    setIsFinalizing(false);
                    setFormData((prev) => ({
                        ...prev,
                        humidite: "",
                        gradeId: "",
                        poidsBrut: "",
                        poidsTare: "",
                        sacsCount: "",
                        dateReception: "",
                    }));
                    loadGradesData(activeTab);
                    return `Donnée enregistrée avec succès`;
                },
                error: "Donnée non enregistrée",
            });

            try {
                await promise;
            } catch (error) {
                console.error(error);
                setError(error.message || "Une erreur est survenue");
            } finally {
                setLoading(false);
            }
        }

    };


    return (
        <div className="w-full bg-card rounded-md p-2 flex flex-col gap-2">

            <div className="w-full overflow-x-auto mt-2">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="pl-4">Actions</TableHead>
                            <TableHead>Grades</TableHead>
                            <TableHead className="text-right">Poids Net (kg)</TableHead>
                            <TableHead className="text-center">Statut</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {gradesList.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-slate-500 dark:text-slate-400 font-medium">
                                    Aucun grades trouvé.
                                </TableCell>
                            </TableRow>
                        ) : (
                            gradesList.map((grade) => (
                                <TableRow className="odd:bg-muted/50" key={grade.id}>
                                    <TableCell className="pl-4 font-medium">
                                        <div className="flex items-center gap-2">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align='start'>
                                                    {grade.status === "EN_ATTENTE" && (

                                                        <DropdownMenuItem className="cursor-pointer" onClick={() => activegradedetails(grade.id, grade.grade)}>Confirmer</DropdownMenuItem>


                                                    )}
                                                    {/* <DropdownMenuItem className="cursor-pointer text-red-600 dark:text-red-400">Rejeter</DropdownMenuItem> */}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-semibold"><div className="flex flex-col gap-1">
                                        <span className="font-medium text-slate-800 dark:text-slate-200">
                                            {grade.grade}
                                        </span>

                                    </div></TableCell>
                                    <TableCell className="text-right font-semibold">{grade.poidsNet.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}</TableCell>
                                    <TableCell className="text-center lowercase">
                                        {grade.status === "CONFIRMEE" ? (
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
            <Dialog open={isFinalizing} onOpenChange={setIsFinalizing}>
                <DialogContent className="border border-slate-200 dark:border-slate-800 shadow-xl overflow-y-auto max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                            Quantités par Grade
                        </DialogTitle>
                        <DialogDescription className="text-slate-500 dark:text-slate-400">
                            Saisie des volumes pour les grades de café envoyés automatiquement par les SDL d'origine.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="">

                        <div>
                            <div className="gap-4 animate-in fade-in duration-200">
                                {gradesBySDL.map((grade) => (
                                    <div
                                        key={grade.id}
                                        className="p-3 rounded-lg border border-slate-100 dark:border-slate-900 space-y-1.5 relative group animate-in zoom-in-95 duration-200"
                                    >
                                        <div className="flex justify-between items-center">

                                            <Label htmlFor={`grade-${gradedetail}`} className="text-md font-bold ">
                                                {gradedetail}
                                            </Label>
                                        </div>
                                        <div className="flex flex-col gap-2">

                                            <div className="space-y-2 mb-4">

                                                <p className="text-sm font-semibold text-primary mt-1">Origine : {formData.societe}/{sdl}</p>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="gradeId" className="font-semibold text-slate-700 dark:text-slate-300">
                                                    Grade
                                                </Label>

                                                <div className="w-full">
                                                    <Select
                                                        //defaultValue={grade.grade}
                                                        defaultValue={formData.gradeId}
                                                        onValueChange={handleGradeChange}
                                                    >
                                                        <SelectTrigger className="w-full cursor-pointer">
                                                            <SelectValue placeholder="Ajouter un grade..." />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {gradeOptions.map((item, index) => (
                                                                <SelectItem key={`${item.value}-${index}`} value={item.value}>
                                                                    {item.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="sacsCount" className="font-semibold text-slate-700 dark:text-slate-300">
                                                    Nombre de Sacs
                                                </Label>
                                                <Input
                                                    type="number"
                                                    step="1"
                                                    min="0"
                                                    id="sacsCount"
                                                    name="sacsCount"
                                                    value={formData.sacsCount}
                                                    onChange={handleChange}
                                                    placeholder="Ex: 320"
                                                    required
                                                />
                                            </div>


                                            <div className="space-y-2">
                                                <Label htmlFor="poidsBrut" className="font-semibold text-slate-700 dark:text-slate-300">
                                                    Poids Brut (kg)
                                                </Label>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    id="poidsBrut"
                                                    name="poidsBrut"
                                                    value={formData.poidsBrut}
                                                    onChange={handleChange}
                                                    placeholder="Ex: 7200.00"
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="poidsTare" className="font-semibold text-slate-700 dark:text-slate-300">
                                                    Poids Tare (kg)
                                                </Label>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    id="poidsTare"
                                                    name="poidsTare"
                                                    value={formData.poidsTare}
                                                    onChange={handleChange}
                                                    placeholder="Ex: 320.00"
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="humidite" className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                                                    Humidité <Percent className="h-3 w-3 text-slate-400" />
                                                </Label>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    max="100"
                                                    id="humidite"
                                                    name="humidite"
                                                    value={formData.humidite}
                                                    onChange={handleChange}
                                                    placeholder="Ex: 11.50 %"
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="rendement" className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                                                    Rendement <Percent className="h-3 w-3 text-slate-400" />
                                                </Label>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    max="100"
                                                    id="rendement"
                                                    name="rendement"
                                                    value={formData.rendement}
                                                    onChange={handleChange}
                                                    placeholder="Ex: 82.50 %"
                                                    required
                                                />
                                            </div>

                                            <div className="mt-2">
                                                <div className="bg-slate-50 dark:bg-slate-900 rounded-lg flex flex-col justify-between">
                                                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                                                        Poids Net Calculé
                                                    </span>
                                                    <span className="text-lg font-bold text-primary pt-1">
                                                        {poidsNet.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} <span className="text-xs font-medium text-slate-500">kg</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                ))}
                            </div>

                        </div>
                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20 flex gap-x-2">
                            {/* <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsFinalizing(false)}
                                className="text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition-colors w-1/2 h-11 text-base font-semibold shadow-xs"
                            >
                                Rejeter
                            </Button> */}
                            <Button type="submit" className="w-1/2 h-11 text-base font-semibold shadow-xs" onClick={confirmationGrade} >
                                Enregistrer la Réception
                            </Button>

                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
