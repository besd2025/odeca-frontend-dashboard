import ProtectedRoute from '@/app/ui/protection/ProtectedRoute'
import { ROLES } from '@/lib/permissions'
import React from 'react'
import CommercialisationComponent from '@/app/ui/production/commercialisation'

export default function page() {
    return (
        <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.GENERAL, ROLES.ODECA, ROLES.SUPERVISEUR]}>
            <CommercialisationComponent />
        </ProtectedRoute>
    )
}

