"use client";

import { useContext } from "react";
import { useRouter } from "next/navigation";
import { UserContext } from "@/app/ui/context/User_Context";

export default function ProtectedRoute({ children, allowedRoles }) {
    const user = useContext(UserContext);
    const router = useRouter();

    if (!user) {
        router.push("/");
        return null;
    }

    if (!allowedRoles.includes(user?.session?.category)) {
        router.push("/unauthorized");
        return null;
    }

    return children;
}