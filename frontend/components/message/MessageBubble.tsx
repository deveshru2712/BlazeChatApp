import dayjs from "dayjs";
import React from "react";
import { useAppTheme } from "@/hooks/useTheme";

export default function MessageBubble({ isMine, message, time }: MessageBubbleProps) {
  const { classes } = useAppTheme();

  const formattedTime = dayjs(time);

  return (
    <div className={`flex ${isMine ? "justify-end" : " justify-start"} mb-6 px-4`}>
      <div
        className={`flex items-end gap-3 max-w-[70%] ${isMine ? "flex-row-reverse" : " flex-row"}`}
      >
        {/* Avatar */}
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
            isMine
              ? "bg-gradient-to-br from-blue-500 to-purple-600"
              : "bg-gradient-to-br from-emerald-500 to-teal-600"
          }`}
        >
          {isMine ? "Me" : "U"}
        </div>

        {/* Message Bubble */}
        <div className="flex flex-col gap-1">
          <div
            className={`px-4 py-3 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md ${
              isMine
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-md"
                : `${classes.cardBg} ${classes.border} border ${classes.textPrimary} rounded-bl-md shadow-md`
            }`}
          >
            <div className="text-base leading-relaxed">{message}</div>
          </div>

          {/* Timestamp */}
          <div
            className={`text-xs ${classes.textSecondary} px-2 ${
              isMine ? "text-left" : " text-right"
            }`}
          >
            {formattedTime.format("MMMM D, YYYY,  h:mm A")}
          </div>
        </div>
      </div>
    </div>
  );
}
