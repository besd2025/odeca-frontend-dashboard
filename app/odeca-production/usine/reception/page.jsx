import React from 'react'
import ReceptionPage from '@/app/ui/production/reception'
import ProtectedRoute from "@/app/ui/protection/ProtectedRoute";
import { ROLES } from '@/lib/permissions'
export default function page() {
  console.log(ROLES.UDP)
  return (
    <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.GENERAL, ROLES.UDP]}>
      <ReceptionPage />
    </ProtectedRoute>
  )
}
