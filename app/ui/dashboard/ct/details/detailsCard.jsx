"use client";
import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { fetchData } from "@/app/_utils/api";
import {
  Grape,
  MapPinHouse,
  Phone,
  QrCode,
  ShieldUser,
  User,
} from "lucide-react";

function DetailsCard({ id }) {
  const [data, setData] = React.useState([]);
  React.useEffect(() => {
    const getSdls = async () => {
      try {
        const response = await fetchData(
          "get",
          `cafe/centres_transite/${id}/`,
          {
            params: {},
            additionalHeaders: {},
            body: {},
          }
        );

        setData(response);
      } catch (error) {
        console.error("Error fetching cultivators data:", error);
      }
    };

    getSdls();
  }, [id]);

  return (
    <Card className="w-full lg:w-[300px] lg:max-w-sm p-6 space-y-4 rounded-xl shadow-sm">
      <div className="flex flex-col items-center space-y-3 text-center">
        <div className="w-32 h-32 mx-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-full text-accent-foreground/80"
          >
            <path
              fillRule="evenodd"
              d="M3 2.25a.75.75 0 0 0 0 1.5v16.5h-.75a.75.75 0 0 0 0 1.5H15v-18a.75.75 0 0 0 0-1.5H3ZM6.75 19.5v-2.25a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-.75.75h-3a.75.75 0 0 1-.75-.75ZM6 6.75A.75.75 0 0 1 6.75 6h.75a.75.75 0 0 1 0 1.5h-.75A.75.75 0 0 1 6 6.75ZM6.75 9a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75ZM6 12.75a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 0 1.5h-.75a.75.75 0 0 1-.75-.75ZM10.5 6a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75Zm-.75 3.75A.75.75 0 0 1 10.5 9h.75a.75.75 0 0 1 0 1.5h-.75a.75.75 0 0 1-.75-.75ZM10.5 12a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75ZM16.5 6.75v15h5.25a.75.75 0 0 0 0-1.5H21v-12a.75.75 0 0 0 0-1.5h-4.5Zm1.5 4.5a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Zm.75 2.25a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75v-.008a.75.75 0 0 0-.75-.75h-.008ZM18 17.25a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="space-y-1">
          <p className="text-xl font-semibold">{data?.ct_nom}</p>
          <p className="text-lg text-primary font-bold flex flex-row justify-center gap-x-2">
            {""}
          </p>
        </div>
        <Badge
          className="px-3 py-1 text-lg text-secondary rounded "
          variant="outline"
        >
          <QrCode size={30} />
          <span className="">{data?.ct_code}</span>
        </Badge>
      </div>

      {/* <Button className="w-full bg-black text-white hover:bg-black/90">
        Message
      </Button> */}

      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between text-sm flex-col gap-y-1">
            <span className="text-muted-foreground flex gap-x-1">
              <MapPinHouse size={20} />
              Localité
            </span>
            <span className="font-medium text-right">
              {
                data?.ct_adress?.zone_code?.commune_code?.province_code
                  ?.province_name
              }
              / {data?.ct_adress?.zone_code?.commune_code?.commune_name}
            </span>
          </div>
          <Separator className="my-2" />
        </div>
        <div>
          <div className="flex items-center justify-between text-sm flex-col gap-y-1">
            <span className="text-secondary flex gap-x-1">
              <ShieldUser size={20} />
              Responsable
            </span>
            <span className="font-medium text-right">
              {data?.responsable?.first_name} {data?.responsable?.last_name}
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
            <span className="font-medium">{data?.responsable?.telephone}</span>
          </div>
          <Separator className="my-2" />
        </div>
      </div>
    </Card>
  );
}

export default DetailsCard;
