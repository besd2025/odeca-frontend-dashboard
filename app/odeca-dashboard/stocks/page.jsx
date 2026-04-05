import React from 'react'
import StockAnalytics from '@/app/ui/dashboard/stocks/analytics'
import ProtectedRoute from "@/app/ui/protection/ProtectedRoute";
import { ROLES } from "@/lib/permissions";
export default function page() {
  return (
    <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.GENERAL, ROLES.ODECA, ROLES.SOCIETE, ROLES.SUPERVISEUR_REGIONAL]}>
      <StockAnalytics />
    </ProtectedRoute>
  )
}
