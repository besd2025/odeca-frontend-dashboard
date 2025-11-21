"use client";
import React from "react";
import ProfileCard from "./ProfileCard";
import StatsCard from "./StatsCard";
import ActivityList from "./profile-content";
import Edit from "../edit";
import { useSearchParams } from "next/navigation";
function ProfilePage() {
  const profile = {
    name: "Brave Gak",
    title: "Cafeiculteur",
    avatar: "/images/logo.jpg",
    cni: "25/4565",
    birthDate: "12 Jan 1990",
    gender: "M",
    location: "Bujumbura / Kamenge / Mirango",
    phone: "78451232",
    champs: "4",
    sdl: "Ngome / Kayanza",
  };
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  return (
    <div className=" space-y-6">
      <div className="flex justify-end gap-2">
        <Edit cultivator={id} />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <ProfileCard profile={profile} />

        <div className="flex-1 space-y-6">
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
