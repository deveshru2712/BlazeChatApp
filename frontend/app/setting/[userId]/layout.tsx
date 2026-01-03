"use client";
import type React from "react";
import { useEffect, useRef } from "react";

export default function SettingLayout({ children }: { children: React.ReactNode }) {
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;

    const initialize = async () => {
      hasInitialized.current = true;
    };

    initialize();
  }, []);

  return <>{children}</>;
}
