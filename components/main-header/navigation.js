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

export default function Navigation({ user }) {
  return (
    <NavigationMenu viewport={false}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/">Home</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
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
        <NavigationMenuItem>
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
                  <Link href="/meals/my-meals">My Meals</Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link href="/meals/favorites">My Favorite Meals</Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link href="/meals/share">Share Meal</Link>
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
