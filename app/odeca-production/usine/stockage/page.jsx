import StockagePage from '@/app/ui/production/stockage'
import { ROLES } from '@/lib/permissions'
import ProtectedRoute from '@/app/ui/protection/ProtectedRoute';
import React from 'react'

export default function page() {
  return (
    <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.GENERAL, ROLES.UDP]}>
      <StockagePage />
    </ProtectedRoute>
  )
}
