import React from 'react'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Grape } from "lucide-react";
import { Input } from '@/components/ui/input';
export default function EditRendement() {
    const data = [
        {
            id: 1,
            type: "FW",
            data: [
                { label: "A1", weight: 7.5 },
                { label: "A2", weight: 7.5 },
                { label: "A3", weight: 7.5 },
            ]

        },
        {
            id: 2,
            type: "NATUREL",
            data: [
                { label: "A1", weight: 7.5 },
                { label: "A2", weight: 7.5 },
                { label: "A3", weight: 7.5 },
            ]
        },
        {
            id: 3,
            type: "MIEL",
            data: [
                { label: "A1", weight: 7.5 },
                { label: "A2", weight: 7.5 },
                { label: "A3", weight: 7.5 },
            ],

        }
    ]
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" className=" px-2 py-1.5 w-full  flex justify-start">
                    Modifier
                </Button>
            </DialogTrigger>
            <DialogContent className="w-[70%] max-h-[95vh] overflow-y-auto" >
                <DialogHeader>
                    <DialogTitle>Modifier le rendement</DialogTitle>
                    <div className="mt-2 grid grid-cols-2 gap-2 ">
                        {data.map((item) => (
                            <div key={item.id} className="#CA border rounded p-2">
                                <h1 className="flex gap-x-2 bg-primary w-max items-center py-1 px-2 rounded-lg text-primary-foreground">
                                    <Grape size={20} />
                                    {item.type}
                                </h1>
                                <div className="mt-2 flex flex-col gap-y-2">
                                    {item.data.map((data) => (
                                        <div className="flex items-center gap-x-4 text-sm ">
                                            <span className="text-muted-foreground">{data.label}</span>
                                            <Input type="number" value={data.weight} className="w-[150px]" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Annuler</Button>
                    </DialogClose>
                    <Button variant="default">Enregistrer</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}