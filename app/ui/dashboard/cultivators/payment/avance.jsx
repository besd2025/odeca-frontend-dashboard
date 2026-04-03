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
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SquarePen, Loader2, HandCoins } from "lucide-react";
import { fetchData } from "@/app/_utils/api";
import { toast } from "sonner";

export default function AvancePayment({
    cultivator,
    sdl_ct = "",
    society = "",
    localite = {},
    champs = 0,
}) {
    // Dialog state
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Personal information state
    const [code, setCode] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [date_naissance, setDateNaissance] = useState("");
    const [phone, setPhone] = useState("");
    const [cni, setCni] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    // Association info state
    const [sdl, setSdl] = useState("");
    const [soc, setSoc] = useState("");
    const [numFiche, setNumFiche] = useState("");

    // Location state
    const [province, setProvince] = useState("");
    const [commune, setCommune] = useState("");
    const [zone, setZone] = useState("");
    const [colline, setColline] = useState("");
    const [address_code, setAdressCode] = useState("");

    // Location options state
    const [provinceOptions, setProvinceOptions] = useState([]);
    const [communeOptions, setCommuneOptions] = useState([]);
    const [zoneOptions, setZoneOptions] = useState([]);
    const [collineOptions, setCollineOptions] = useState([]);

    // Field information state
    const [nbChamps, setNbChamps] = useState(0);

    // Payment information state
    const [payment_mode, setPaymentMode] = useState("");
    const [bank_name, setBankName] = useState("");
    const [bank_account, setBankAccount] = useState("");
    const [payment_phone, setPaymentPhone] = useState("");
    const [proprietaire, setProprietaire] = useState("");
    const [collector_code, setCollectorCode] = useState("");


    // Load cultivator data
    useEffect(() => {
        async function loadCultivatorData() {
            try {
                const response = await fetchData("get", `/cultivators/${cultivator}/`, {
                    params: {},
                    additionalHeaders: {},
                    body: {},
                });
                setCode(response.cultivator_code || "");
                setFirstName(response?.cultivator_first_name || "");
                setLastName(response?.cultivator_last_name || "");
                setImageUrl(response?.cultivator_photo || "");
                setDateNaissance(response?.date_naissance || "");
                setPhone(response?.cultivator_telephone || "");
                setCni(response?.cultivator_cni || "");
                setSdl(sdl_ct || "");
                setSoc(society || "");
                setNumFiche(response?.cultivator_assoc_numero_fiche || "");
                setProvince(localite?.province || "");
                setCommune(localite?.commune || "");
                setZone(localite?.zone || "");
                setColline(localite?.colline || "");
                setNbChamps(champs || 0);
                setPaymentMode(response?.cultivator_payment_type || "");
                setBankName(response?.cultivator_bank_name || "");
                setBankAccount(response?.cultivator_bank_account || "");
                setPaymentPhone(response?.cultivator_mobile_payment_account || "");
                setProprietaire(response?.cultivator_account_owner || "");
                setCollectorCode(response?.collector?.unique_code || "");
                setColline(response?.cultivator_adress?.colline_code || "");
            } catch (error) {
                console.error("Error loading cultivator data:", error);
            }
        }
        loadCultivatorData();
    }, [cultivator, sdl_ct, society, localite, champs]);



    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <form >
                <DialogTrigger asChild>
                    <Button
                        variant="outline"
                        className="w-full justify-start font-normal text-sm"
                    >
                        <HandCoins />
                        Avance
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px] bg-sidebar">
                    <DialogHeader>
                        <DialogTitle>Avance</DialogTitle>
                        <DialogDescription>Payer une avance au cafeiculteur</DialogDescription>
                    </DialogHeader>
                    <div className="custom-scrollbar h-[60vh] lg:max-h-[300px] overflow-y-auto px-2 pb-3">
                        <div>
                            <h5 className="mb-5 text-xl font-medium text-primary dark:text-white/90 lg:mb-6">
                                Code cafeiculteur
                            </h5>

                            <Input
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                disabled
                            />
                        </div>
                        <div className="mt-7">
                            <h5 className="mb-5 text-xl font-medium text-primary dark:text-white/90 lg:mb-6">
                                Entre le montant de l'avance
                            </h5>
                            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                <div className="col-span-2 lg:col-span-1 space-y-2">
                                    <Label>Montant</Label>
                                    <Input
                                        type="text"
                                        value={""}
                                    // onChange={(e) => setLastName(e.target.value)}
                                    />
                                </div>
                                <div className="col-span-2 lg:col-span-1 space-y-2">
                                    <Label>Date</Label>
                                    <Input
                                        type="date"
                                        value={""}
                                    // onChange={(e) => setDateNaissance(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Annuler</Button>
                        </DialogClose>
                        <Button type="submit"
                            // onClick={handleSubmit} 
                            disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Valider
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    );
}
