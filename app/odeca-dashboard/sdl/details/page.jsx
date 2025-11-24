import DetailsPage from "@/app/ui/dashboard/sdl/details/detailsPage";
import React from "react";

export default function page() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold m-2 absolute">
        Station de Lavage(SDL)
      </h1>
      <DetailsPage />
    </div>
  );
}
