"use client";
import React from "react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SquarePen, Loader2 } from "lucide-react";
import { fetchData } from "@/app/_utils/api";
import { toast } from "sonner";
export default function EditRapport({ id }) {
    // local state initialized from props
    const [open, setOpen] = React.useState(false);
    const [sdlName, setSdlName] = React.useState("");
    const [soc, setSoc] = React.useState("");
    const [societtecode, setSocietteCode] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [date_debut, setDate_debut] = React.useState("");
    const [date_fin, setDate_fin] = React.useState("");
    const [quantite_cerise_a, setQuantite_cerise_a] = React.useState("");
    const [quantite_cerise_b, setQuantite_cerise_b] = React.useState("");


    React.useEffect(() => {
        const getSdls = async () => {
            console.log("fffffffffffffffffffff", id);
            try {
                const response = await fetchData(
                    "get",
                    `cafe/rapportages_sdl_ct/${id}/`,
                    {
                        params: {},
                        additionalHeaders: {},
                        body: {},
                    },
                );
                setSdlName(response?.sdl_ct?.sdl_ct?.sdl?.sdl_nom || "");
                setSoc(response?.sdl_ct?.sdl_ct?.sdl?.societe?.nom_societe || "");

                setDate_debut(response?.rapportage_sdl_ct_semaine?.week_beginning || "");
                setDate_fin(response?.rapportage_sdl_ct_semaine?.week_end || "");
                setQuantite_cerise_a(response?.quantite_cerise_a || "");
                setQuantite_cerise_b(response?.quantite_cerise_b || "");


            } catch (error) {
                console.error("Error fetching station data:", error);
            }
        };

        getSdls();
    }, [id]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = {
            quantite_cerise_a: Number(quantite_cerise_a) || 0,
            quantite_cerise_b: Number(quantite_cerise_b) || 0,
            week_beginning: date_debut,
            week_end: date_fin,
        };

        const promise = new Promise(async (resolve, reject) => {
            try {
                const results = await fetchData(
                    "patch",
                    `/cafe/rapportages_sdl_ct/${id}/`,
                    {
                        params: {},
                        additionalHeaders: {},
                        body: formData,
                    },
                );

                if (results.status == 200) {
                    resolve({ sdlName });
                } else {
                    reject(new Error("Erreur"));
                }
            } catch (error) {
                reject(error);
            }
        });

        toast.promise(promise, {
            loading: "Modification...",
            success: (data) => {
                // setTimeout(() => window.location.reload(), 1000);
                return `le rapport de la SDL ${sdlName} a été modifié avec succès `;
            },
            error: "Donnée non modifiée",
        });

        try {
            await promise;
        } catch (error) {
            console.error(error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <form onSubmit={handleSubmit}>
                <DialogTrigger asChild>
                    <Button
                        variant="secondary"
                        className="w-full justify-start font-normal text-sm"
                    >
                        <SquarePen />
                        Modifier
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[700px] bg-sidebar">
                    <DialogHeader>
                        <DialogTitle>Modification</DialogTitle>
                        <DialogDescription>Modifier les informations</DialogDescription>
                    </DialogHeader>
                    <div className="custom-scrollbar h-[60vh] lg:max-h-[500px] overflow-y-auto px-2 pb-3">
                        <div className="mt-7">
                            <h5 className="mb-5 text-xl font-medium text-primary dark:text-white/90 lg:mb-6">
                                Informations SDL
                            </h5>
                            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                <div className="col-span-2 lg:col-span-1 space-y-2">
                                    <Label>Nom SDL</Label>
                                    <Input
                                        type="text"
                                        value={sdlName}
                                        disabled
                                    />
                                </div>

                                <div className="col-span-2 lg:col-span-1 space-y-2">
                                    <Label>Société</Label>
                                    <Input
                                        type="text"
                                        value={soc}
                                        className="bg-card h-11 w-full rounded-lg border border-gray-300 px-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                                        disabled
                                    />

                                </div>
                            </div>
                        </div>
                        <div className="mt-7">
                            <h5 className="mb-5 text-xl font-medium text-primary dark:text-white/90 lg:mb-6">
                                informations du rapport
                            </h5>
                            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                <div className="col-span-2 lg:col-span-1 space-y-2">
                                    <Label>date de début</Label>
                                    <Input
                                        type="date"
                                        value={date_debut}
                                        onChange={(e) => setDate_debut(e.target.value)}
                                        disabled
                                    />
                                </div>
                                <div className="col-span-2 lg:col-span-1 space-y-2">
                                    <Label>date de fin</Label>
                                    <Input
                                        type="date"
                                        value={date_fin}
                                        onChange={(e) => setDate_fin(e.target.value)}
                                        disabled
                                    />
                                </div>
                                <div className="col-span-2 lg:col-span-1 space-y-2">
                                    <Label>Quantité cerise A</Label>
                                    <Input
                                        type="text"
                                        value={quantite_cerise_a}
                                        onChange={(e) => setQuantite_cerise_a(e.target.value)}
                                    />
                                </div>
                                <div className="col-span-2 lg:col-span-1 space-y-2">
                                    <Label>Quantité cerise B</Label>
                                    <Input
                                        type="text"
                                        value={quantite_cerise_b}
                                        onChange={(e) => setQuantite_cerise_b(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Annuler</Button>
                        </DialogClose>
                        <Button type="submit" onClick={handleSubmit} disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Enregistrer
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    );
}
