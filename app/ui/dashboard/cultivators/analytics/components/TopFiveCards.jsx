"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sprout, Trees, Scale, MoreHorizontal } from "lucide-react";
import ViewImageDialog from "@/components/ui/view-image-dialog";
import { Button } from "@/components/ui/button";
import { fetchData } from "@/app/_utils/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

function TopListCard({ title, icon, data }) {
  console.log("data in TopListCard:", data);
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mt-2">
          {data.map((item, i) => (
            <div key={i} className="grid grid-cols-3">
              <div className="flex items-center gap-2 col-span-1">
                <ViewImageDialog imageUrl={item.image} />
                <span className="text-sm font-medium leading-none">
                  {item.name}
                </span>
              </div>
              <div className="flex items-center justify-center col-span-1">
                <div className="text-sm text-muted-foreground">
                  {item.value.toLocaleString()}{" "}
                  <span className="text-xs">{item.sub}</span>
                </div>
              </div>
              <div className="col-span-1 flex justify-end ">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <Link
                      href={`/odeca-dashboard/cultivators/profile/?id=${item.id}`}
                    >
                      <DropdownMenuItem>Profile</DropdownMenuItem>
                    </Link>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function TopFiveCards() {
  const [datatopChamps, setDataTopChamps] = React.useState([]);
  const [datatopPieds, setDataTopPieds] = React.useState([]);
  const [datatopQtes, setDataTopQtes] = React.useState([]);
  React.useEffect(() => {
    const getChamps = async () => {
      try {
        const response = await fetchData(
          "get",
          `cafe/stationslavage/get_top_5_clutivateurs_avec_beaucoup_de_champs_by_count/`,
          {
            params: {},
            additionalHeaders: {},
            body: {},
          }
        );
        const topChamps = response.map((item) => ({
          id: item?.cultivateur_champ__id,
          image:
            process.env.NEXT_PUBLIC_IMAGE_URL +
            item?.cultivateur_champ__cultivator_photo,
          name:
            item?.cultivateur_champ__cultivator_first_name +
            " " +
            item?.cultivateur_champ__cultivator_last_name,
          value: item?.champs,
          sub: "Champs",
        }));
        setDataTopChamps(topChamps);
      } catch (error) {
        console.error("Error fetching cultivators data:", error);
      }
    };
    const getTopPieds = async () => {
      try {
        const response = await fetchData(
          "get",
          `cafe/stationslavage/get_top_5_clutivateurs_avec_beaucoup_de_pieds_by_count/`,
          {
            params: {},
            additionalHeaders: {},
            body: {},
          }
        );
        const topPieds = response.map((item) => ({
          id: item?.cultivateur_champ__id,
          image:
            process.env.NEXT_PUBLIC_IMAGE_URL +
            item?.cultivateur_champ__cultivator_photo,
          name:
            item?.cultivateur_champ__cultivator_first_name +
            " " +
            item?.cultivateur_champ__cultivator_last_name,
          value: item?.pieds,
          sub: "Pieds",
        }));

        setDataTopPieds(topPieds);
      } catch (error) {
        console.error("Error fetching cultivators data:", error);
      }
    };
    const getTopQtes = async () => {
      try {
        const response = await fetchData(
          "get",
          `cafe/stationslavage/get_top_5_clutivateurs_avec_beaucoup_de_quantite_by_count/`,
          {
            params: {},
            additionalHeaders: {},
            body: {},
          }
        );
        const topQtes = response.map((item) => ({
          id: item?.cafeiculteur__id,
          image:
            process.env.NEXT_PUBLIC_IMAGE_URL +
            item?.cafeiculteur__cultivator_photo,
          name:
            item?.cafeiculteur__cultivator_last_name +
            " " +
            item?.cafeiculteur__cultivator_first_name,
          value: item?.total_cerise,
          sub: "Pieds",
        }));
        setDataTopQtes(topQtes);
      } catch (error) {
        console.error("Error fetching cultivators data:", error);
      }
    };
    getChamps();
    getTopPieds();
    getTopQtes();
  }, []);
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <TopListCard
        title="Top 5 - Nombre de Champs"
        icon={<Sprout className="h-4 w-4" />}
        data={datatopChamps}
      />
      <TopListCard
        title="Top 5 - Nombre de Pieds"
        icon={<Trees className="h-4 w-4" />}
        data={datatopPieds}
      />
      {/* <TopListCard
        title="Top 5 - Quantité Produite"
        icon={<Scale className="h-4 w-4" />}
        data={datatopQtes}
      /> */}
    </div>
  );
}
