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
import { Plus, Loader2 } from "lucide-react";
import { fetchData } from "@/app/_utils/api";
import { toast } from "sonner";

export default function AddCt() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form states
  const [code, setCode] = useState("");
  const [ctName, setCtName] = useState("");
  const [soc, setSoc] = useState(""); // code_societe
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [telephone, setTelephone] = useState("");
  const [province, setProvince] = useState("");
  const [commune, setCommune] = useState("");
  const [zone, setZone] = useState("");
  const [colline, setColline] = useState("");
  const [collineCode, setCollineCode] = useState("");
  const [sdl, setSDL] = useState("");

  // Options states
  const [provinceOptions, setProvinceOptions] = useState([]);
  const [communeOptions, setCommuneOptions] = useState([]);
  const [zoneOptions, setZoneOptions] = useState([]);
  const [collineOptions, setCollineOptions] = useState([]);
  const [societeOptions, setSocieteOptions] = useState([]);
  const [sdlOptions, setSdlOptions] = useState([]);

  // Load initial data
  useEffect(() => {
    async function loadInitialData() {
      try {
        const [provData, socData] = await Promise.all([
          fetchData("get", `adress/province/`, { params: { offset: 0, limit: 5 } }),
          fetchData("get", `cafe/societes/`, { params: { offset: 0, limit: 150 } })
        ]);

        setProvinceOptions(provData?.results?.map(p => ({
          value: p.province_name,
          label: p.province_name
        })) || []);

        setSocieteOptions(socData?.results?.map(s => ({
          value: s.code_societe,
          label: s.nom_societe
        })) || []);
      } catch (err) {
        console.error("Error loading initial data:", err);
      }
    }
    if (open) {
      loadInitialData();
    }
  }, [open]);

  // Handlers for cascading address selects
  const handleProvinceChange = async (e) => {
    const value = e.target.value;
    setProvince(value);
    setCommune("");
    setZone("");
    setColline("");
    setCommuneOptions([]);
    setZoneOptions([]);
    setCollineOptions([]);

    if (!value) return;

    try {
      const data = await fetchData("get", `adress/commune/get_communes_by_province`, {
        params: { province: value }
      });
      setCommuneOptions(data?.map(c => ({
        value: c.commune_name,
        label: c.commune_name
      })) || []);
    } catch (err) {
      console.error("Error fetching communes:", err);
    }
  };

  const handleCommuneChange = async (e) => {
    const value = e.target.value;
    setCommune(value);
    setZone("");
    setColline("");
    setZoneOptions([]);
    setCollineOptions([]);

    if (!value) return;

    try {
      const data = await fetchData("get", `adress/zone/get_zones_by_commune/`, {
        params: { commune: value }
      });
      setZoneOptions(data?.map(z => ({
        value: z.zone_name,
        label: z.zone_name
      })) || []);
    } catch (err) {
      console.error("Error fetching zones:", err);
    }
  };

  const handleZoneChange = async (e) => {
    const value = e.target.value;
    setZone(value);
    setColline("");
    setCollineOptions([]);

    if (!value) return;

    try {
      const data = await fetchData("get", `adress/colline/get_collines_by_zone/`, {
        params: { zone: value }
      });
      setCollineOptions(data?.map(c => ({
        value: c.colline_name,
        code: c.colline_code,
        label: c.colline_name
      })) || []);
    } catch (err) {
      console.error("Error fetching collines:", err);
    }
  };

  const handleCollineChange = (e) => {
    const name = e.target.value;
    setColline(name);
    const selected = collineOptions.find(opt => opt.value === name);
    setCollineCode(selected?.code || "");
    setSDL(""); // Clear previous SDL selection
  };

  // Fetch SDLs whenever colline or societe changes
  useEffect(() => {
    async function fetchSDLs() {
      if (!colline || !soc) {
        setSdlOptions([]);
        return;
      }

      try {
        const data = await fetchData("get", `cafe/stationslavage/`, {
          params: { societe_code: soc, colline_name: colline }
        });

        setSdlOptions(data?.results?.map(s => ({
          value: s.sdl_code,
          label: s.sdl_nom
        })) || []);
      } catch (err) {
        console.error("Error fetching SDLs:", err);
      }
    }

    if (open) {
      fetchSDLs();
    }
  }, [colline, soc, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!code || !ctName || !soc || !colline) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setLoading(true);
    const formData = {
      ct_code: code,
      ct_nom: ctName,
      societe_code: soc,
      ct_adress_code: collineCode,
      sdl_code: sdl,
    };

    const promise = new Promise(async (resolve, reject) => {
      try {
        const results = await fetchData("post", `/cafe/centres_transite/`, {
          body: formData,
        });

        if (results.status === 200 || results.status === 201) {
          resolve(results);
        } else {
          reject(new Error("Erreur de l'ajout"));
        }
      } catch (err) {
        reject(err);
      }
    });

    toast.promise(promise, {
      loading: "Ajout du CT...",
      success: () => {
        setTimeout(() => {
          setOpen(false);
          // Reset states
          setProvince("");
          setCommune("");
          setZone("");
          setColline("");
          setCollineCode("");
          setCode("");
          setCtName("");
          setSoc("");
          setSDL("");
          setSdlOptions([]);
        }, 1000);
        return `CT ${ctName} a été ajouté avec succès`;
      },
      error: (err) => err.message || "Donnée non ajoutée",
    });

    try {
      await promise;
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="font-normal text-sm">
          <Plus className="mr-2 h-4 w-4" />
          Ajouter CT
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] bg-sidebar">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Ajouter un Centre de Traitement (CT)</DialogTitle>
            <DialogDescription>
              Veuillez renseigner les informations du nouveau CT.
            </DialogDescription>
          </DialogHeader>
          <div className="custom-scrollbar h-[60vh] lg:max-h-[500px] overflow-y-auto px-2 pb-3 mt-4">
            {/* Code Section */}
            <div>
              <h5 className="mb-5 text-xl font-medium text-primary dark:text-white/90 lg:mb-6">
                Code CT
              </h5>
              <Input
                type="text"
                placeholder="Ex: CT_XXX"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>

            {/* CT Info Section */}
            <div className="mt-7">
              <h5 className="mb-5 text-xl font-medium text-primary dark:text-white/90 lg:mb-6">
                Informations CT
              </h5>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div className="space-y-2">
                  <Label>Nom CT</Label>
                  <Input
                    type="text"
                    value={ctName}
                    onChange={(e) => setCtName(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Responsable Info Section (Commented out matching SDL) */}
            {/* <div className="mt-7">
              <h5 className="mb-5 text-xl font-medium text-primary dark:text-white/90 lg:mb-6">
                Informations Responsable
              </h5>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div className="space-y-2">
                  <Label>Nom</Label>
                  <Input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Prénom</Label>
                  <Input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="col-span-2 lg:col-span-1 space-y-2">
                  <Label>Téléphone</Label>
                  <Input
                    type="text"
                    value={telephone}
                    onChange={(e) => setTelephone(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div> */}

            {/* Locality Section */}
            <div className="mt-7">
              <h5 className="mb-5 text-xl font-medium text-primary dark:text-white/90 lg:mb-6">
                Localité
              </h5>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div className="space-y-2">
                  <Label>Province</Label>
                  <select
                    value={province}
                    onChange={handleProvinceChange}
                    className="bg-card h-11 w-full rounded-lg border border-gray-300 px-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">Choisir une province</option>
                    {provinceOptions.map((opt, index) => (
                      <option key={`${opt.value}-${index}`} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Commune</Label>
                  <select
                    value={commune}
                    onChange={handleCommuneChange}
                    disabled={!province}
                    className="bg-card h-11 w-full rounded-lg border border-gray-300 px-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                  >
                    <option value="">Choisir une commune</option>
                    {communeOptions.map((opt, index) => (
                      <option key={`${opt.value}-${index}`} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2 mt-5">
                <div className="space-y-2">
                  <Label>Zone</Label>
                  <select
                    value={zone}
                    onChange={handleZoneChange}
                    disabled={!commune}
                    className="bg-card h-11 w-full rounded-lg border border-gray-300 px-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                  >
                    <option value="">Choisir une zone</option>
                    {zoneOptions.map((opt, index) => (
                      <option key={`${opt.value}-${index}`} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Colline</Label>
                  <select
                    value={colline}
                    onChange={handleCollineChange}
                    disabled={!zone}
                    className="bg-card h-11 w-full rounded-lg border border-gray-300 px-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                  >
                    <option value="">Choisir une colline</option>
                    {collineOptions.map((opt, index) => (
                      <option key={`${opt.value}-${index}`} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* SDL Info Section */}
            <div className="mt-7">
              <h5 className="mb-5 text-xl font-medium text-primary dark:text-white/90 lg:mb-6">
                Informations SDL de destination
              </h5>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div className="space-y-2">
                  <Label>Société</Label>
                  <select
                    value={soc}
                    onChange={(e) => setSoc(e.target.value)}
                    className="bg-card h-11 w-full rounded-lg border border-gray-300 px-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">Choisir une société</option>
                    {societeOptions.map((opt, index) => (
                      <option key={`${opt.value}-${index}`} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>SDL DE DESTINATION</Label>
                  <select
                    value={sdl}
                    onChange={(e) => setSDL(e.target.value)}
                    className="bg-card h-11 w-full rounded-lg border border-gray-300 px-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">Choisir une SDL</option>
                    {sdlOptions?.map((opt, index) => (
                      <option key={`${opt.value}-${index}`} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline" type="button">Annuler</Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Enregistrer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
