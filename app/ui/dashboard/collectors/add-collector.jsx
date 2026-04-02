"use client";
import React, { useEffect, useState } from "react";
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
import { fetchData } from "@/app/_utils/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";



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

  const [province, setProvince] = useState("");
  const [commune, setCommune] = useState("");
  const [zone, setZone] = useState("");
  const [colline, setColline] = useState("");

  const [provinceOptions, setProvinceOptions] = useState([]);
  const [communeOptions, setCommuneOptions] = useState([]);
  const [zoneOptions, setZoneOptions] = useState([]);
  const [collineOptions, setCollineOptions] = useState([]);
  const [error, setError] = useState(null);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalData = {
      ...formData,
      province,
      commune,
      zone,
      colline
    };
    console.log("Add Collector Data:", finalData);
    setOpen(false);
    setFormData({
      first_name: "",
      last_name: "",
      phone: "",
      cni: "",
      identifiant: "",
      password: "",
    });
    setProvince("");
    setCommune("");
    setZone("");
    setColline("");
  };

  useEffect(() => {
    async function loadProvinces() {
      try {
        const data = await fetchData("get", `adress/province/`, {
          params: { offset: 0, limit: 100 },
        });
        const options = data?.results?.map((item) => ({
          value: item.province_name,
          label: item.province_name,
        })) || [];
        setProvinceOptions(options);
      } catch (error) {
        setError(error);
        console.error("Error loading provinces:", error);
      }
    }
    loadProvinces();
  }, []);

  // Handle province change
  const handleProvinceChange = async (value) => {
    setProvince(value);

    if (!value) {
      setCommuneOptions([]);
      setCommune("");
      setZoneOptions([]);
      setZone("");
      setCollineOptions([]);
      setColline("");
      return;
    }

    try {
      const data = await fetchData(
        "get",
        `adress/commune/get_communes_by_province`,
        { params: { province: value } }
      );
      const options = data?.map((item) => ({
        value: item.commune_name,
        label: item.commune_name,
      })) || [];
      setCommuneOptions(options);
      setCommune("");
      setZoneOptions([]);
      setZone("");
      setCollineOptions([]);
      setColline("");
    } catch (error) {
      console.error("Error loading communes:", error);
    }
  };

  // Handle commune change
  const handleCommuneChange = async (value) => {
    setCommune(value);

    if (!value) {
      setZoneOptions([]);
      setZone("");
      setCollineOptions([]);
      setColline("");
      return;
    }

    try {
      const data = await fetchData("get", `adress/zone/get_zones_by_commune/`, {
        params: { commune: value },
      });
      const options = data?.map((item) => ({
        value: item.zone_name,
        label: item.zone_name,
      })) || [];
      setZoneOptions(options);
      setZone("");
      setCollineOptions([]);
      setColline("");
    } catch (error) {
      console.error("Error loading zones:", error);
    }
  };


  // Handle zone change
  const handleZoneChange = async (value) => {
    setZone(value);

    if (!value) {
      setCollineOptions([]);
      setColline("");
      return;
    }

    try {
      const data = await fetchData("get", `adress/colline/get_collines_by_zone/`, {
        params: { zone: value },
      });
      const options = data?.map((item) => ({
        value: item.colline_code,
        label: item.colline_name,
      })) || [];
      setCollineOptions(options);
      setColline("");
    } catch (error) {
      console.error("Error loading collines:", error);
    }
  };

  const handleCollineChange = (value) => {
    setColline(value);
  };



  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="font-normal text-sm w-full bg-transparent border-none" variant="outline">
          <Workflow />
          <span>Affecter</span>
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[600px] bg-sidebar"
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
      >

        <DialogHeader>
          <DialogTitle>Ajouter</DialogTitle>
          <DialogDescription>
            Ajoutez les informations d'un nouveau collecteur.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="h-[60vh] overflow-y-auto max-h-[90vh]">
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
          <div className="my-2">
            <h5 className="mb-5 text-xl font-medium text-primary dark:text-white/90 lg:mb-6">
              Localité
            </h5>
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              <div className="col-span-2 lg:col-span-1 space-y-2">
                <Label>Province</Label>
                <Select value={province} onValueChange={handleProvinceChange}>
                  <SelectTrigger className="w-full bg-background">
                    <SelectValue placeholder="Sélectionner une province" />
                  </SelectTrigger>
                  <SelectContent>
                    {provinceOptions.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 lg:col-span-1 space-y-2">
                <Label>Commune</Label>
                <Select
                  value={commune}
                  onValueChange={handleCommuneChange}
                  disabled={!province}
                >
                  <SelectTrigger className="w-full bg-background">
                    <SelectValue placeholder="Sélectionner une commune" />
                  </SelectTrigger>
                  <SelectContent>
                    {communeOptions.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 lg:col-span-1 space-y-2">
                <Label>Zone</Label>
                <Select
                  value={zone}
                  onValueChange={handleZoneChange}
                  disabled={!commune}
                >
                  <SelectTrigger className="w-full bg-background">
                    <SelectValue placeholder="Sélectionner une zone" />
                  </SelectTrigger>
                  <SelectContent>
                    {zoneOptions.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 lg:col-span-1 space-y-2">
                <Label>Colline</Label>
                <Select
                  value={colline}
                  onValueChange={handleCollineChange}
                  disabled={!zone}
                >
                  <SelectTrigger className="w-full bg-background">
                    <SelectValue placeholder="Sélectionner une colline" />
                  </SelectTrigger>
                  <SelectContent>
                    {collineOptions.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

            </div>
          </div>
        </form>
        <DialogFooter>
          <Button variant="outline" type="button" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button type="submit">
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
