"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scale, Users, Warehouse, MoreHorizontal } from "lucide-react";
import ViewImageDialog from "@/components/ui/view-image-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { fetchData } from "@/app/_utils/api";
const topQuantity = [
  { image: "/images/logo_1.jpg", name: "SDL Alpha", value: 50000, sub: "Kg" },
  { image: "/images/logo_2.jpg", name: "SDL Beta", value: 42000, sub: "Kg" },
  { image: "/images/logo_3.jpg", name: "SDL Gamma", value: 38000, sub: "Kg" },
  { image: "/images/logo_4.jpg", name: "SDL Delta", value: 35000, sub: "Kg" },
  { image: "/images/logo_5.jpg", name: "SDL Epsilon", value: 32000, sub: "Kg" },
];

const topMembers = [
  {
    image: "/images/logo_1.jpg",
    name: "SDL Alpha",
    value: 150,
    sub: "Membres",
  },
  { image: "/images/logo_2.jpg", name: "SDL Beta", value: 120, sub: "Membres" },
  {
    image: "/images/logo_3.jpg",
    name: "SDL Gamma",
    value: 115,
    sub: "Membres",
  },
  {
    image: "/images/logo_4.jpg",
    name: "SDL Delta",
    value: 100,
    sub: "Membres",
  },
  {
    image: "/images/logo_5.jpg",
    name: "SDL Epsilon",
    value: 95,
    sub: "Membres",
  },
];

const topCapacity = [
  { image: "/images/logo_1.jpg", name: "SDL Alpha", value: 100, sub: "Tonnes" },
  { image: "/images/logo_2.jpg", name: "SDL Beta", value: 80, sub: "Tonnes" },
  { image: "/images/logo_3.jpg", name: "SDL Gamma", value: 75, sub: "Tonnes" },
  { image: "/images/logo_4.jpg", name: "SDL Delta", value: 60, sub: "Tonnes" },
  {
    image: "/images/logo_5.jpg",
    name: "SDL Epsilon",
    value: 50,
    sub: "Tonnes",
  },
];

function TopListCard({ title, icon, data }) {
  // const [data, setData] = React.useState([]);
  // React.useEffect(() => {
  //   const getSdls = async () => {
  //     try {
  //       const response = await fetchData(
  //         "get",
  //         `cafe/stationslavage/get_active_and_non_active_sdl/`,
  //         {
  //           params: {},
  //           additionalHeaders: {},
  //           body: {},
  //         }
  //       );

  //       setData(response);
  //     } catch (error) {
  //       console.error("Error fetching cultivators data:", error);
  //     }
  //   };

  //   getSdls();
  // }, []);
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mt-2">
          {data.map((item, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* <ViewImageDialog imageUrl={item.image} /> */}
                <span className="text-sm font-medium leading-none">
                  {item.name}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                {item.value.toLocaleString()}{" "}
                <span className="text-xs">{item.sub}</span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <Link href={`/odeca-dashboard/sdl/profile/?id=${456}`}>
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                  </Link>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function SdlTopFiveCards() {
  const [datatopMembers, setDataTopMembers] = React.useState([]);
  const [datatopAchats, setDataTopAchats] = React.useState([]);
  React.useEffect(() => {
    const getSdls = async () => {
      try {
        const response = await fetchData(
          "get",
          `cafe/stationslavage/get_top_5_sdl_with_more_cultivators_ordered_by_count/`,
          {
            params: {},
            additionalHeaders: {},
            body: {},
          }
        );
        const topMembers = response.map((item) => ({
          image: "/images/logo_1.jpg",
          name: item?.collector__responsable_sdl__sdl__sdl_nom,
          value: item?.count,
          sub: "Membres",
        }));
        setDataTopMembers(topMembers);
      } catch (error) {
        console.error("Error fetching cultivators data:", error);
      }
    };
    const getTopAchats = async () => {
      try {
        const response = await fetchData(
          "get",
          `cafe/stationslavage/get_top_5_sdl_with_more_quantity_cerise_ordered_by_count/`,
          {
            params: {},
            additionalHeaders: {},
            body: {},
          }
        );
        const topAchats = response.map((item) => ({
          name: item?.responsable__responsable_ct__ct__ct_nom,
          value: item?.total_cerise,
          sub: "Kg",
        }));
        setDataTopAchats(topAchats);
      } catch (error) {
        console.error("Error fetching cultivators data:", error);
      }
    };

    getTopAchats();
    getSdls();
  }, []);
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <TopListCard
        title="Top 5 - Quantité Collectée"
        icon={<Scale className="h-4 w-4" />}
        data={datatopAchats}
      />
      <TopListCard
        title="Top 5 - Nombre de Membres"
        icon={<Users className="h-4 w-4" />}
        data={datatopMembers}
      />
      <TopListCard
        title="Top 5 - Capacité Stockage"
        icon={<Warehouse className="h-4 w-4" />}
        data={topCapacity}
      />
    </div>
  );
}
