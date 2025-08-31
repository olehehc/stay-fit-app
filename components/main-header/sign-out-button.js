"use client";

import { useTransition } from "react";

import { Button } from "../ui/button";
import { signOut } from "@/lib/auth";

export default function SignOutButton() {
  const [isPending, startTransition] = useTransition();

  function handleLogout() {
    startTransition(() => {
      signOut();
    });
  }

  return (
    <Button
      onClick={handleLogout}
      disabled={isPending}
      className="text-sm px-3 py-1 text-secondary"
    >
      {isPending ? "Signing out..." : "Sign Out"}
    </Button>
  );
}
