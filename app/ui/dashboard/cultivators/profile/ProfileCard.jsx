import React from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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

function ProfileCard({ profile }) {
  return (
    <Card className="w-full lg:w-[300px] lg:max-w-sm p-6 space-y-4 rounded-xl shadow-sm">
      <div className="flex flex-col items-center space-y-3 text-center">
        <Avatar className="w-32 h-32 mx-auto">
          <AvatarImage
            src={profile.avatar}
            alt={profile.name}
            className="object-cover hidden"
          />
          <ViewImageDialog
            imageUrl={profile.avatar}
            className="size-full object-cover"
          />
          <AvatarFallback>
            {profile.name
              .split(" ")
              .map((part) => part[0])
              .join("")
              .slice(0, 2)}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <p className="text-xl font-semibold">{profile.name}</p>
          <p className="text-sm text-muted-foreground flex flex-row gap-x-2">
            <Grape className="text-primary size-5" />
            {profile.title}
          </p>
        </div>
        <Badge
          className="px-3 py-1 text-lg text-secondary rounded "
          variant="outline"
        >
          <QrCode size={30} />
          <span className="">215-525-644</span>
        </Badge>
      </div>

      {/* <Button className="w-full bg-black text-white hover:bg-black/90">
        Message
      </Button> */}

      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between text-sm flex-col gap-y-1">
            <span className="text-muted-foreground">CNI</span>
            <span className="font-medium">{profile.cni}</span>
          </div>
          <Separator className="my-2" />
        </div>

        <div>
          <div className="flex items-center justify-between text-sm flex-col gap-y-1">
            <span className="text-muted-foreground">Date de Naissance</span>
            <span className="font-medium">{profile.birthDate}</span>
          </div>
          <Separator className="my-2" />
        </div>

        <div>
          <div className="flex items-center justify-between text-sm ">
            <span className="text-muted-foreground">Sexe</span>
            <span className="font-medium">{profile.gender}</span>
          </div>
          <Separator className="my-2" />
        </div>

        <div>
          <div className="flex items-center justify-between text-sm flex-col gap-y-1">
            <span className="text-muted-foreground flex gap-x-1">
              <MapPinHouse size={20} />
              Localité
            </span>
            <span className="font-medium text-right">{profile.location}</span>
          </div>
          <Separator className="my-2" />
        </div>

        <div>
          <div className="flex items-center justify-between text-sm ">
            <span className="text-muted-foreground flex gap-x-1">
              <Phone size={20} />
              Téléphone
            </span>
            <span className="font-medium">{profile.phone}</span>
          </div>
          <Separator className="my-2" />
        </div>
        <div>
          <div className="flex items-center justify-between text-sm ">
            <span className="text-muted-foreground flex gap-x-1">
              <Layers size={20} /> Champs
            </span>
            <span className="font-medium">{profile.champs}</span>

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
                            {profile.location}
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
                            {profile.location}
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
                {profile.sdl}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default ProfileCard;
