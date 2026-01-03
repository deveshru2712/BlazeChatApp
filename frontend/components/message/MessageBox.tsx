"use client";
import dayjs from "dayjs";
import { User } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { useAppTheme } from "@/hooks/useTheme";

export default function MessageBox({
  username,
  id,
  profileImg,
  latestMessage,
  time,
  onClick,
}: MessageBoxProps) {
  const { classes } = useAppTheme();
  const [isOnline, setIsOnline] = useState(false);

  // TODO: online status in the message box that is shown in the sidebar

  return (
    <div onClick={onClick} className="w-full px-2 h-20 rounded-md cursor-pointer relative group">
      {/* Gradient border on hover */}
      <div className="absolute inset-1 -z-10 bg-slate-400/50 group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-600 rounded-md transition-all duration-500" />

      {/* Content container */}
      <div
        className={`flex gap-5 inset-1.5 ${classes.cardBg} absolute z-10 rounded-md px-2 py-2 ${classes.border} border transition-all duration-300 group-hover:shadow-lg group-hover:shadow-blue-500/10`}
      >
        <div className="relative flex-shrink-0">
          {profileImg ? (
            <Image
              src={profileImg}
              alt="profile-image"
              height={64}
              width={64}
              className="w-12 h-12 object-cover rounded-full"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-6 h-6 text-gray-400" />
            </div>
          )}

          {/* Online indicator */}
          {isOnline && (
            <div className="absolute bottom-1 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full shadow-sm z-10" />
          )}
        </div>

        <div className="w-full flex flex-col justify-center min-w-0">
          <div className="flex justify-between items-start">
            <div>
              <h2 className={`${classes.textPrimary} font-semibold text-lg truncate`}>
                {username}
              </h2>
              <div className={`${classes.textSecondary} font-medium text-base truncate`}>
                {latestMessage && latestMessage.length > 35
                  ? `${latestMessage.slice(0, 35)}...`
                  : latestMessage || "No messages yet"}
              </div>
            </div>
            {time && (
              <span
                className={`${classes.textSecondary} text-sm flex-shrink-0 ml-2 hidden md:flex md:flex-col`}
              >
                {dayjs(time).format("MMM D, YYYY")}
                <span>{dayjs(time).format("h:mm A")}</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
