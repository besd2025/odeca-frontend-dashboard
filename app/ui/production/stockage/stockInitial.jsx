import React from 'react'
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

    const HandleSociety = (value) => {
        setSociety(value)
    }

    const HandleQualite = (value) => {
        setQualite(value)
    }

    const HandleSubmit = () => {
        if (stockInfo.numero_lot === "" || stockInfo.nombre_sacs === "" || stockInfo.proprietaire === "") {
            toast.error("Veuillez remplir tous les champs")
        } else {
            toast.success("Stock initial enregistré")
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
                                {stockInfo.qualite.map((item) => (
                                    <SelectItem key={item} value={item}>
                                        {item}
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
                                {stockInfo.proprietaire.map((item) => (
                                    <SelectItem key={item} value={item}>
                                        {item}
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
