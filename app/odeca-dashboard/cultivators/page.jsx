import React from "react";
import CultivatorData from "@/app/ui/dashboard/cultivators/list/cultivators_data";
import ProtectedRoute from "@/app/ui/protection/ProtectedRoute";
import { ROLES } from "@/lib/permissions";
function page() {
  return (

    <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.GENERAL]}>
      <CultivatorData />
    </ProtectedRoute>
  )
}

export default page;
