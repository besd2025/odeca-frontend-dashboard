import CollectorsList from "@/app/ui/dashboard/collectors";
import { Edit } from "@/app/ui/dashboard/collectors/edit";
import React from "react";
import ProtectedRoute from "@/app/ui/protection/ProtectedRoute";
import { ROLES } from "@/lib/permissions";
export default function page() {
  return (
    <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
      <div className="p-4">
        {/* <Edit /> */}
        <CollectorsList />
      </div>
    </ProtectedRoute>
  );
}
