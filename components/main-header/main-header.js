import Link from "next/link";

import NavLink from "./nav-link";
import SignOutButton from "./sign-out-button";
import { getCurrentUser } from "@/lib/auth";

export default async function MainHeader() {
  const user = await getCurrentUser();

  return (
    <header className="bg-black p-4 flex justify-between items-center">
      <Link href="/" className="text-white text-xl font-bold">
        💪 FitMeals
      </Link>
      <nav className="flex gap-4">
        <NavLink href="/">Home</NavLink>
        <NavLink href="/meals">Browse Meals</NavLink>
        <NavLink href="/dashboard">Dashboard</NavLink>
        {user ? (
          <SignOutButton />
        ) : (
          <NavLink href="/auth/sign-in">Sign In</NavLink>
        )}
      </nav>
    </header>
  );
}
