"use client";
import React from "react";
import ProtectedRoute from "@/app/ui/protection/ProtectedRoute";
import { ROLES } from "@/lib/permissions";
import CuppingComponent from "@/app/ui/production/laboratoire/CuppingComponent";
import { Coffee } from "lucide-react";

export default function Page() {
  return (
    <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.LABORATOIRE]}>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Coffee className="h-8 w-8 text-primary" /> Torréfaction et Dégustation
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Évaluation organoleptique et fiches de dégustation (cupping) du café torréfié.
          </p>
        </div>
        <CuppingComponent />
      </div>
    </ProtectedRoute>
  );
}
