"use client";

import ErrorPage from "@/components/ErrorPage";

export default function GlobalError() {
  return (
    <ErrorPage
      title="Something went wrong"
      message="An unexpected error occurred. Please try again later."
    />
  );
}
