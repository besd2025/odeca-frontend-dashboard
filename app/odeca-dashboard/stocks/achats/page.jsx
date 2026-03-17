import React from "react";
import AchatsData from "@/app/ui/dashboard/stocks/achats/achats_data";
import ProtectedRoute from "@/app/ui/protection/ProtectedRoute";
import { ROLES } from "@/lib/permissions";
export default function page() {
  return (
    <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.GENERAL]}>
      <AchatsData />
    </ProtectedRoute>
  );
}
