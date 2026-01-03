"use client";

import { AlertTriangle } from "lucide-react";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ErrorPageProps {
  title?: string;
  message?: string;
  showBackButton?: boolean;
}

export default function ErrorPage({
  title = "Something went wrong",
  message = "An unexpected error occurred or the page you're looking for doesn't exist.",
  showBackButton = true,
}: ErrorPageProps) {
  return (
    <div className="h-screen w-full flex items-center justify-center p-6">
      <Card className="w-full max-w-md rounded-2xl shadow-lg">
        <CardContent className="text-center p-8">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="w-16 h-16 text-red-500" />
          </div>

          <h1 className="text-2xl font-bold mb-2">{title}</h1>

          <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>

          {showBackButton && (
            <Button className="w-full py-3 text-lg" onClick={() => redirect("/message")}>
              Go Back
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
