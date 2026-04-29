import React from 'react'
import ReportsPage from '@/app/ui/dashboard/reports/history'
import ProtectedRoute from '@/app/ui/protection/ProtectedRoute'
import { ROLES } from '@/lib/permissions'
export default function page() {
    return (
        <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.GENERAL, ROLES.ODECA, ROLES.SOCIETE, ROLES.SUPERVISEUR_REGIONAL, ROLES.SUPERVISEUR]}>
            <ReportsPage />
        </ProtectedRoute>
    )
}