import ProfilePage from "@/app/ui/dashboard/cultivators/profile/ProfilePage";
import React from "react";
export const dynamic = "force-dynamic";

// Charger le composant client dynamiquement
export default function page() {
  return (
    <div className="p-4 relative">
      <h1 className="text-2xl font-semibold m-2 absolute top-0">
        Profile du cultivateur
      </h1>
      <ProfilePage />
    </div>
  );
}
