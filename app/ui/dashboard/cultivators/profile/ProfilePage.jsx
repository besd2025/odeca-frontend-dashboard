"use client";
import React, { useContext } from "react";
import ProfileCard from "./ProfileCard";
import StatsCard from "./StatsCard";
import ActivityList from "./profile-content";
import Edit from "../edit";
import { useSearchParams } from "next/navigation";
import { UserContext } from "@/app/ui/context/User_Context";
import AvancePayment from "../payment/avance";
function ProfilePage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const user = useContext(UserContext)
  console.log("user", user)
  return (
    <div className=" space-y-6">

      <div className="flex justify-end gap-2">
        {user?.session?.category === "Admin" ? (
          <>
            <Edit cultivator={id} />
          </>
        ) : ""}
        {user?.session?.category === "Admin" || user?.session?.category === "Cafe_Chef_societe" ? (
          <>
            <AvancePayment cultivator={id} />
          </>
        ) : ""}

      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <ProfileCard cult_id={id} />

        <div className="relative flex-1 space-y-6 z-10">
          <section className="space-y-4">
            <StatsCard cult_id={id} />
          </section>

          <ActivityList cult_id={id} />
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;