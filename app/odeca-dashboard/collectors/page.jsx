import CollectorsList from "@/app/ui/dashboard/collectors";
import { Edit } from "@/app/ui/dashboard/collectors/edit";
import React from "react";

export default function page() {
  return (
    <div className="p-4">
      {/* <Edit /> */}
      <CollectorsList />
    </div>
  );
}
