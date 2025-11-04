"use server";

import MealsGrid from "@/components/meals/meals-grid";
import { getCurrentUser } from "@/lib/auth";
import { getFavoriteMealsByUser } from "@/lib/repository/meals";

export default async function MyFavoriteMealsPage() {
  const user = await getCurrentUser();
  const meals = await getFavoriteMealsByUser(user?.id);

  return (
    <main className="flex-1 pt-[92px] p-6 bg-gray-50">
      <MealsGrid meals={meals} currentUserId={user?.id} />
    </main>
  );
}
