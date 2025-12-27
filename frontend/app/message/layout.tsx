"use client";
import socketStore from "@/store/socket.store";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef } from "react";

export default function MessageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    socket,
    setSocket,
    disconnect,
    isOnline,
    getOnlineUser,
    startHeartBeat,
  } = socketStore();
  const router = useRouter();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;

    const initialize = async () => {
      hasInitialized.current = true;
      setSocket();
    };

    initialize();

    return () => {
      disconnect();
    };
  }, [disconnect, router, setSocket]);

  useEffect(() => {
    if (socket && isOnline) {
      getOnlineUser();
      startHeartBeat();
    }
  }, [getOnlineUser, startHeartBeat, isOnline, socket]);

  return <>{children}</>;
}
