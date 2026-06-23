"use client";
import React from "react";
import ProtectedRoute from "@/app/ui/protection/ProtectedRoute";
import { ROLES } from "@/lib/permissions";
import GranulometrieComponent from "@/app/ui/production/laboratoire/GranulometrieComponent";
import { BarChart3 } from "lucide-react";

export default function Page() {
  return (
    <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.LABORATOIRE]}>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="h-7 w-7 text-primary" /> Analyse Granulométrique
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Mesures de la taille des grains et de la répartition granulométrique du café vert.
          </p>
        </div>
        <GranulometrieComponent />
      </div>
    </ProtectedRoute>
  );
}
