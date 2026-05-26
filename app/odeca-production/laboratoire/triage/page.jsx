"use client";
import React from "react";
import ProtectedRoute from "@/app/ui/protection/ProtectedRoute";
import { ROLES } from "@/lib/permissions";

export default function Page() {
  return (
    <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.GENERAL, ROLES.ODECA, ROLES.SUPERVISEUR]}>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            🪓 Triage Manuel
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Suivi du triage manuel des défauts physiques sur les échantillons physiques.
          </p>
        </div>
        <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center bg-slate-50/50 dark:bg-slate-900/50">
          <p className="text-slate-600 dark:text-slate-400 font-medium">
            Le module de Triage Manuel est en cours de développement.
          </p>
        </div>
      </div>
    </ProtectedRoute>
  );
}
