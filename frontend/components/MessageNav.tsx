"use client";
import { useAppTheme } from "@/hooks/useTheme";
import socketStore from "@/store/socket.store";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const MessageNav = ({
  user: { username, id, profilePicture },
  isTyping,
}: MessageNavProps) => {
  const {} = socketStore();
  const [isOnline, setIsOnline] = useState(false);
  const { classes } = useAppTheme();

  // TODO: update the online status of the person i am currently talking to

  return (
    <div className="w-full px-4 py-2 h-14 border border-b rounded-2xl mb-5">
      <div className="flex items-center h-full">
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <Image
              src={profilePicture || "https://avatar.iran.liara.run/public"}
              alt="profile_image"
              height={40}
              width={40}
              className="w-10 h-10 object-cover rounded-full"
            />
            {/* Online status indicator */}
            {isOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full shadow-sm z-10" />
            )}
          </div>
          <div>
            <div className="text-lg font-medium cursor-pointer">{username}</div>
            <div
              className={`text-sm ${classes.textSecondary} ${
                isTyping ? "opacity-100" : "opacity-0"
              }`}
            >
              typing...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageNav;
