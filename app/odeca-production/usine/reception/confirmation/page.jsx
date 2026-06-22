import ConfirmationPage from '@/app/ui/production/reception/confirmation'
import React from 'react'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { ROLES } from '@/lib/permissions'
export const dynamic = "force-dynamic";
export default function page() {
    return (
        <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.UDP]}>
            <ConfirmationPage />
        </ProtectedRoute>
    )
}
