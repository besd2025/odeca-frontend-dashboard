"use client";
import React,{useContext} from "react";
import ProfileCard from "./ProfileCard";
import StatsCard from "./StatsCard";
import ActivityList from "./profile-content";
import Edit from "../edit";
import { useSearchParams } from "next/navigation";
import { UserContext } from "@/app/ui/context/User_Context";
function ProfilePage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
    const user=useContext(UserContext)
  return (
    <div className=" space-y-6">
        {user?.session?.category==="Admin"?(
      <div className="flex justify-end gap-2">
        <Edit cultivator={id} />
      </div>):""}

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