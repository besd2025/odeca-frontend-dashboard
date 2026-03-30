"use client";
import React, { useState } from "react";
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
import { Plus } from "lucide-react";

export default function AddSdl() {
  const [open, setOpen] = useState(false);

  // States that match the edit.jsx fields
  const [code, setCode] = useState("");
  const [sdlName, setSdlName] = useState("");
  const [soc, setSoc] = useState("");
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [telephone, setTelephone] = useState("");
  const [province, setProvince] = useState("");
  const [commune, setCommune] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Add SDL:", {
      code,
      sdlName,
      soc,
      lastName,
      firstName,
      telephone,
      province,
      commune,
    });
    setOpen(false);
    // Optionnel: nettoyer le formulaire si besoin après fermeture
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="font-normal text-sm">
          <Plus className="mr-2 h-4 w-4" />
          Ajouter SDL
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] bg-sidebar">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Ajouter une Station de Lavage (SDL)</DialogTitle>
            <DialogDescription>
              Veuillez renseigner les informations de la nouvelle SDL.
            </DialogDescription>
          </DialogHeader>
          <div className="custom-scrollbar h-[60vh] lg:max-h-[500px] overflow-y-auto px-2 pb-3 mt-4">
            <div>
              <h5 className="mb-5 text-xl font-medium text-primary dark:text-white/90 lg:mb-6">
                Code SDL
              </h5>
              <Input
                type="text"
                placeholder="Ex: SDL_XXX"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
            <div className="mt-7">
              <h5 className="mb-5 text-xl font-medium text-primary dark:text-white/90 lg:mb-6">
                Informations SDL
              </h5>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div className="col-span-2 lg:col-span-1 space-y-2">
                  <Label>Nom SDL</Label>
                  <Input
                    type="text"
                    value={sdlName}
                    onChange={(e) => setSdlName(e.target.value)}
                  />
                </div>
                <div className="col-span-2 lg:col-span-1 space-y-2">
                  <Label>Société</Label>
                  <Input
                    type="text"
                    value={soc}
                    onChange={(e) => setSoc(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="mt-7">
              <h5 className="mb-5 text-xl font-medium text-primary dark:text-white/90 lg:mb-6">
                Informations Responsable
              </h5>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div className="col-span-2 lg:col-span-1 space-y-2">
                  <Label>Nom</Label>
                  <Input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
                <div className="col-span-2 lg:col-span-1 space-y-2">
                  <Label>Prénom</Label>
                  <Input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="col-span-2 lg:col-span-1 space-y-2">
                  <Label>Téléphone</Label>
                  <Input
                    type="text"
                    value={telephone}
                    onChange={(e) => setTelephone(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="mt-7">
              <h5 className="mb-5 text-xl font-medium text-primary dark:text-white/90 lg:mb-6">
                Localité
              </h5>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div className="col-span-2 lg:col-span-1 space-y-2">
                  <Label>Province</Label>
                  <Input
                    type="text"
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                  />
                </div>
                <div className="col-span-2 lg:col-span-1 space-y-2">
                  <Label>Commune</Label>
                  <Input
                    type="text"
                    value={commune}
                    onChange={(e) => setCommune(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline" type="button">Annuler</Button>
            </DialogClose>
            <Button type="submit">
              Enregistrer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
