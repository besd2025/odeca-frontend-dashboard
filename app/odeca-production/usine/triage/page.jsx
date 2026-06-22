import TriagePage from '@/app/ui/production/triage'
import React from 'react'
import ProtectedRoute from "@/app/ui/protection/ProtectedRoute";
import { ROLES } from '@/lib/permissions'
export default function page() {
  return (
    <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.UDP]}>
      <TriagePage />
    </ProtectedRoute>
  )
}
