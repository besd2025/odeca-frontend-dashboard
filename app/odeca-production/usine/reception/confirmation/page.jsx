import ConfirmationPage from '@/app/ui/production/reception/confirmation'
import React from 'react'
import { ROLES } from '@/lib/permissions'
import ProtectedRoute from '@/app/ui/protection/ProtectedRoute'
export const dynamic = "force-dynamic";
export default function page() {
    return (
        <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.UDP]}>
            <ConfirmationPage />
        </ProtectedRoute>
    )
}
