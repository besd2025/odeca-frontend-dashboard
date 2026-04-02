"use client";
import React, { useState } from "react";
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
import { Plus, Workflow } from "lucide-react";

export default function AddCollector({ id }) {
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    cni: "",
    identifiant: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Add Collector Data:", formData);
    setOpen(false);
    setFormData({
      first_name: "",
      last_name: "",
      phone: "",
      cni: "",
      identifiant: "",
      password: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="font-normal text-sm w-full bg-transparent border-none" variant="outline">
          <Workflow />
          <span>Affecter</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-sidebar">
        <DialogHeader>
          <DialogTitle>Ajouter</DialogTitle>
          <DialogDescription>
            Ajoutez les informations d'un nouveau collecteur.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="last_name">Nom</Label>
              <Input
                id="last_name"
                name="last_name"
                type="text"
                placeholder="Nom"
                value={formData.last_name}
                onChange={handleChange}
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
                value={formData.first_name}
                onChange={handleChange}
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
                value={formData.phone}
                onChange={handleChange}
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
                value={formData.identifiant}
                onChange={handleChange}
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
                value={formData.cni}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Mot de passe"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit">
              Enregistrer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
