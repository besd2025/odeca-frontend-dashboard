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
import { SquarePen } from "lucide-react";
import { fetchData } from "@/app/_utils/api";
export default function Edit({
  cultivator,
  sdl_ct = "",
  society = "",
  localite = {},
  champs = 0,
}) {
  // local state initialized from props
  const [open, setOpen] = React.useState(false);
  const [code, setCode] = React.useState(cultivator.cultivator_code || "");
  const [firstName, setFirstName] = React.useState(cultivator.first_name || "");
  const [lastName, setLastName] = React.useState(cultivator.last_name || "");
  const [imageUrl, setImageUrl] = React.useState(cultivator.image_url || "");
  const [sdl, setSdl] = React.useState(sdl_ct || "");
  const [soc, setSoc] = React.useState(society || "");
  const [province, setProvince] = React.useState(localite?.province || "");
  const [commune, setCommune] = React.useState(localite?.commune || "");
  const [nbChamps, setNbChamps] = React.useState(champs || 0);
  const [date_naissance, setDateNaissance] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [cni, setCni] = React.useState("");
  const [payment_mode, setPaymentMode] = React.useState("");
  const [bank_name, setBankName] = React.useState("");
  const [bank_account, setBankAccount] = React.useState("");
  const [payment_phone, setPaymentPhone] = React.useState("");
  const [proprietaire, setProprietaire] = React.useState("");
  React.useEffect(() => {
    async function getData() {
      // keep local state in sync if props change

      try {
        const response = await fetchData("get", `/cultivators/${cultivator}/`, {
          params: {},
          additionalHeaders: {},
          body: {},
        });
        console.log("Fetched cultivator data in Edit useEffect:", response);
        setCode(response.cultivator_code || "");
        setFirstName(response?.cultivator_first_name || "");
        setLastName(response?.cultivator_last_name || "");
        setImageUrl(response?.cultivator_photo || "");
        setDateNaissance(response?.date_naissance || "");
        setPhone(response?.cultivator_telephone || "");
        setCni(response?.cultivator_cni || "");
        setSdl(sdl_ct || "");
        setSoc(society || "");
        setProvince(localite?.province || "");
        setCommune(localite?.commune || "");
        setNbChamps(champs || 0);
        setPaymentMode(response?.cultivator_payment_type || "");
        setBankName(response?.cultivator_bank_name || "");
        setBankAccount(response?.cultivator_bank_account || "");
        setPaymentPhone(response?.cultivator_mobile_payment_account || "");
        setProprietaire(response?.cultivator_account_owner || "");
      } catch (error) {
        console.error("Error in Edit useEffect:", error);
      }
    }
    getData();
  }, [cultivator, sdl_ct, society, localite, champs]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: call API / lift state to parent. For now just log values.
    const payload = {
      cultivator_code: code,
      first_name: firstName,
      last_name: lastName,
      image_url: imageUrl,
      sdl_ct: sdl,
      society: soc,
      localite: { province, commune },
      champs: nbChamps,
    };
    // For now output to console; caller can replace with API call
    // eslint-disable-next-line no-console
    console.log("Submitting cultivator update", payload);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form onSubmit={handleSubmit}>
        <DialogTrigger asChild>
          <Button variant="secondary">
            <SquarePen />
            Modifier
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[700px] bg-sidebar">
          <DialogHeader>
            <DialogTitle>Modification</DialogTitle>
            <DialogDescription>Modifier les informations</DialogDescription>
          </DialogHeader>
          <div className="custom-scrollbar h-[60vh] lg:max-h-[500px] overflow-y-auto px-2 pb-3">
            <div>
              <h5 className="mb-5 text-xl font-medium text-primary dark:text-white/90 lg:mb-6">
                Code cultivateur
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
                Informations personnelles
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
                  <Label>CNI</Label>
                  <Input
                    type="text"
                    value={cni}
                    onChange={(e) => setCni(e.target.value)}
                  />
                </div>
                <div className="col-span-2 lg:col-span-1 space-y-2">
                  <Label>Date de naissance</Label>
                  <Input
                    type="text"
                    value={date_naissance}
                    onChange={(e) => setDateNaissance(e.target.value)}
                  />
                </div>
                <div className="col-span-2 lg:col-span-1 space-y-2">
                  <Label>Telephone</Label>
                  <Input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="col-span-2 lg:col-span-1 space-y-2">
                  <Label>SDL/CT</Label>
                  <Input
                    type="text"
                    value={sdl}
                    onChange={(e) => setSdl(e.target.value)}
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
                Localite
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
            <div className="mt-7">
              <h5 className="mb-5 text-xl font-medium text-primary dark:text-white/90 lg:mb-6">
                Informations du champs
              </h5>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div className="col-span-2 lg:col-span-1 space-y-2">
                  <Label>Nombre de champs</Label>
                  <Input
                    type="number"
                    value={nbChamps}
                    onChange={(e) => setNbChamps(Number(e.target.value))}
                  />
                </div>
                <div className="col-span-2 lg:col-span-1 space-y-2">
                  <Label>Nombre de pieds</Label>
                  <Input
                    type="number"
                    value={nbChamps}
                    onChange={(e) => setNbChamps(Number(e.target.value))}
                  />
                </div>
                <div className="col-span-2 lg:col-span-1 space-y-2">
                  <Label>Superficie</Label>
                  <Input
                    type="number"
                    value={nbChamps}
                    onChange={(e) => setNbChamps(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
            <div className="mt-7">
              <h5 className="mb-5 text-xl font-medium text-primary dark:text-white/90 lg:mb-6">
                Information de paiement
              </h5>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div className="col-span-2 lg:col-span-1 space-y-2">
                  <Label>Mode de paiement</Label>
                  <Input
                    type="text"
                    value={payment_mode}
                    onChange={(e) => setPaymentMode(e.target.value)}
                  />
                </div>
                <div className="col-span-2 lg:col-span-1 space-y-2">
                  <Label>Nom de Banque</Label>
                  <Input
                    type="text"
                    value={bank_name}
                    onChange={(e) => setBankName(e.target.value)}
                  />
                </div>
                <div className="col-span-2 lg:col-span-1 space-y-2">
                  <Label>No compte bancaire</Label>
                  <Input
                    type="text"
                    value={bank_account}
                    onChange={(e) => setBankAccount(e.target.value)}
                  />
                </div>
                <div className="col-span-2 lg:col-span-1 space-y-2">
                  <Label>No de Tel de paiement</Label>
                  <Input
                    type="text"
                    value={payment_phone}
                    onChange={(e) => setPaymentPhone(e.target.value)}
                  />
                </div>
                <div className="col-span-2 lg:col-span-1 space-y-2">
                  <Label>Proprietaire</Label>
                  <Input
                    type="text"
                    value={proprietaire}
                    onChange={(e) => setProprietaire(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Annuler</Button>
            </DialogClose>
            <Button type="submit">Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
