"use client";
import React from "react";
import StatsCard from "./StatsCard";
import Edit from "../edit";
import DetailsCard from "./detailsCard";
import DetailsContent from "./details-content";
import { useSearchParams } from "next/navigation";
function DetailsPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const sdlDetails = {
    name: "AKEZA COFFEE",
    title: "SDL",

    location: "Bujumbura / Kamenge / Mirango",

    responsable: "JIMMY GWEGWEMBE",
    phone: "78451232",
  };

  return (
    <div className=" space-y-6">
      <div className="flex justify-end gap-2">
        <Edit id={id} />
      </div>
      <div className="flex flex-col lg:flex-row gap-6">
        <DetailsCard sdlDetails={sdlDetails} id={id} />

        <div className="flex-1 space-y-6">
          <section className="space-y-4">
            <StatsCard id={id} />
          </section>

          <DetailsContent id={id} />
        </div>
      </div>
    </div>
  );
}

export default DetailsPage;
