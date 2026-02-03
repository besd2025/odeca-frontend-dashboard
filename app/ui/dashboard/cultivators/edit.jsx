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
import { SquarePen, Loader2 } from "lucide-react";
import { fetchData } from "@/app/_utils/api";
import { toast } from "sonner";
export default function Edit({
  cultivator,
  sdl_ct = "",
  society = "",
  localite = {},
  champs = 0,
}) {
  // local state initialized from props
  const [open, setOpen] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [imageUrl, setImageUrl] = React.useState("");
  const [sdl, setSdl] = React.useState("");
  const [soc, setSoc] = React.useState("");
  const [province, setProvince] = React.useState("");
  const [commune, setCommune] = React.useState("");
  const [nbChamps, setNbChamps] = React.useState(0);
  const [date_naissance, setDateNaissance] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [cni, setCni] = React.useState("");
  const [payment_mode, setPaymentMode] = React.useState("");
  const [bank_name, setBankName] = React.useState("");
  const [bank_account, setBankAccount] = React.useState("");
  const [payment_phone, setPaymentPhone] = React.useState("");
  const [proprietaire, setProprietaire] = React.useState("");
  const [collector_code, setCollectorCode] = React.useState("");
  const [address_code, setAdressCode] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => {
    async function getData() {
      // keep local state in sync if props change

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
        setProvince(localite?.province || "");
        setCommune(localite?.commune || "");
        setNbChamps(champs || 0);
        setPaymentMode(response?.cultivator_payment_type || "");
        setBankName(response?.cultivator_bank_name || "");
        setBankAccount(response?.cultivator_bank_account || "");
        setPaymentPhone(response?.cultivator_mobile_payment_account || "");
        setProprietaire(response?.cultivator_account_owner || "");
        setCollectorCode(response?.collector?.unique_code || "");
        setAdressCode(response?.cultivator_adress?.colline_code);
      } catch (error) {
        console.error("Error in Edit useEffect:", error);
      }
    }
    getData();
  }, [cultivator]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      cultivator_code: code,
      cultivator_first_name: firstName,
      cultivator_last_name: lastName,
      cultivator_cni: cni,
      date_naissance: date_naissance,
      cultivator_payment_type: payment_mode,
      cultivator_bank_name: bank_name,
      cultivator_bank_account: bank_account,
      cultivator_mobile_payment_account: payment_phone,
      cultivator_account_owner: proprietaire,
      cultivator_bank_name: bank_name,
      cultivator_mobile_payment: payment_phone,
      cultivator_mobile_payment_user_name: proprietaire,
      cultivator_adress_code: address_code,
      collector_code: collector_code,
    };

    setLoading(true);

    const promise = new Promise(async (resolve, reject) => {
      try {
        const results = await fetchData(
          "patch",
          `/cultivators/${cultivator}/`,
          {
            params: {},
            additionalHeaders: {},
            body: formData,
          },
        );
        if (results.status == 200) {
          resolve({ code });
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
        setTimeout(() => window.location.reload(), 1000);
        return `${data.code} a été modifié avec succès `;
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
            <Button type="submit" onClick={handleSubmit} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
