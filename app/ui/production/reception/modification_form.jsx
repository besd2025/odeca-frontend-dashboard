"use client";

import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
    Pencil,
    Scale,
    Percent,
    Layers,
    Building2,
    Save,
    RefreshCw,
    AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { fetchData } from "@/app/_utils/api";

/**
 * ModificationForm
 *
 * Props:
 *  - show         : boolean — contrôle l'ouverture du dialog
 *  - onShowChange : (boolean) => void — callback pour ouvrir / fermer
 *  - detailData   : objet lot sélectionné depuis la table (id, societe, sdls, poidsNet, …)
 */
export default function ModificationForm({ show, onShowChange, detailData }) {
    /* ------------------------------------------------------------------ */
    /*  State                                                               */
    /* ------------------------------------------------------------------ */
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [gradeOptions, setGradeOptions] = useState([]);

    const [formData, setFormData] = useState({
        gradeId: "",
        gradeName: "",
        societe: "",
        sdl: "",
        sacsCount: "",
        poidsBrut: "",
        poidsTare: "",
        humidite: "",
    });

    const [errors, setErrors] = useState({});

    /* ------------------------------------------------------------------ */
    /*  Derived                                                             */
    /* ------------------------------------------------------------------ */
    const brut = parseFloat(formData.poidsBrut) || 0;
    const tare = parseFloat(formData.poidsTare) || 0;
    const poidsNet = Math.max(0, brut - tare);

    /* ------------------------------------------------------------------ */
    /*  Load data when dialog opens                                         */
    /* ------------------------------------------------------------------ */
    useEffect(() => {
        if (!show || !detailData?.id) return;

        async function load() {
            setFetching(true);
            try {
                const [detail, grades] = await Promise.all([
                    fetchData("get", `cafe/transfert_sdl_usine/${detailData.id}/`),
                    fetchData("get", `cafe/grades/get_all_grades/`),
                ]);

                setFormData({
                    gradeId: detail?.grade?.id ?? "",
                    gradeName: detail?.grade?.grade_name ?? "",
                    societe: detailData?.societe ?? detail?.sdl?.societe?.nom_societe ?? "",
                    sdl: detailData?.sdls ?? detail?.sdl?.sdl_nom ?? "",
                    sacsCount: detail?.nombre_sac ?? "",
                    poidsBrut: detail?.quantite_confirme_brut ?? "",
                    poidsTare: detail?.quantite_confirme_tare ?? "",
                    humidite: detail?.humidity ?? "",
                });

                const options =
                    grades?.map((g) => ({ value: g.id, label: g.grade_name })) || [];
                setGradeOptions(options);
            } catch (err) {
                console.error("Erreur chargement données:", err);
                toast.error("Impossible de charger les données à modifier.");
            } finally {
                setFetching(false);
            }
        }

        load();
    }, [show, detailData]);

    /* ------------------------------------------------------------------ */
    /*  Reset form when dialog closes                                       */
    /* ------------------------------------------------------------------ */
    useEffect(() => {
        if (!show) {
            setErrors({});
        }
    }, [show]);

    /* ------------------------------------------------------------------ */
    /*  Handlers                                                            */
    /* ------------------------------------------------------------------ */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    const handleGradeChange = (value) => {
        const found = gradeOptions.find((g) => String(g.value) === String(value));
        setFormData((prev) => ({
            ...prev,
            gradeId: value,
            gradeName: found?.label ?? "",
        }));
        setErrors((prev) => ({ ...prev, gradeId: undefined }));
    };

    /* ------------------------------------------------------------------ */
    /*  Validation                                                          */
    /* ------------------------------------------------------------------ */
    const validate = () => {
        const newErrors = {};
        if (!formData.gradeId) newErrors.gradeId = "Veuillez sélectionner un grade.";
        if (!formData.sacsCount || Number(formData.sacsCount) <= 0)
            newErrors.sacsCount = "Nombre de sacs invalide.";
        if (!formData.poidsBrut || Number(formData.poidsBrut) <= 0)
            newErrors.poidsBrut = "Poids brut invalide.";
        if (!formData.poidsTare || Number(formData.poidsTare) < 0)
            newErrors.poidsTare = "Poids tare invalide.";
        if (
            !formData.humidite ||
            Number(formData.humidite) < 0 ||
            Number(formData.humidite) > 100
        )
            newErrors.humidite = "Humidité doit être entre 0 et 100.";
        return newErrors;
    };

    /* ------------------------------------------------------------------ */
    /*  Submit                                                              */
    /* ------------------------------------------------------------------ */
    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            toast.error("Veuillez corriger les erreurs avant de soumettre.");
            return;
        }

        const body = {
            grade: formData.gradeId,
            humidity: formData.humidite,
            quantite_confirme_brut: formData.poidsBrut,
            quantite_confirme_tare: formData.poidsTare,
            nombre_sac: formData.sacsCount,
        };

        const promise = new Promise(async (resolve, reject) => {
            try {
                const result = await fetchData(
                    "patch",
                    `cafe/transfert_sdl_usine/${detailData.id}/`,
                    { body }
                );
                resolve(result);
            } catch (err) {
                reject(err);
            }
        });

        toast.promise(promise, {
            loading: "Modification en cours...",
            success: () => {
                onShowChange(false);
                return "Données modifiées avec succès !";
            },
            error: "Erreur lors de la modification.",
        });

        try {
            setLoading(true);
            await promise;
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    /* ------------------------------------------------------------------ */
    /*  Render                                                              */
    /* ------------------------------------------------------------------ */
    return (
        <Dialog open={show} onOpenChange={onShowChange}>
            <DialogContent className="sm:max-w-[550px] border border-slate-200 dark:border-slate-800 shadow-xl overflow-y-auto max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                        <Pencil className="h-4.5 w-4.5 text-primary" />
                        Modifier la Réception
                    </DialogTitle>
                    <DialogDescription className="text-slate-500 dark:text-slate-400">
                        Modifiez les informations du lot puis enregistrez vos changements.
                    </DialogDescription>
                </DialogHeader>

                {fetching ? (
                    <div className="flex items-center justify-center py-12 gap-3 text-slate-500 dark:text-slate-400">
                        <RefreshCw className="h-5 w-5 animate-spin text-primary" />
                        <span className="text-sm font-medium">Chargement des données...</span>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* ── Header info ────────────────────────────────── */}
                        <div className="p-3 bg-primary/5 border border-primary/10 rounded-lg text-sm space-y-1">
                            <div className="flex items-center justify-between">
                                <span className="font-semibold text-primary text-xs">
                                    Lot #{detailData?.id}
                                </span>
                                <Badge
                                    variant="outline"
                                    className="text-[10px] border-primary/20 text-primary bg-primary/5"
                                >
                                    {formData.gradeName || "Grade"}
                                </Badge>
                            </div>
                            {(formData.societe || formData.sdl) && (
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    <span className="font-medium text-slate-700 dark:text-slate-300">
                                        {formData.societe}
                                    </span>
                                    {formData.sdl && (
                                        <>
                                            {" / "}
                                            <span className="italic">{formData.sdl}</span>
                                        </>
                                    )}
                                </p>
                            )}
                        </div>

                        {/* ── Informations non modifiables ────────────────── */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="font-semibold text-slate-700 dark:text-slate-300 text-xs flex items-center gap-1">
                                    <Building2 className="h-3 w-3 text-slate-400" />
                                    Société
                                </Label>
                                <Input
                                    value={formData.societe}
                                    disabled
                                    className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 cursor-not-allowed h-9 text-sm"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="font-semibold text-slate-700 dark:text-slate-300 text-xs">
                                    SDL
                                </Label>
                                <Input
                                    value={formData.sdl}
                                    disabled
                                    className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 cursor-not-allowed h-9 text-sm"
                                />
                            </div>
                        </div>

                        {/* ── Grade ───────────────────────────────────────── */}
                        <div className="space-y-1.5">
                            <Label
                                htmlFor="mod-gradeId"
                                className="font-semibold text-slate-700 dark:text-slate-300 text-xs"
                            >
                                Grade
                            </Label>
                            <Select
                                value={String(formData.gradeId)}
                                onValueChange={handleGradeChange}
                            >
                                <SelectTrigger
                                    id="mod-gradeId"
                                    className={`w-full cursor-pointer ${errors.gradeId ? "border-red-500 focus:ring-red-500" : ""}`}
                                >
                                    <SelectValue placeholder="Sélectionner un grade..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {gradeOptions.map((item, i) => (
                                        <SelectItem key={`${item.value}-${i}`} value={String(item.value)}>
                                            {item.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.gradeId && <FieldError message={errors.gradeId} />}
                        </div>

                        {/* ── Nombre de sacs ──────────────────────────────── */}
                        <div className="space-y-1.5">
                            <Label
                                htmlFor="mod-sacsCount"
                                className="font-semibold text-slate-700 dark:text-slate-300 text-xs"
                            >
                                Nombre de Sacs
                            </Label>
                            <Input
                                type="number"
                                step="1"
                                min="0"
                                id="mod-sacsCount"
                                name="sacsCount"
                                value={formData.sacsCount}
                                onChange={handleChange}
                                placeholder="Ex: 320"
                                className={errors.sacsCount ? "border-red-500 focus-visible:ring-red-500" : ""}
                            />
                            {errors.sacsCount && <FieldError message={errors.sacsCount} />}
                        </div>

                        {/* ── Poids Brut / Tare ───────────────────────────── */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label
                                    htmlFor="mod-poidsBrut"
                                    className="font-semibold text-slate-700 dark:text-slate-300 text-xs flex items-center gap-1"
                                >
                                    <Scale className="h-3 w-3 text-slate-400" />
                                    Poids Brut (kg)
                                </Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    id="mod-poidsBrut"
                                    name="poidsBrut"
                                    value={formData.poidsBrut}
                                    onChange={handleChange}
                                    placeholder="Ex: 7200.00"
                                    className={errors.poidsBrut ? "border-red-500 focus-visible:ring-red-500" : ""}
                                />
                                {errors.poidsBrut && <FieldError message={errors.poidsBrut} />}
                            </div>

                            <div className="space-y-1.5">
                                <Label
                                    htmlFor="mod-poidsTare"
                                    className="font-semibold text-slate-700 dark:text-slate-300 text-xs flex items-center gap-1"
                                >
                                    <Scale className="h-3 w-3 text-slate-400" />
                                    Poids Tare (kg)
                                </Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    id="mod-poidsTare"
                                    name="poidsTare"
                                    value={formData.poidsTare}
                                    onChange={handleChange}
                                    placeholder="Ex: 320.00"
                                    className={errors.poidsTare ? "border-red-500 focus-visible:ring-red-500" : ""}
                                />
                                {errors.poidsTare && <FieldError message={errors.poidsTare} />}
                            </div>
                        </div>

                        {/* ── Humidité ─────────────────────────────────────── */}
                        <div className="space-y-1.5">
                            <Label
                                htmlFor="mod-humidite"
                                className="font-semibold text-slate-700 dark:text-slate-300 text-xs flex items-center gap-1"
                            >
                                Humidité <Percent className="h-3 w-3 text-slate-400" />
                            </Label>
                            <Input
                                type="number"
                                step="0.01"
                                min="0"
                                max="100"
                                id="mod-humidite"
                                name="humidite"
                                value={formData.humidite}
                                onChange={handleChange}
                                placeholder="Ex: 11.50"
                                className={errors.humidite ? "border-red-500 focus-visible:ring-red-500" : ""}
                            />
                            {errors.humidite && <FieldError message={errors.humidite} />}
                        </div>

                        {/* ── Poids Net (calculé) ──────────────────────────── */}
                        <div className="rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 p-3 flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                                Poids Net Calculé
                            </span>
                            <span className="text-lg font-bold text-primary">
                                {poidsNet.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}{" "}
                                <span className="text-xs font-medium text-slate-500">kg</span>
                            </span>
                        </div>

                        {/* ── Actions ──────────────────────────────────────── */}
                        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => onShowChange(false)}
                                className="h-9 text-slate-600 hover:text-red-500 transition-colors"
                                disabled={loading}
                            >
                                Annuler
                            </Button>
                            <Button
                                type="submit"
                                size="sm"
                                className="h-9 gap-1.5 font-semibold"
                                disabled={loading}
                            >
                                {loading ? (
                                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                    <Save className="h-3.5 w-3.5" />
                                )}
                                Enregistrer
                            </Button>
                        </div>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Helper component                                                          */
/* ────────────────────────────────────────────────────────────────────────── */
function FieldError({ message }) {
    return (
        <p className="flex items-center gap-1 text-xs text-red-500 font-medium mt-0.5">
            <AlertCircle className="h-3 w-3 flex-shrink-0" />
            {message}
        </p>
    );
}
