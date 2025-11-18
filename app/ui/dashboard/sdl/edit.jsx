"use client";
import React from "react";
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

export default function Edit({
  sdl = {},
  responsable = {},
  society = "",
  localite = {},
}) {
  // local state initialized from props
  const [open, setOpen] = React.useState(false);
  const [code, setCode] = React.useState(sdl.sdl_code || "");
  const [sdlName, setSdlName] = React.useState(sdl.sdl_name || "");
  const [type, setType] = React.useState(sdl.type || "");
  const [firstName, setFirstName] = React.useState(
    responsable?.first_name || ""
  );
  const [lastName, setLastName] = React.useState(responsable?.last_name || "");
  const [telephone, setTelephone] = React.useState(
    responsable?.telephone || ""
  );
  const [soc, setSoc] = React.useState(society || "");
  const [province, setProvince] = React.useState(localite?.province || "");
  const [commune, setCommune] = React.useState(localite?.commune || "");

  React.useEffect(() => {
    // keep local state in sync if props change
    setCode(sdl.sdl_code || "");
    setSdlName(sdl.sdl_name || "");
    setType(sdl.type || "");
    setFirstName(responsable?.first_name || "");
    setLastName(responsable?.last_name || "");
    setTelephone(responsable?.telephone || "");
    setSoc(society || "");
    setProvince(localite?.province || "");
    setCommune(localite?.commune || "");
  }, [sdl, responsable, society, localite]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: call API / lift state to parent. For now just log values.
    const payload = {
      sdl_code: code,
      sdl_name: sdlName,
      type: type,
      responsable: {
        first_name: firstName,
        last_name: lastName,
        telephone: telephone,
      },
      society: soc,
      localite: { province, commune },
    };
    // For now output to console; caller can replace with API call
    // eslint-disable-next-line no-console
    console.log("Submitting SDL update", payload);
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
                Code SDL
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
                  <Label>Type</Label>
                  <Input
                    type="text"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
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
