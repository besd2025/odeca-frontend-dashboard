import React from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Grape, QrCode } from "lucide-react";
import Link from "next/link";
import ViewImageDialog from "@/components/ui/view-image-dialog";

function ProfileCard({ profile }) {
  return (
    <Card className="w-full max-w-sm p-6 space-y-4 rounded-xl shadow-sm">
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
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">CNI</span>
            <span className="font-medium">{profile.cni}</span>
          </div>
          <Separator className="my-2" />
        </div>

        <div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Date de Naissance</span>
            <span className="font-medium">{profile.birthDate}</span>
          </div>
          <Separator className="my-2" />
        </div>

        <div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Sexe</span>
            <span className="font-medium">{profile.gender}</span>
          </div>
          <Separator className="my-2" />
        </div>

        <div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Localité</span>
            <span className="font-medium text-right">{profile.location}</span>
          </div>
          <Separator className="my-2" />
        </div>

        <div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Téléphone</span>
            <span className="font-medium">{profile.phone}</span>
          </div>
          <Separator className="my-2" />
        </div>
        <div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Champs</span>
            <span className="font-medium">{profile.champs}</span>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">SDL / CT</span>
            <Link href="linktoSDL/CT">
              <Button variant="link">{profile.sdl}</Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default ProfileCard;
