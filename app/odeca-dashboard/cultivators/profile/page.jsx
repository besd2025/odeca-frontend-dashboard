import ProfilePage from "@/app/ui/dashboard/cultivators/profile/ProfilePage";
import React from "react";
export const dynamic = "force-dynamic";

// Charger le composant client dynamiquement
export default function page() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold m-2">Profile du cultivateur</h1>
      <ProfilePage />
    </div>
  );
}
