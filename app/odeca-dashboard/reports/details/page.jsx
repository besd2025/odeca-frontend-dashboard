import React from 'react'
import DetailsReports from '@/app/ui/dashboard/reports/details'
import ProtectedRoute from '@/app/ui/protection/ProtectedRoute'
import { ROLES } from '@/lib/permissions'
export const dynamic = "force-dynamic";
export default function page() {
    return (
        <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.GENERAL, ROLES.ODECA, ROLES.SOCIETE, ROLES.SUPERVISEUR_REGIONAL, ROLES.SUPERVISEUR]}>
            <DetailsReports />
        </ProtectedRoute>
    )
}
