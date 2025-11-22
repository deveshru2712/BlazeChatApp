"use client";
import Link from "next/link";
import React from "react";
import { Toggle } from "./Toggle";
import { SettingsButton } from "./SettingButton";
import authStore from "@/store/auth.store";

export default function Navbar() {
  const { user } = authStore();

  return (
    <div className="w-full px-4 py-2 relative z-10">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1">
          <h1 className="text-lg md:text-2xl lg:text-4xl font-bold hover:bg-gradient-to-r hover:from-yellow-400 hover:via-orange-400 hover:to-red-600 hover:bg-clip-text hover:text-transparent cursor-pointer duration-300 transition-all">
            <Link href={"/"}>
              Blaze <span className="text-black">🔥</span>
            </Link>
          </h1>
        </div>
        <div>
          <div className="flex items-center gap-5">
            {user && (
              <SettingsButton className="opacity-100 p-2 outline rounded-md" />
            )}
            <Toggle />
          </div>
        </div>
      </div>
    </div>
  );
}
