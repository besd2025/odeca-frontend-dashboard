import React, { useEffect } from 'react'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { fetchData } from '@/app/_utils/api';

const StockInfo = {
    numero_lot: "",
    qualite: ["FW", "15+"],
    nombre_sacs: "",
    proprietaire: ["SUCCAM", "ODECA"]
}

export default function StockInitial() {
    const [stockInfo, setStockInfo] = React.useState(StockInfo);
    const [Society, setSociety] = React.useState(stockInfo.proprietaire[0]);
    const [qualite, setQualite] = React.useState(stockInfo.numero_lot[0]);
    const [loading, setLoading] = React.useState(false)
    const [societes, setSocietes] = React.useState([]);
    const [lotsAvailable, setLotsAvailable] = React.useState([]);
    const [open, setOpen] = React.useState(false)
    const HandleSociety = (value) => {
        setSociety(value)
    }

    const HandleQualite = (value) => {
        setQualite(value)
    }
    const fetchInitialData = async () => {
        try {
            const [societesRes, lotsRes] = await Promise.all([
                fetchData("get", "cafe/societes/", { params: { limit: 200, offset: 0 } }),
                fetchData("get", "cafe/qualite_cafe/", { params: { limit: 20, offset: 0 } })
            ]);

            // Sécurité au cas où fetchData encapsule la réponse dans .data
            const dataSocietes = societesRes?.data || societesRes;
            const dataLots = lotsRes?.data || lotsRes;

            setSocietes(dataSocietes?.results);
            console.log("lotsAvailable mis à jour :", dataLots);
            setLotsAvailable(dataLots?.results);


        } catch (err) {
            console.error("Error loading initial data:", err);
        }
    };

    // CORRECTION DU USEEFFECT
    React.useEffect(() => {
        fetchInitialData(); // Apport direct de la fonction ici
    }, []); // Le tableau de dépendances vide assure l'exécution UNIQUE au chargement du composant


    const HandleSubmit = () => {
        if (stockInfo.numero_lot === "" || stockInfo.nombre_sacs === "" || stockInfo.proprietaire === "") {
            toast.error("Veuillez remplir tous les champs")
        }
        else {

            const formData = {
                proprietaire: Society,
                qualite: qualite,
                nombre_sacs: stockInfo.nombre_sacs,
                numero_lot: stockInfo.numero_lot
            }

            try {
                const promise = new Promise(async (resolve, reject) => {
                    try {
                        const results = await fetchData(
                            "post",
                            `cafe/stock_cafe/stockage_initial/`,
                            {
                                params: {},
                                additionalHeaders: {},
                                body: formData
                            },
                        );

                        if (results.status == 200 || results.status == 201) {

                            resolve({ lot: stockInfo.numero_lot });
                        } else {
                            reject(new Error("Erreur"));
                        }

                    }
                    catch (error) {
                        reject(error);
                    }
                });

                toast.promise(promise, {
                    loading: "Modification...",
                    success: (data) => {
                        //onSave(data.lot, finalizedData);
                        setTimeout(() =>

                            setOpen(false), 500);
                        return `Données Enregistrées avec succès `;
                    },
                    error: "Donnée non enregistrée!!!",
                });

                try {
                    promise;
                } catch (error) {
                    console.error(error);
                    setError(error);
                } finally {
                    setLoading(false);
                }
            }
            catch (err) {
                console.error("Error loading initial data:", err);
            }





        }
    }
    return (
        <Dialog>
            <DialogTrigger>
                <Button>
                    <Plus className="h-5 w-5" /> Stock initial
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Stock initial</DialogTitle>
                    <DialogDescription>
                        Renseigner les informations du stock initial
                    </DialogDescription>
                </DialogHeader>
                <div className='flex flex-col gap-4'>

                    <div className='flex flex-col gap-2'>
                        <Label htmlFor="numero">Numero de lot</Label>
                        <Input id="numero" value={stockInfo.numero_lot} onChange={(e) => setStockInfo({ ...stockInfo, numero_lot: e.target.value })} />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <Label htmlFor="numero_lot">Qualite</Label>
                        <Select value={qualite}
                            onValueChange={(value) => HandleQualite(value)}>
                            <SelectTrigger className="w-full bg-background">
                                <SelectValue placeholder="Sélectionner un lot" />
                            </SelectTrigger>
                            <SelectContent>
                                {lotsAvailable?.map((item) => (
                                    <SelectItem key={item.id} value={item?.id}>
                                        {item.nom}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <Label htmlFor="nombre_sacs">Nombre sacs</Label>
                        <Input id="nombre_sacs" value={stockInfo.nombre_sacs} onChange={(e) => setStockInfo({ ...stockInfo, nombre_sacs: e.target.value })} />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <Label htmlFor="proprietaire">Proprietaire/Societe</Label>
                        <Select value={Society}
                            onValueChange={(value) => HandleSociety(value)}>
                            <SelectTrigger className="w-full bg-background">
                                <SelectValue placeholder="Sélectionner un propriétaire" />
                            </SelectTrigger>
                            <SelectContent>
                                {societes.map((item) => (
                                    <SelectItem key={item.id} value={item.id}>
                                        {item.nom_societe}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Annuker</Button>
                    </DialogClose>
                    <Button onClick={HandleSubmit}>Enregistrer</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

    )
}
