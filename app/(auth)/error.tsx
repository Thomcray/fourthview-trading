"use client";

import { Button } from "@/components/ui/button";

type ErrorType = {
  message: string;
};

interface ErrorHandler {
  error: ErrorType;
  reset(): void;
}
export default function Error({ error, reset }: ErrorHandler) {
  return (
    <main className="w-full h-dvh flex flex-col items-center justify-center gap-6 self-center border">
      <h1 className="text-3xl font-semibold">Something went wrong!</h1>
      <p className="text-lg">{error.message}</p>

      <Button
        className="px-6 py-3 text-lg bg-red-800 text-white"
        onClick={reset}
      >
        Try again
      </Button>
    </main>
  );
}
