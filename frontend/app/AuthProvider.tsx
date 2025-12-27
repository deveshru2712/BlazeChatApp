"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import authStore from "@/store/auth.store";
import Loader from "@/components/Loader";

const PUBLIC_ROUTES = ["/", "/sign-in", "/sign-up"];

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, hasCheckedAuth, authCheck } = authStore();

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    authCheck();
  }, [authCheck]);

  useEffect(() => {
    if (!hasCheckedAuth) return;

    if (!user && !PUBLIC_ROUTES.includes(pathname)) {
      router.replace("/sign-in");
      return;
    }

    if (user && PUBLIC_ROUTES.includes(pathname)) {
      router.replace("/message");
    }
  }, [user, pathname, hasCheckedAuth, router]);

  if (!hasCheckedAuth) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return <>{children}</>;
}
