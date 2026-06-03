"use client";
import React from "react";
import ProtectedRoute from "@/app/ui/protection/ProtectedRoute";
import { ROLES } from "@/lib/permissions";
import RapportsComponent from "@/app/ui/production/laboratoire/RapportsComponent";

export default function Page() {
  return (
    <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.GENERAL, ROLES.ODECA, ROLES.SUPERVISEUR]}>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            📜 Décisions & Rapports
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Validation de la qualité, décisions finales et génération des rapports de dégustation.
          </p>
        </div>
        <RapportsComponent />
      </div>
    </ProtectedRoute>
  );
}
