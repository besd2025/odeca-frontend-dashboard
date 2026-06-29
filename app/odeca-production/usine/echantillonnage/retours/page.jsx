import RetoursEchantillonnage from '@/app/ui/production/echantillonnage/retours'
import ProtectedRoute from "@/app/ui/protection/ProtectedRoute";
import { ROLES } from '@/lib/permissions'
import React from 'react'

export default function page() {
    return (
        <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.GENERAL, ROLES.UDP]}>
            <RetoursEchantillonnage />
        </ProtectedRoute>
    )
}
