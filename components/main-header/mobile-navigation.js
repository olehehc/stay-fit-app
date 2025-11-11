"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import SignOutButton from "./sign-out-button";

export default function MobileNavigation({ user }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          aria-label="Open menu"
          className="text-white p-2 rounded-md hover:bg-gray-800 transition"
        >
          <Menu size={24} />
        </button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="bg-black text-white w-[80vw] sm:w-[300px] border-l border-gray-800"
      >
        <SheetHeader>
          <SheetTitle className="p-2 text-xl font-semibold text-white text-center">
            Menu
          </SheetTitle>
        </SheetHeader>

        <nav className="mt-6 flex flex-col items-center gap-4 text-lg">
          <SheetClose asChild>
            <Link href="/" className="hover:text-gray-300">
              Home
            </Link>
          </SheetClose>

          <div className="border-t border-white my-3 w-2/3"></div>

          <SheetClose asChild>
            <Link href="/trainings" className="hover:text-gray-300">
              My Trainings
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link
              href="/trainings/create-training"
              className="hover:text-gray-300"
            >
              Add Training
            </Link>
          </SheetClose>

          <div className="border-t border-white my-3 w-2/3"></div>

          <SheetClose asChild>
            <Link href="/meals" className="hover:text-gray-300">
              Browse Meals
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link href="/meals/my-meals" className="hover:text-gray-300">
              My Meals
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link href="/meals/favorites" className="hover:text-gray-300">
              Favorites
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link href="/meals/share" className="hover:text-gray-300">
              Share Meal
            </Link>
          </SheetClose>

          <div className="border-t border-white my-3 w-2/3"></div>

          {user ? (
            <SignOutButton className="w-full justify-center" />
          ) : (
            <SheetClose asChild>
              <Link href="/auth/sign-in" className="hover:text-gray-300">
                Sign In
              </Link>
            </SheetClose>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
