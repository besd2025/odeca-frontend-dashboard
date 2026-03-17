import ExportPayment from "@/app/ui/dashboard/payments/export_payment";
import React from "react";
import ProtectedRoute from "@/app/ui/protection/ProtectedRoute";
import { ROLES } from "@/lib/permissions";
export default function page() {
  return (
    <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.GENERAL, ROLES.ODECA, ROLES.SOCIETE]}>
      <ExportPayment />
    </ProtectedRoute>
  )
}
