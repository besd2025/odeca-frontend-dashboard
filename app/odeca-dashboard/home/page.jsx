import DashboardContainer from "@/app/ui/dashboard/home";
import React from "react";
import ProtectedRoute from "@/app/ui/protection/ProtectedRoute";
import { ROLES } from "@/lib/permissions";
function page() {
  return (
    <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.GENERAL]}>
      <DashboardContainer />
    </ProtectedRoute>
  )
}

export default page;
