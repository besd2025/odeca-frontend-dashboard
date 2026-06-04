import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Layers, Building2, Settings } from "lucide-react";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

const SOCIETE_LIST = [
    "SOGESTAL Kirundo-Muyinga",
    "SOGESTAL Kayanza",
    "SOGESTAL Ngozi",
    "COCOCA",
    "SOGESTAL Mumirwa",
];

const SDL_GRADES_MAP = {
    "SDL Ngozi": [
        { grade: "A1", quantite: "565", nombreDeSacs: "6" },
        { grade: "A2", quantite: "4760", nombreDeSacs: "75" },
        { grade: "COQUE", quantite: "840", nombreDeSacs: "12" },
    ],
    "SDL Kayanza": [
        { grade: "A1", quantite: "555", nombreDeSacs: "77" },
        { grade: "A3", quantite: "444", nombreDeSacs: "66" },
        { grade: "CAFE NATUREL", quantite: "333", nombreDeSacs: "55" },
    ],
    "SDL Gitega": [
        { grade: "B1", quantite: "222", nombreDeSacs: "44" },
        { grade: "B2", quantite: "222", nombreDeSacs: "44" },
        { grade: "B3", quantite: "222", nombreDeSacs: "44" },
    ],
    "SDL Muramvya": [
        { grade: "B2", quantite: "222", nombreDeSacs: "44" },
        { grade: "B3", quantite: "222", nombreDeSacs: "44" },
        { grade: "COQUE", quantite: "222", nombreDeSacs: "44" },
    ],
    "SDL Karusi": [
        { grade: "A2", quantite: "222", nombreDeSacs: "44" },
        { grade: "B2", quantite: "222", nombreDeSacs: "44" },
        { grade: "CAFE Miel", quantite: "222", nombreDeSacs: "44" },
    ],
};

const MOCK_RECEPTIONS = [
    {
        id: "mock-1",
        societe: "SOGESTAL Kirundo-Muyinga",
        sdls: Object.keys(SDL_GRADES_MAP),
        status: "confirmé",
    },
];

export default function InputForm({ onAddLot }) {
    const [open, setOpen] = useState(false);
    const [societe, setSociete] = useState("");
    const [dateUsinage, setDateUsinage] = useState(new Date().toISOString().split("T")[0]);
    const [checkedGrades, setCheckedGrades] = useState({});

    const allSDLs = Object.keys(SDL_GRADES_MAP);

    useEffect(() => {
        // ensure default societe from mock if desired
        if (!societe && MOCK_RECEPTIONS.length > 0) {
            setSociete(MOCK_RECEPTIONS[0].societe);
        }
    }, []);

    const handleCheckGrade = (key) => {
        setCheckedGrades((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const aggregateGrades = () => {
        const qty = {};
        const sacs = {};
        Object.entries(SDL_GRADES_MAP).forEach(([sdl, grades]) => {
            grades.forEach((g) => {
                const gKey = g.grade;
                const q = parseFloat(g.quantite) || 0;
                const s = parseInt(g.nombreDeSacs) || 0;
                qty[gKey] = (qty[gKey] || 0) + q;
                sacs[gKey] = (sacs[gKey] || 0) + s;
            });
        });
        return { qty, sacs };
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!societe) {
            toast.error("Veuillez sélectionner la société.");
            return;
        }

        const chosenSDLs = Object.keys(SDL_GRADES_MAP);
        const { qty, sacs } = aggregateGrades();

        const newLot = {
            societe,
            selectedSDLs: chosenSDLs,
            dateUsinage,
            usinageQuantities: qty,
            usinageSacs: sacs,
            receptionId: null,
        };

        if (onAddLot) onAddLot(newLot);
        toast.success("Lot mock ajouté en usinage !");
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="default">
                    <Settings className="mr-2 h-4 w-4" /> Usiner
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-4xl md:max-w-2xl lg:max-w-[90vw] bg-sidebar border border-slate-200 dark:border-slate-800 shadow-xl overflow-y-auto max-h-[90vh]">
                <DialogTitle className="sr-only">Ajouter un Lot en Usinage</DialogTitle>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                        <Card className="shadow-none dark:bg-slate-950 border-slate-200 dark:border-slate-800">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                    <Building2 className="h-5 w-5 text-primary" /> Informations Générales (Entrée)
                                </CardTitle>
                                <CardDescription>Société et SDL (mock data)</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="font-semibold text-slate-700 dark:text-slate-300">Société / Propriétaire</Label>
                                        <Select onValueChange={setSociete} value={societe}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Sélectionner une société" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {SOCIETE_LIST.map((s) => (
                                                    <SelectItem key={s} value={s}>
                                                        {s}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="font-semibold text-slate-700 dark:text-slate-300">Date d'Usinage</Label>
                                        <div className="relative">
                                            <Input type="date" value={dateUsinage} onChange={(e) => setDateUsinage(e.target.value)} className="w-full pl-10" />
                                            <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <div className="flex flex-wrap gap-2">
                                        {allSDLs.map((sdl) => (
                                            <div key={sdl} className="bg-primary/10 border border-primary/20 dark:bg-primary/20 text-slate-800 dark:text-slate-200 px-3 py-1 rounded-full text-xs font-semibold">
                                                {sdl}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-none dark:bg-slate-950 border-slate-200 dark:border-slate-800">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                    <Layers className="h-5 w-5 text-primary" /> Quantités Usinées par Grade
                                </CardTitle>
                                <CardDescription>Affichage des grades par SDL à partir des mock data</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {allSDLs.map((sdl) => {
                                        const grades = SDL_GRADES_MAP[sdl] || [];
                                        return (
                                            <div key={sdl} className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                                                <Table>
                                                    <TableHeader>
                                                        <TableCaption className="bg-slate-100 dark:bg-slate-900 p-2 text-left  text-slate-700 dark:text-slate-300 w-max">
                                                            SDL d'origine : <span className="text-primary text-md font-semibold">{sdl}</span>
                                                        </TableCaption>
                                                        <TableRow>
                                                            <TableHead className="w-[150px]">Grade</TableHead>
                                                            <TableHead>Quantité (Kg)</TableHead>
                                                            <TableHead>Nombre de Sacs</TableHead>
                                                            <TableHead>Combiner</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {grades.map((g) => (
                                                            <TableRow key={`${sdl}-${g.grade}`}>
                                                                <TableCell className="font-medium">{g.grade}</TableCell>
                                                                <TableCell>{g.quantite || "-"} Kg</TableCell>
                                                                <TableCell>{g.nombreDeSacs || "-"} Sacs</TableCell>
                                                                <TableCell>
                                                                    <Checkbox checked={!!checkedGrades[`${sdl}-${g.grade}`]} onCheckedChange={() => handleCheckGrade(`${sdl}-${g.grade}`)} />
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
                                <Button type="submit"> <Settings className="mr-2 h-4 w-4" /> Usiner</Button>
                            </CardFooter>
                        </Card>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
