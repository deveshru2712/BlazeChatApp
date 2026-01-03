"use client";

import { useEffect } from "react";
import authStore from "@/store/auth.store";
import socketStore from "@/store/socket.store";

export default function MessageLayout({ children }: { children: React.ReactNode }) {
  const { user } = authStore();
  const { setSocket, disconnect } = socketStore();

  useEffect(() => {
    if (!user?.id) return;

    setSocket();

    return () => {
      disconnect();
    };
  }, [user, setSocket, disconnect]);

  return <>{children}</>;
}
