import { Button } from "@/components/ui/button"
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
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlusCircle } from "lucide-react"
import { fetchData } from "@/app/_utils/api"
import { toast } from "sonner"
import { useState } from "react"
export function AddPrevision({ sdl_id }) {
    const [nom_cafeiculteur, setNom_cafeiculteur] = useState("");
    const [quantite_previsionnelle, setQuantite_previsionnelle] = useState("");
    const valide = async () => {
        try {
            const response = await fetchData("post", `cafe/previsions_sdl_ct/`, {
                params: {},
                additionalHeaders: {},
                body: {
                    sdl_ct: sdl_id,
                    prevision_cafeiculteurs: nom_cafeiculteur,
                    prevision_sdl_ct_quantite: quantite_previsionnelle,
                },
            });
            if (response.status === 201) {
                toast.success("Prévision ajoutée avec succès");
                setNom_cafeiculteur("");
                setQuantite_previsionnelle("");
                //window.location.reload();
            }
            else if (response.status === "fulfilled") {
                toast.error(response.error.message);
            }
        } catch (error) {
            console.error("Error fetching sdl data:", error);
        }
    }
    return (
        <Dialog>
            <form>
                <DialogTrigger asChild>
                    <Button variant="outline">
                        <PlusCircle className="size-4" />
                        Prévisions
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Ajouter des prévisions</DialogTitle>
                        <DialogDescription>
                            Ajouter des prévisions du campagne 2026 pour ce CT
                        </DialogDescription>
                    </DialogHeader>
                    <FieldGroup>
                        <Field>
                            <Label htmlFor="name-1">Cafeiculteurs prévisionnels</Label>
                            <Input id="name-1" name="name" value={nom_cafeiculteur} onChange={(e) => setNom_cafeiculteur(e.target.value)} />
                        </Field>
                        <Field>
                            <Label htmlFor="username-1">Quantités prévisionnelles</Label>
                            <Input id="username-1" name="username" value={quantite_previsionnelle} onChange={(e) => setQuantite_previsionnelle(e.target.value)} />
                        </Field>
                    </FieldGroup>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Annuler</Button>
                        </DialogClose>
                        <Button type="submit" onClick={valide}>Ajouter</Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}
