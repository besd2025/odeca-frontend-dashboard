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

export function AddPrevision() {
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
                            <Input id="name-1" name="name" />
                        </Field>
                        <Field>
                            <Label htmlFor="username-1">Quantités prévisionnelles</Label>
                            <Input id="username-1" name="username" />
                        </Field>
                    </FieldGroup>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Annuler</Button>
                        </DialogClose>
                        <Button type="submit">Ajouter</Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}
