import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { fetchData } from "@/app/_utils/api";
import {
  Grape,
  Layers,
  Layers2,
  MapPinHouse,
  Phone,
  QrCode,
} from "lucide-react";
import Link from "next/link";
import ViewImageDialog from "@/components/ui/view-image-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function ProfileCard({ cult_id }) {
  const [data, setData] = React.useState({});
  useEffect(() => {
    const getCultivators = async () => {
      try {
        const response = await fetchData("get", `/cultivators/${cult_id}/`, {
          params: {},
          additionalHeaders: {},
          body: {},
        });
        // const cultivatorsData = results.map((cultivator) => ({
        //   id: cultivator.id,
        //   cultivator: {
        //     cultivator_code: cultivator?.cultivator_code,
        //     first_name: cultivator?.cultivator_first_name,
        //     last_name: cultivator?.cultivator_last_name,
        //     image_url: cultivator?.cultivator_photo,
        //   },
        //   sdl_ct: "NGome",
        //   society: "ODECA",
        //   localite: {
        //     province: "Buja",
        //     commune: "Ntahangwa",
        //   },
        //   champs: 4,
        // }));

        setData(response);
        console.log("Cultivators data fetched:", response);
      } catch (error) {
        console.error("Error fetching cultivators data:", error);
      }
    };

    getCultivators();
  }, [cult_id]);

  return (
    <Card className="w-full lg:w-[300px] lg:max-w-sm p-6 space-y-4 rounded-xl shadow-sm">
      <div className="flex flex-col items-center space-y-3 text-center">
        <Avatar className="w-32 h-32 mx-auto">
          <AvatarImage
            src={data?.cultivator_photo}
            alt={data?.cultivator_first_name}
            className="object-cover hidden"
          />
          <ViewImageDialog
            imageUrl={data?.cultivator_photo}
            className="size-full object-cover"
          />
          {/* <AvatarFallback>
            {data?.cultivator_first_name
              .split(" ")
              .map((part) => part[0])
              .join("")
              .slice(0, 2)}
          </AvatarFallback> */}
        </Avatar>
        <div className="space-y-1 flex flex-col items-center gap-y-2">
          <p className="text-xl font-semibold">
            {data?.cultivator_first_name} {data?.cultivator_last_name}
          </p>
          <p className="text-sm text-muted-foreground flex flex-row gap-x-2">
            <Grape className="text-primary size-5" />
            {data?.cultivator_code}
          </p>
        </div>
        <Badge
          className="px-3 py-1 text-lg text-secondary rounded "
          variant="outline"
        >
          <QrCode size={30} />
          <span className="">{data?.cultivator_code}</span>
        </Badge>
      </div>

      {/* <Button className="w-full bg-black text-white hover:bg-black/90">
        Message
      </Button> */}

      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between text-sm flex-col gap-y-1">
            <span className="text-muted-foreground">CNI</span>
            <span className="font-medium">{data?.cultivator_cni}</span>
          </div>
          <Separator className="my-2" />
        </div>

        <div>
          <div className="flex items-center justify-between text-sm flex-col gap-y-1">
            <span className="text-muted-foreground">Date de Naissance</span>
            <span className="font-medium">{data?.date_naissance}</span>
          </div>
          <Separator className="my-2" />
        </div>

        <div>
          <div className="flex items-center justify-between text-sm ">
            <span className="text-muted-foreground">Sexe</span>
            <span className="font-medium">{data?.cultivator_gender}</span>
          </div>
          <Separator className="my-2" />
        </div>

        <div>
          <div className="flex items-center justify-between text-sm flex-col gap-y-1">
            <span className="text-muted-foreground flex gap-x-1">
              <MapPinHouse size={20} />
              Localité
            </span>
            <span className="font-medium text-right">
              {data?.cultivator_adress?.zone_code?.commune_code?.commune_name}/
              {data?.cultivator_adress?.zone_code?.zone_name}/
              {data?.cultivator_adress?.colline_name}
            </span>
          </div>
          <Separator className="my-2" />
        </div>

        <div>
          <div className="flex items-center justify-between text-sm ">
            <span className="text-muted-foreground flex gap-x-1">
              <Phone size={20} />
              Téléphone
            </span>
            <span className="font-medium">{data?.cultivator_telephone}</span>
          </div>
          <Separator className="my-2" />
        </div>
        <div>
          <div className="flex items-center justify-between text-sm ">
            <span className="text-muted-foreground flex gap-x-1">
              <Layers size={20} /> Champs
            </span>
            <span className="font-medium">2</span>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="link" className="p-0">
                  details
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Champs du cafeiculteur</DialogTitle>
                  <div className="mt-2 flex flex-col gap-y-2">
                    <div className="#Champ1 border rounded p-2">
                      <h1 className="flex gap-x-2 bg-primary w-max items-center py-1 px-2 rounded-lg text-primary-foreground">
                        <Layers2 size={20} /> Champ 1
                      </h1>
                      <div className="mt-2 flex flex-col gap-y-2">
                        <div className="flex items-center justify-between text-sm ">
                          <span className="text-muted-foreground">
                            Superficie
                          </span>
                          <span className="font-medium">7.5 ha</span>
                        </div>
                        <div className="flex items-center justify-between text-sm ">
                          <span className="text-muted-foreground">
                            Nombre de pieds
                          </span>
                          <span className="font-medium">400</span>
                        </div>
                        <div className="flex items-center justify-between text-sm ">
                          <span className="text-muted-foreground flex gap-x-1">
                            <MapPinHouse size={20} />
                            Localité
                          </span>
                          <span className="font-medium text-right">
                            bujumbura
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="#Champ2 border rounded p-2">
                      <h1 className="flex gap-x-2 bg-primary w-max items-center py-1 px-2 rounded-lg text-primary-foreground">
                        <Layers2 size={20} /> Champ 2
                      </h1>
                      <div className="mt-2 flex flex-col gap-y-2">
                        <div className="flex items-center justify-between text-sm ">
                          <span className="text-muted-foreground">
                            Superficie
                          </span>
                          <span className="font-medium">7.5 ha</span>
                        </div>
                        <div className="flex items-center justify-between text-sm ">
                          <span className="text-muted-foreground">
                            Nombre de pieds
                          </span>
                          <span className="font-medium">400</span>
                        </div>
                        <div className="flex items-center justify-between text-sm ">
                          <span className="text-muted-foreground flex gap-x-1">
                            <MapPinHouse size={20} />
                            Localité
                          </span>
                          <span className="font-medium text-right">
                            BUBANZA
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between text-sm ">
            <span className="text-muted-foreground">SDL / CT</span>
            <Link href="/odeca-dashboard/sdl/details">
              <Button variant="link" className="p-0">
                BUHANZA
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default ProfileCard;
