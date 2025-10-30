"use client";

import Link from "next/link";

import SignOutButton from "./sign-out-button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuContent,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu";
import { NavigationMenuTrigger } from "@radix-ui/react-navigation-menu";
import { usePathname } from "next/navigation";

export default function Navigation({ user }) {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/">Home</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem className="hidden md:block">
          <NavigationMenuTrigger className={navigationMenuTriggerStyle()}>
            Trainings
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[200px] gap-4">
              <li>
                <NavigationMenuLink asChild>
                  <Link href="/trainings">My Trainings</Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link href="/trainings/create-training">Add Training</Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem className="hidden md:block">
          <NavigationMenuTrigger className={navigationMenuTriggerStyle()}>
            Meals
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[200px] gap-4">
              <li>
                <NavigationMenuLink asChild>
                  <Link href="/meals">Browse Meals</Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link href="#">My Meals</Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link href="#">My Favorite Meals</Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          {user ? (
            <SignOutButton className={navigationMenuTriggerStyle()} />
          ) : (
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <Link href="/auth/sign-in">Sign In</Link>
            </NavigationMenuLink>
          )}
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
