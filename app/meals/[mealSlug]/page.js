"use server";

import FavoriteButton from "@/components/meals/favorite-button";
import { getCurrentUser } from "@/lib/auth";
import { getMeal } from "@/lib/repository/meals";
import Image from "next/image";
import EditIcon from "@mui/icons-material/Edit";
import DeleteMealButton from "@/components/meals/delete-meal-button";
import Link from "next/link";

export default async function MealPage({ params }) {
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

  const isOwner = user?.id === meal.user_id;

  return (
    <main className="flex flex-1 pt-[92px] p-6 bg-gray-50 justify-center">
      <div className="flex flex-col gap-6 max-w-5xl w-full">
        <div className="flex flex-col lg:flex-row gap-6 items-center lg:items-start">
          <div className="relative w-full sm:w-[500px] md:w-[550px] lg:w-[640px] aspect-video rounded-md overflow-hidden">
            <Image
              src={`https://s3.eu-north-1.amazonaws.com/${process.env.NEXT_PUBLIC_AWS_IMAGE_HOSTNAME}/${meal.image}`}
              alt={`${meal.title} blurred`}
              fill
              className="object-cover blur-xl scale-110 brightness-75"
            />
            <Image
              src={`https://s3.eu-north-1.amazonaws.com/${process.env.NEXT_PUBLIC_AWS_IMAGE_HOSTNAME}/${meal.image}`}
              alt={meal.title}
              fill
              className="object-contain relative z-10"
            />
          </div>

          <div className="flex flex-col gap-2 text-center lg:text-left">
            <h1 className="text-2xl font-semibold">{meal.title}</h1>
            <p className="text-sm text-muted-foreground">by {meal.username}</p>
            <p className="text-sm text-muted-foreground">
              Calories: {meal.calories} kcal
            </p>
            <p className="text-sm text-muted-foreground">
              Protein: {meal.protein} g
            </p>
            <div className="flex gap-4 justify-center lg:justify-start">
              <FavoriteButton mealId={meal.id} isFavorite={meal.is_favorite} />
              {isOwner && <DeleteMealButton mealId={meal.id} />}
              {isOwner && (
                <Link
                  href={`${mealSlug}/edit`}
                  className="hover:text-gray-700 cursor-default"
                >
                  <EditIcon />
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 bg-white rounded-md border whitespace-pre-line text-sm sm:text-base">
          {meal.instructions}
        </div>
      </div>
    </main>
  );
}
