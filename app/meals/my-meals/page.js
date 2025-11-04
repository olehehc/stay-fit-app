"use server";

import MealsGrid from "@/components/meals/meals-grid";
import { getCurrentUser } from "@/lib/auth";
import { getMealsByUser } from "@/lib/repository/meals";

export default async function MyMealsPage() {
  const user = await getCurrentUser();
  const meals = await getMealsByUser(user?.id);

  return (
    <main className="flex-1 pt-[92px] p-6 bg-gray-50">
      <MealsGrid meals={meals} currentUserId={user?.id} />
    </main>
  );
}
