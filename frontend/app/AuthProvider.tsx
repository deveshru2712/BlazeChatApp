"use client";
import Loader from "@/components/Loader";
import authStore from "@/store/auth.store";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, authCheck, isLoading } = authStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    authCheck();
  }, [authCheck]);

  useEffect(() => {
    if (isLoading) return;

    if (!user && pathname !== "/sign-in" && pathname !== "/") {
      router.replace("/sign-in");
      return;
    }

    if (user && (pathname === "/sign-in" || pathname === "/")) {
      router.replace("/message");
    }
  }, [isLoading, user, pathname, router]);

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  return <>{children}</>;
}
