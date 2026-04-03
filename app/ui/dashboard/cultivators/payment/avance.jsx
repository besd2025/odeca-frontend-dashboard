"use client";
import React, { useState, useEffect } from "react";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { HandCoins, Loader2 } from "lucide-react";
import { fetchData } from "@/app/_utils/api";
import { toast } from "sonner";

export default function AvancePayment({
    cultivator,
    champs = 0,
}) {
    // Dialog state
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Personal information state
    const [code, setCode] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    // Association info state
    const [sdlId, setSdlId] = useState("");

    // Location state
    const [province, setProvince] = useState("");
    const [commune, setCommune] = useState("");
    const [zone, setZone] = useState("");
    const [colline, setColline] = useState("");

    // Location options state
    const [provinceOptions, setProvinceOptions] = useState([]);
    const [communeOptions, setCommuneOptions] = useState([]);
    const [zoneOptions, setZoneOptions] = useState([]);
    const [collineOptions, setCollineOptions] = useState([]);
    const [sdlOptions, setSdlOptions] = useState([]);

    // Field information state
    const [nbChamps, setNbChamps] = useState(0);

    // Load initial provinces
    useEffect(() => {
        async function loadProvinces() {
            try {
                const data = await fetchData("get", `adress/province/`, {
                    params: { offset: 0, limit: 100 },
                });
                const options = data?.results?.map((item) => ({
                    value: item.province_name,
                    label: item.province_name,
                })) || [];
                setProvinceOptions(options);
            } catch (error) {
                console.error("Error loading provinces:", error);
            }
        }
        if (open) loadProvinces();
    }, [open]);

    // Handle province change
    const handleProvinceChange = async (value) => {
        setProvince(value);
        setCommuneOptions([]);
        setCommune("");
        setZoneOptions([]);
        setZone("");
        setCollineOptions([]);
        setColline("");
        setSdlOptions([]);
        setSdlId("");

        if (!value) return;

        try {
            const data = await fetchData(
                "get",
                `adress/commune/get_communes_by_province`,
                { params: { province: value } }
            );
            const options = data?.map((item) => ({
                value: item.commune_name,
                label: item.commune_name,
            })) || [];
            setCommuneOptions(options);
        } catch (error) {
            console.error("Error loading communes:", error);
        }
    };

    // Handle commune change
    const handleCommuneChange = async (value) => {
        setCommune(value);
        setZoneOptions([]);
        setZone("");
        setCollineOptions([]);
        setColline("");
        setSdlOptions([]);
        setSdlId("");

        if (!value) return;

        try {
            const data = await fetchData("get", `adress/zone/get_zones_by_commune/`, {
                params: { commune: value },
            });
            const options = data?.map((item) => ({
                value: item.zone_name,
                label: item.zone_name,
            })) || [];
            setZoneOptions(options);
        } catch (error) {
            console.error("Error loading zones:", error);
        }
    };

    // Handle zone change
    const handleZoneChange = async (value) => {
        setZone(value);
        setCollineOptions([]);
        setColline("");
        setSdlOptions([]);
        setSdlId("");

        if (!value) return;

        try {
            const data = await fetchData("get", `adress/colline/get_collines_by_zone/`, {
                params: { zone: value },
            });
            const options = data?.map((item) => ({
                value: item.colline_code,
                label: item.colline_name,
            })) || [];
            setCollineOptions(options);
        } catch (error) {
            console.error("Error loading collines:", error);
        }
    };

    // Handle colline change -> selection les SDL par colline
    const handleCollineChange = async (value) => {
        setColline(value);
        setSdlOptions([]);
        setSdlId("");

        if (!value) return;

        try {
            const response = await fetchData("get", `cafe/stationslavage/`, {
                params: { sdl_adress__colline_code: value }
            });

            console.log("response", response)
            const options = response?.results?.map((item) => ({
                value: item.id.toString(),
                label: item.sdl_nom,
            })) || [];
            setSdlOptions(options);
        } catch (error) {
            console.error("Error loading SDLs:", error);
        }
    };

    // Load cultivator data
    useEffect(() => {
        async function loadCultivatorData() {
            if (!cultivator) return;
            try {
                const response = await fetchData("get", `/cultivators/${cultivator}/`);
                setCode(response.cultivator_code || "");
                setFirstName(response?.cultivator_first_name || "");
                setLastName(response?.cultivator_last_name || "");
                setNbChamps(champs || 0);
            } catch (error) {
                console.error("Error loading cultivator data:", error);
            }
        }
        if (open) loadCultivatorData();
    }, [open, cultivator, champs]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        toast.info("Fonctionnalité d'envoi en cours de développement");
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="w-full justify-start font-normal text-sm"
                >
                    <HandCoins className="mr-2 h-4 w-4" />
                    Avance
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-sidebar">
                <DialogHeader>
                    <DialogTitle>Payer une Avance</DialogTitle>
                    <DialogDescription>
                        Saisissez le montant de l'avance et sélectionnez la station de lavage.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 py-4 max-h-[70vh] overflow-y-auto px-1">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Code Caféiculteur</Label>
                            <Input value={code} disabled />
                        </div>
                        <div className="space-y-2">
                            <Label>Nom & Prénom</Label>
                            <Input value={`${lastName} ${firstName}`} disabled />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h5 className="text-lg font-medium text-primary">Localité</h5>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Province</Label>
                                <Select value={province} onValueChange={handleProvinceChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Province" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {provinceOptions.map((item) => (
                                            <SelectItem key={item.value} value={item.value}>
                                                {item.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Commune</Label>
                                <Select value={commune} onValueChange={handleCommuneChange} disabled={!province}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Commune" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {communeOptions.map((item) => (
                                            <SelectItem key={item.value} value={item.value}>
                                                {item.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Zone</Label>
                                <Select value={zone} onValueChange={handleZoneChange} disabled={!commune}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Zone" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {zoneOptions.map((item) => (
                                            <SelectItem key={item.value} value={item.value}>
                                                {item.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Colline</Label>
                                <Select value={colline} onValueChange={handleCollineChange} disabled={!zone}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Colline" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {collineOptions.map((item) => (
                                            <SelectItem key={item.value} value={item.value}>
                                                {item.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h5 className="text-lg font-medium text-primary">Station de Lavage (SDL)</h5>
                        <div className="space-y-2">
                            <Label>Sélectionner la SDL</Label>
                            <Select value={sdlId} onValueChange={setSdlId} disabled={!colline}>
                                <SelectTrigger>
                                    <SelectValue placeholder={colline ? "Sélectionner une SDL" : "Veuillez d'abord choisir une colline"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {sdlOptions.map((item) => (
                                        <SelectItem key={item.value} value={item.value}>
                                            {item.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h5 className="text-lg font-medium text-primary">Montant de l'avance</h5>
                        <div className="space-y-2">
                            <Label>Montant (FBU)</Label>
                            <Input type="number" placeholder="Entrez le montant" required />
                        </div>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Annuler</Button>
                        </DialogClose>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Valider le paiement
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
