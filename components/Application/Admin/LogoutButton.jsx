"use client";

import {
  DropdownMenuItem,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import { showToast } from "@/lib/showToast";
import { WEBSITE_LOGIN } from "@/routes/websiteRoutes";
import { logout } from "@/store/reducer/authReducer";
import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { useDispatch } from "react-redux";

const LogoutButton = () => {
  const dispatch = useDispatch(); // ✅ OK
  const router = useRouter();     // ✅ OK

  const handleLogout = async () => {
    try {
      const { data: logoutResponse } = await axios.post("/api/auth/logout");

      if (!logoutResponse.success) {
        throw new Error(logoutResponse.message);
      }

      dispatch(logout());
      showToast("success", logoutResponse.message);
      router.push(WEBSITE_LOGIN);
    } catch (error) {
      showToast("error", error.message || "Logout failed");
    }
  };

  return (
    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
      Logout
      <DropdownMenuShortcut>
        <RiLogoutCircleRLine color="red" />
      </DropdownMenuShortcut>
    </DropdownMenuItem>
  );
};

export default LogoutButton;
