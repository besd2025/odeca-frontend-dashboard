import React from "react";
import { Button } from "@/components/ui/button";
import ProfileCard from "./ProfileCard";
import StatsCard from "./StatsCard";
import ActivityList from "./profile-content";
import { Star, Users, CheckCircle, Calendar, Mail } from "lucide-react";
import Edit from "../edit";

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

  const stats = [
    {
      id: "stat-1",
      icon: Star,
      value: "4.9/5",
      label: "Quality Rating",
    },
    {
      id: "stat-2",
      icon: Users,
      value: "32",
      label: "Active Partners",
    },
    {
      id: "stat-3",
      icon: CheckCircle,
      value: "128",
      label: "Completed Orders",
    },
  ];

  const activities = [
    {
      id: "activity-1",
      icon: CheckCircle,
      title: "Harvest inspection completed",
      description: "Batch #122 validated and approved",
      time: "Today · 10:24 AM",
    },
    {
      id: "activity-2",
      icon: Calendar,
      title: "Meeting scheduled",
      description: "Strategy sync with procurement team",
      time: "Yesterday · 4:10 PM",
    },
    {
      id: "activity-3",
      icon: Mail,
      title: "New partner introduction",
      description: "Responded to outreach from AgriNova",
      time: "Monday · 1:45 PM",
    },
  ];

  return (
    <div className=" space-y-6">
      <div className="flex justify-end gap-2">
        <Edit />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <ProfileCard profile={profile} />

        <div className="flex-1 space-y-6">
          <section className="space-y-4">
            <StatsCard />
          </section>

          <ActivityList items={activities} />
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
