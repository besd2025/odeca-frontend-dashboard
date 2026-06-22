"use client";
import React from "react";
import ProtectedRoute from "@/app/ui/protection/ProtectedRoute";
import { ROLES } from "@/lib/permissions";
import ReceptionComponent from "@/app/ui/production/laboratoire/reception/ReceptionComponent";
import ReceptionPage from "@/app/ui/production/laboratoire/reception";

export default function Page() {
  return (
    <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.LABORATOIRE]}>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Réception & Codage
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Enregistrement, réception et codage anonyme des échantillons au laboratoire.
          </p>
        </div>
        {/* <ReceptionComponent /> */}
        <ReceptionPage />
      </div>
    </ProtectedRoute>
  );
}
