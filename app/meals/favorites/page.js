"use server";

import MealsGrid from "@/components/meals/meals-grid";
import { getCurrentUser } from "@/lib/auth";
import { getFavoriteMealsByUser } from "@/lib/repository/meals";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function MyFavoriteMealsPage() {
  const user = await getCurrentUser();

  if (!user) {
    return redirect("/auth/sign-in");
  }

  const meals = await getFavoriteMealsByUser(user?.id);

  return (
    <main className="flex-1 flex flex-col pt-[92px] p-6 bg-gray-50">
      <div className="w-full max-w-[1440px] mx-auto flex-1 flex flex-col">
        {meals.length === 0 ? (
          <div className="flex-1 flex flex-col gap-6 items-center justify-center">
            <p className="text-gray-500 text-lg">Lack of Meals</p>
            <Button asChild className="mb-6 w-auto">
              <Link href="/meals">Brose Meals</Link>
            </Button>
          </div>
        ) : (
          <>
            <Button asChild className="mb-6 self-start w-auto">
              <Link href="/meals/share">Share Your Recipe</Link>
            </Button>
            <MealsGrid meals={meals} currentUserId={user?.id} />
          </>
        )}
      </div>
    </main>
  );
}
