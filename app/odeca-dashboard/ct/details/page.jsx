import DetailsPage from "@/app/ui/dashboard/ct/details/detailsPage";
import React from "react";
export const dynamic = "force-dynamic";
export default function page() {
  return (
    <div className="p-4 relative">
      <h1 className="text-xl lg:text-2xl font-semibold mx-2 mb-4">
        Centre de Transite(CT)
      </h1>
      <DetailsPage />
    </div>
  );
}
