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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Loader2 } from "lucide-react";
import { fetchData } from "@/app/_utils/api";
import { toast } from "sonner";

export default function AddCollector() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    cni: "",
    identifiant: "",
    password: "",
  });

  const [province, setProvince] = useState("");
  const [commune, setCommune] = useState("");
  const [zone, setZone] = useState("");
  const [colline, setColline] = useState("");
  const [ct, setCt] = useState("");

  // Options states
  const [provinceOptions, setProvinceOptions] = useState([]);
  const [communeOptions, setCommuneOptions] = useState([]);
  const [zoneOptions, setZoneOptions] = useState([]);
  const [collineOptions, setCollineOptions] = useState([]);
  const [ctOptions, setCtOptions] = useState([]);
  const [sdlOptions, setSdlOptions] = useState([]);
  const [sdl_ct, setSdl_ct] = useState("");
  const [sdl, setSdl] = useState("");
  // Load initial data (provinces)
  useEffect(() => {
    async function loadInitialData() {
      try {
        const provData = await fetchData("get", `adress/province/`, {
          params: { offset: 0, limit: 5 }
        });
        setProvinceOptions(provData?.results?.map(p => ({
          value: p.province_name,
          label: p.province_name
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
        value: c.colline_code,
        label: c.colline_name
      })) || []);
    } catch (err) {
      console.error("Error fetching collines:", err);
    }
  };

  const handleCollineChange = async (e) => {
    const value = e.target.value;
    setColline(value);
    setSdlOptions([]);

    if (!value) return;

    try {
      const data = await fetchData("get", `cafe/stationslavage/`, {
        params: { colline_name: value }
      });
      console.log("data", data)
      // cafe/stationslavage is paginated, so we use data.results
      setSdlOptions(data?.results?.map(s => ({
        value: s.sdl_code,
        label: s.sdl_nom
      })) || []);
    } catch (err) {
      console.error("Error fetching SDLs:", err);
    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSdlCtChange = (e) => {
    const { name, value } = e.target;
    setSdl_ct(value);
    if (value === "SDL") {
      setSdl(value);
      setCt("");
      setCtOptions([]);
    } else if (value === "CT") {
      setCt(value);
      setSdl("");
      setSdlOptions([]);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.first_name || !formData.last_name || !colline) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setLoading(true);
    const payload = {
      ...formData,
      adress_code: colline,
      ct_code: ct,
    };

    const promise = new Promise(async (resolve, reject) => {
      try {
        const results = await fetchData("post", `/cafe/responsable_registration/`, {
          body: payload,
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
      loading: "Ajout du collecteur...",
      success: () => {
        setTimeout(() => {
          setOpen(false);
          // window.location.reload(); 
        }, 1000);
        return `Le collecteur ${formData.first_name} ${formData.last_name} a été ajouté avec succès`;
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
          Ajouter Un Collecteur
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] bg-sidebar">
        <DialogHeader>
          <DialogTitle>Ajouter</DialogTitle>
          <DialogDescription>
            Ajoutez les informations d'un nouveau collecteur.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="custom-scrollbar h-[60vh] lg:max-h-[500px] overflow-y-auto px-2 pb-3 mt-4">
            {/* Identity Info */}
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

            {/* Locality Collector */}
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
                    {provinceOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
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
                    {communeOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
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
                    {zoneOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
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
                    {collineOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Locality LIEU DE TRAVAIL */}
            <div className="mt-7">
              <h5 className="mb-5 text-xl font-medium text-primary dark:text-white/90 lg:mb-6">
                Lieu de travail
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
                    {provinceOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
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
                    {communeOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
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
                    {zoneOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
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
                    {collineOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
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
                    {collineOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>SDL/CT</Label>
                  <select
                    value={sdl_ct}
                    onChange={handleSdlCtChange}
                    className="bg-card h-11 w-full rounded-lg border border-gray-300 px-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                  >
                    <option value="">Choisir une colline</option>
                    <option value="SDL">SDL</option>
                    <option value="CT">CT</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>SDL</Label>
                  <select
                    value={colline}
                    onChange={handleCollineChange}
                    disabled={!zone}
                    className="bg-card h-11 w-full rounded-lg border border-gray-300 px-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                  >
                    <option value="">Choisir une colline</option>
                    {sdlOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <div className="space-y-2">
                    <Label>CT</Label>
                    <select
                      value={colline}
                      onChange={handleCollineChange}
                      disabled={!zone}
                      className="bg-card h-11 w-full rounded-lg border border-gray-300 px-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                    >
                      <option value="">Choisir une colline</option>
                      {sdlOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Affiliation Section */}
            <div className="mt-7">
              <h5 className="mb-5 text-xl font-medium text-primary dark:text-white/90 lg:mb-6">
                Affiliation
              </h5>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div className="space-y-2">
                  <Label>Centre de Traitement (CT)</Label>
                  <select
                    value={ct}
                    onChange={(e) => setCt(e.target.value)}
                    disabled={!colline}
                    className="bg-card h-11 w-full rounded-lg border border-gray-300 px-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                  >
                    <option value="">Choisir un CT</option>
                    {ctOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button variant="outline" type="button" onClick={() => setOpen(false)}>
              Annuler
            </Button>
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
