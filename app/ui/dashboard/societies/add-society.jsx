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
import { Plus } from "lucide-react";

export default function AddSociety() {
    const [open, setOpen] = React.useState(false);
    const [nomSociete, setNomSociete] = React.useState("");
    const [codeSociete, setCodeSociete] = React.useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        // Remove logics as requested
        console.log("Society info:", { nomSociete, codeSociete });
        setOpen(false);
        setNomSociete("");
        setCodeSociete("");
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="font-normal text-sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter une société
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-sidebar">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Ajouter une société</DialogTitle>
                        <DialogDescription>
                            Entrez les détails de la nouvelle société
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-6 space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="nom">Nom de la société</Label>
                            <Input
                                id="nom"
                                type="text"
                                value={nomSociete}
                                onChange={(e) => setNomSociete(e.target.value)}
                                placeholder="Entrer le nom de la société"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="code">Code de la société</Label>
                            <Input
                                id="code"
                                type="text"
                                value={codeSociete}
                                onChange={(e) => setCodeSociete(e.target.value)}
                                placeholder="Entrer le code de la société"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" type="button">Annuler</Button>
                        </DialogClose>
                        <Button type="submit">
                            Enregistrer
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
