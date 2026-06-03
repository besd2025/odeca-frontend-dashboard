import Grades from '@/app/ui/production/reception/grades'
import React from 'react'
import { ROLES } from '@/lib/permissions'
import ProtectedRoute from '@/app/ui/protection/ProtectedRoute'
import { Settings } from 'lucide-react'

export default function page() {
    return (
        <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.GENERAL, ROLES.ODECA, ROLES.SUPERVISEUR]}>
            <div className="p-6 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Settings className="h-8 w-8 text-primary" /> Confirmation des grades
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                        Confirmer les grades du café reçu et transféré.
                    </p>
                </div>
                <Grades />
            </div>
        </ProtectedRoute>
    )
}