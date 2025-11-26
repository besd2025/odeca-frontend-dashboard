"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sprout, Trees, Scale, MoreHorizontal } from "lucide-react";
import ViewImageDialog from "@/components/ui/view-image-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

const topFields = [
  {
    image: "/images/logo_1.jpg",
    name: "Jean Dupont",
    value: 12,
    sub: "Champs",
  },
  {
    image: "/images/logo_2.jpg",
    name: "Marie Curie",
    value: 10,
    sub: "Champs",
  },
  { image: "/images/logo_3.jpg", name: "Paul Martin", value: 9, sub: "Champs" },
  {
    image: "/images/logo_4.jpg",
    name: "Alice Wonderland",
    value: 8,
    sub: "Champs",
  },
  { image: "/images/logo_5.jpg", name: "Bob Builder", value: 7, sub: "Champs" },
];

const topTrees = [
  {
    image: "/images/logo_1.jpg",
    name: "Jean Dupont",
    value: 1500,
    sub: "Pieds",
  },
  {
    image: "/images/logo_2.jpg",
    name: "Marie Curie",
    value: 1200,
    sub: "Pieds",
  },
  {
    image: "/images/logo_3.jpg",
    name: "Paul Martin",
    value: 1150,
    sub: "Pieds",
  },
  {
    image: "/images/logo_4.jpg",
    name: "Alice Wonderland",
    value: 1000,
    sub: "Pieds",
  },
  {
    image: "/images/logo_5.jpg",
    name: "Bob Builder",
    value: 950,
    sub: "Pieds",
  },
];

const topQuantity = [
  { image: "/images/logo_1.jpg", name: "Jean Dupont", value: 5000, sub: "Kg" },
  { image: "/images/logo_2.jpg", name: "Marie Curie", value: 4200, sub: "Kg" },
  { image: "/images/logo_3.jpg", name: "Paul Martin", value: 3800, sub: "Kg" },
  {
    image: "/images/logo_4.jpg",
    name: "Alice Wonderland",
    value: 3500,
    sub: "Kg",
  },
  { image: "/images/logo_5.jpg", name: "Bob Builder", value: 3200, sub: "Kg" },
];

function TopListCard({ title, icon, data }) {
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
                <ViewImageDialog imageUrl={item.image} />
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
                  <Link
                    href={`/odeca-dashboard/cultivators/profile/?id=${456}`}
                  >
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

export function TopFiveCards() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <TopListCard
        title="Top 5 - Nombre de Champs"
        icon={<Sprout className="h-4 w-4" />}
        data={topFields}
      />
      <TopListCard
        title="Top 5 - Nombre de Pieds"
        icon={<Trees className="h-4 w-4" />}
        data={topTrees}
      />
      <TopListCard
        title="Top 5 - Quantité Produite"
        icon={<Scale className="h-4 w-4" />}
        data={topQuantity}
      />
    </div>
  );
}
