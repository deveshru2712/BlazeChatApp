"use client";
import React from "react";
import { useAppTheme } from "@/hooks/useTheme";

interface SkeletonBubbleProps {
  isMyMessage: boolean;
}

export default function SkeletonBubble({ isMyMessage }: SkeletonBubbleProps) {
  const { classes } = useAppTheme();

  return (
    <div className={`flex ${isMyMessage ? "justify-start" : "justify-end"} mb-6 px-4`}>
      <div
        className={`flex items-end gap-3 w-1/2 ${isMyMessage ? "flex-row" : "flex-row-reverse"}`}
      >
        {/* Avatar Skeleton */}
        <div
          className={`flex-shrink-0 w-12 h-12 rounded-full animate-pulse ${
            isMyMessage ? classes.dots.emerald : classes.dots.blue
          }`}
        ></div>

        <div className="flex flex-col gap-1 w-full">
          {/* Message Skeleton */}
          <div
            className={`px-4 py-3 rounded-2xl shadow-sm animate-pulse ${
              isMyMessage
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-md"
                : `${classes.cardBg} ${classes.border} border rounded-bl-md shadow-md`
            }`}
          >
            <div className="space-y-2">
              {/* First line skeleton */}
              <div
                className={`h-4 rounded-full animate-pulse ${
                  isMyMessage ? "bg-white/30" : "bg-slate-300/70 dark:bg-slate-600/50"
                }`}
                style={{ width: Math.random() * 40 + 60 + "%" }}
              ></div>

              {/* Second line skeleton (randomly shown) */}
              {Math.random() > 0.5 && (
                <div
                  className={`h-4 rounded-full animate-pulse ${
                    isMyMessage ? "bg-white/30" : "bg-slate-300/70 dark:bg-slate-600/50"
                  }`}
                  style={{ width: Math.random() * 60 + 40 + "%" }}
                ></div>
              )}
            </div>
          </div>

          {/* Timestamp Skeleton */}
          <div className={`${classes.textSecondary} text-xs px-2 text-right`}>
            <div
              className={`h-3 w-12 bg-slate-300/60 dark:bg-slate-600/40 rounded animate-pulse inline-block`}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
