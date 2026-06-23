import React from 'react'
import EchantillonnagePage from '@/app/ui/production/echantillonnage'
import ProtectedRoute from "@/app/ui/protection/ProtectedRoute";
import { ROLES } from '@/lib/permissions'
export default function page() {
  return (
    <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.GENERAL, ROLES.UDP]}>
      <EchantillonnagePage />
    </ProtectedRoute>
  )
}
