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
import { toast } from "sonner";
import { fetchData } from "@/app/_utils/api";
import React from "react";
export function Edit({ collector, children }) {
  const [first_name, setFirst_Name] = React.useState("")
  const [last_name, setLast_Name] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [cni, setCNI] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [Loading, setLoading] = React.useState(false)
  const Valide = async (e) => {
    e.preventDefault()
    const formData = {
      first_name: first_name || collector?.first_name,
      last_name: last_name || collector?.last_name,
      phone: phone || collector?.phone,
      cni: cni,
      password: password
    }

    const promise = new Promise(async (resolve, reject) => {
      try {
        const results = await fetchData(
          "patch",
          `/cafe/responsable_registration/${collector?.id}/`,
          {
            params: {},
            additionalHeaders: {},
            body: formData,
          },
        );
        if (results.status == 200) {
          resolve({});
        } else {
          reject(new Error("Erreur"));
        }
      } catch (error) {
        reject(error);
      }
    });

    toast.promise(promise, {
      loading: "Modification...",
      success: (data) => {
        // setTimeout(() => window.location.reload(), 1000);
        return `${collector?.identifiant} a été modifié avec succès `;
      },
      error: "Donnée non modifiée",
    });

    try {
      await promise;
    } catch (error) {
      console.error(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }
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
                onChange={(e) => setLast_Name(e.target.value)}
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
                onChange={(e) => setFirst_Name(e.target.value)}
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
                onChange={(e) => setPhone(e.target.value)}
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
                onChange={(e) => setCNI(e.target.value)}
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
                onChange={(e) => setPassword(e.target.value)}
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
            <Button onClick={Valide} type="submit">Enregistrer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
