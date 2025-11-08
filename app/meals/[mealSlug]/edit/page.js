"use server";

import { getCurrentUser } from "@/lib/auth";
import { getMeal } from "@/lib/repository/meals";
import EditMealCard from "@/components/meals/edit-meal-card";

export default async function EditMealPage({ params }) {
  const { mealSlug } = await params;

  const user = await getCurrentUser();
  const meal = await getMeal(mealSlug, user?.id);

  if (!meal) {
    return (
      <main className="flex flex-1 items-center justify-center pt-[92px] p-6 bg-gray-50">
        <p className="text-muted-foreground text-lg">Meal not found.</p>
      </main>
    );
  }

  return (
    <main className="flex-1 flex items-center justify-center pt-[92px] p-6 bg-gray-50">
      <EditMealCard initialData={meal} />
    </main>
  );
}
