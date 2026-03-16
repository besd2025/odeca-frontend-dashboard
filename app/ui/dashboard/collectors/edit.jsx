import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SquarePen } from "lucide-react";

export function Edit({ collector, children }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children || (
          <Button
            variant="secondary"
            className="w-full justify-start font-normal text-sm"
          >
            <SquarePen />
            Modifier
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Modifier</DialogTitle>
          <DialogDescription>
            Modifiez les informations du collecteur {collector?.first_name}{" "}
            {collector?.last_name}.
          </DialogDescription>
        </DialogHeader>
        <form>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="last_name">Nom</Label>
              <Input
                id="last_name"
                name="last_name"
                type="text"
                placeholder="Nom"
                defaultValue={collector?.last_name || ""}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="first_name">Prénom</Label>
              <Input
                id="first_name"
                name="first_name"
                type="text"
                placeholder="Prénom"
                defaultValue={collector?.first_name || ""}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Numéro de téléphone"
                defaultValue={collector?.phone || ""}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="identifiant">Identifiant</Label>
              <Input
                id="identifiant"
                name="identifiant"
                type="text"
                placeholder="Identifiant de connexion"
                defaultValue={collector?.identifiant || ""}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cni">CNI</Label>
              <Input
                id="cni"
                name="cni"
                type="text"
                placeholder="Numéro de CNI"
                defaultValue={collector?.cni || ""}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Nouveau mot de passe</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Laisser vide pour ne pas modifier"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogTrigger asChild>
              <Button variant="outline" type="button">
                Annuler
              </Button>
            </DialogTrigger>
            <Button type="submit">Enregistrer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
