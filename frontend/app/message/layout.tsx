"use client";

import socketStore from "@/store/socket.store";
import authStore from "@/store/auth.store";
import { useEffect } from "react";

export default function MessageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
