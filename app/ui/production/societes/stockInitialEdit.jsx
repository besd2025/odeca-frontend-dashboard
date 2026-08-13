"use client"
import React from 'react'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Pencil } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { fetchData } from '@/app/_utils/api';

/**
 * StockInitialEdit — Formulaire de modification d'un stock initial existant.
 *
 * Props:
 *  - open        : boolean — contrôle l'ouverture du dialog
 *  - onOpenChange: (open: boolean) => void — callback de changement d'état
 *  - stockItem   : object — les données du stock à modifier
 *  - onSuccess   : () => void — callback appelé après une modification réussie
 */
export default function StockInitialEdit({ open, onOpenChange, stockItem, onSuccess }) {
    console.log("stockItem", stockItem);
    const [stockInfo, setStockInfo] = React.useState({
        numero_lot: "",
        nombre_sacs: "",
        annee_campagne: "",
        quantite_cafe_vert: "",
    });
    const [Society, setSociety] = React.useState("");
    const [qualite, setQualite] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [societes, setSocietes] = React.useState([]);
    const [lotsAvailable, setLotsAvailable] = React.useState([]);

    // Charger les données de référence (sociétés & qualités)
    const fetchInitialData = async () => {
        try {
            const [societesRes, lotsRes] = await Promise.all([
                fetchData("get", "cafe/societes/", { params: { limit: 200, offset: 0 } }),
                fetchData("get", "cafe/qualite_cafe/", { params: { limit: 20, offset: 0 } })
            ]);
            const dataSocietes = societesRes?.data || societesRes;
            const dataLots = lotsRes?.data || lotsRes;
            setSocietes(dataSocietes?.results || []);
            setLotsAvailable(dataLots?.results || []);
        } catch (err) {
            console.error("Error loading initial data:", err);
        }
    };

    // Pré-remplir le formulaire quand stockItem change ou que le dialog s'ouvre
    React.useEffect(() => {
        if (open) {
            fetchInitialData();
        }
        if (stockItem) {
            setStockInfo({
                numero_lot: stockItem.numero_lot || "",
                nombre_sacs: stockItem.nombre_sacs || "",
                annee_campagne: stockItem.annee_campagne || "",
                quantite_cafe_vert: stockItem.quantite || "",
            });
            setSociety(stockItem.proprietaire_id ? String(stockItem.proprietaire_id) : "");
            setQualite(stockItem.qualite_id ? String(stockItem.qualite_id) : "");
        }
    }, [stockItem, open]);

    const HandleSubmit = async () => {
        if (
            stockInfo.numero_lot === "" ||
            stockInfo.nombre_sacs === "" ||
            Society === "" ||
            qualite === "" ||
            stockInfo.annee_campagne === "" ||
            stockInfo.quantite_cafe_vert === ""
        ) {
            toast.error("Veuillez remplir tous les champs");
            return;
        }

        const formData = {
            proprietaire: Society,
            qualite: qualite,
            nombre_sacs: stockInfo.nombre_sacs,
            numero_lot: stockInfo.numero_lot,
            annee_campagne: stockInfo.annee_campagne,
            quantite_cafe_vert: stockInfo.quantite_cafe_vert,
        };

        setLoading(true);
        const promise = new Promise(async (resolve, reject) => {
            try {
                const results = await fetchData(
                    "patch",
                    `cafe/stock_cafe/stockage_initial/${stockItem.id}/`,
                    {
                        params: {},
                        additionalHeaders: {},
                        body: formData,
                    }
                );
                if (results?.status === 200 || results?.status === 201 || results?.id) {
                    resolve({ lot: stockInfo.numero_lot });
                } else {
                    reject(new Error("Erreur lors de la modification"));
                }
            } catch (error) {
                reject(error);
            } finally {
                setLoading(false);
            }
        });

        toast.promise(promise, {
            loading: "Modification en cours...",
            success: () => {
                setTimeout(() => onOpenChange(false), 500);
                if (onSuccess) onSuccess();
                return `Stock du lot ${stockInfo.numero_lot} modifié avec succès !`;
            },
            error: "Erreur : données non enregistrées !",
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">

                        Modifier
                    </DialogTitle>
                    <DialogDescription>
                        Modifiez les informations du stock initial pour le lot{" "}
                        <strong>{stockItem?.numero_lot}</strong>.
                    </DialogDescription>
                </DialogHeader>

                <div className='flex flex-col gap-4'>
                    {/* Numéro de lot */}
                    <div className='flex flex-col gap-2'>
                        <Label htmlFor="edit-numero">Numéro de lot</Label>
                        <Input
                            id="edit-numero"
                            value={stockInfo.numero_lot}
                            onChange={(e) => setStockInfo({ ...stockInfo, numero_lot: e.target.value })}
                        />
                    </div>

                    {/* Qualité */}
                    <div className='flex flex-col gap-2'>
                        <Label htmlFor="edit-qualite">Qualité</Label>
                        <Select value={qualite} onValueChange={setQualite}>
                            <SelectTrigger className="w-full bg-background">
                                <SelectValue placeholder="Sélectionner une qualité" />
                            </SelectTrigger>
                            <SelectContent>
                                {lotsAvailable?.map((item) => (
                                    <SelectItem key={item.id} value={String(item.id)}>
                                        {item.nom}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <span>Qualité actuelle : {stockItem?.qualite}</span>
                    </div>

                    {/* Quantité café vert */}
                    <div className='flex flex-col gap-2'>
                        <Label htmlFor="edit-quantite">Quantité café vert (en kg)</Label>
                        <Input
                            type='number'
                            id="edit-quantite"
                            value={stockInfo.quantite_cafe_vert}
                            onChange={(e) => setStockInfo({ ...stockInfo, quantite_cafe_vert: e.target.value })}
                        />
                    </div>

                    {/* Nombre de sacs */}
                    <div className='flex flex-col gap-2'>
                        <Label htmlFor="edit-sacs">Nombre de sacs</Label>
                        <Input
                            type='number'
                            id="edit-sacs"
                            value={stockInfo.nombre_sacs}
                            onChange={(e) => setStockInfo({ ...stockInfo, nombre_sacs: e.target.value })}
                        />
                    </div>

                    {/* Propriétaire / Société */}
                    <div className='flex flex-col gap-2'>
                        <Label htmlFor="edit-proprietaire">Propriétaire / Société</Label>
                        <Select value={Society} onValueChange={setSociety}>
                            <SelectTrigger className="w-full bg-background">
                                <SelectValue placeholder="Sélectionner un propriétaire" />
                            </SelectTrigger>
                            <SelectContent>
                                {societes.map((item) => (
                                    <SelectItem key={item.id} value={String(item.id)}>
                                        {item.nom_societe}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <span>Propriétaire actuel : {stockItem?.societe}</span>
                    </div>

                    {/* Année de campagne */}
                    <div className='flex flex-col gap-2'>
                        <Label htmlFor="edit-annee">Année de campagne</Label>
                        <Input
                            type='number'
                            id="edit-annee"
                            value={stockInfo.annee_campagne}
                            onChange={(e) => setStockInfo({ ...stockInfo, annee_campagne: e.target.value })}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" disabled={loading}>Annuler</Button>
                    </DialogClose>
                    <Button onClick={HandleSubmit} disabled={loading}>
                        {loading ? "Enregistrement..." : "Enregistrer les modifications"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
