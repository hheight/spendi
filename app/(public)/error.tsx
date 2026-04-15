"use client";

import { useEffect } from "react";
import ErrorCard from "@/components/error-card";

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return <ErrorCard reset={reset} />;
}
