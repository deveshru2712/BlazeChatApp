"use client";

import React from "react";
import { useAppTheme } from "@/hooks/useTheme";

export default function AnimatedBlobs() {
  const { classes } = useAppTheme();

  return (
    <div className="w-screen h-screen relative">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className={`absolute top-1/4 left-10 w-2 h-2 ${classes.dots.blue} rounded-full animate-pulse`}
        ></div>
        <div
          className={`absolute top-1/3 right-16 w-3 h-3 ${classes.dots.purple} rounded-full animate-pulse delay-1000`}
        ></div>
        <div
          className={`absolute bottom-1/3 left-1/4 w-1.5 h-1.5 ${classes.dots.emerald} rounded-full animate-pulse delay-500`}
        ></div>
        <div
          className={`absolute bottom-1/4 right-1/3 w-2.5 h-2.5 ${classes.dots.pink} rounded-full animate-pulse delay-700`}
        ></div>
      </div>
    </div>
  );
}
