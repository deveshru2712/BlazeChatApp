"use client";
import { Settings } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import authStore from "@/store/auth.store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface SettingsButtonProps {
  className?: string;
}

export function SettingsButton({ className }: SettingsButtonProps) {
  const { user, logOut } = authStore();
  const router = useRouter();
  const pathname = usePathname();

  const handleSettingsClick = () => {
    router.push(`/setting/${user?.id}`);
  };

  const handleNavigateToMessages = () => {
    router.push("/message");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={className}>
        <Settings className="h-[1.2rem] w-[1.2rem] transition-all hover:rotate-90" />
        <span className="sr-only">Settings</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          {pathname.startsWith("/setting") ? (
            <button onClick={handleNavigateToMessages}>Message Page</button>
          ) : (
            <button onClick={handleSettingsClick}>Profile Update</button>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={logOut}>Log Out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
