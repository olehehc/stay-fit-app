"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FavoriteButton from "./favorite-button";
import DeleteMealButton from "./delete-meal-button";

export default function MealItem({
  id,
  title,
  slug,
  image,
  username,
  calories,
  protein,
  is_favorite,
  user_id,
  currentUserId,
}) {
  return (
    <Card className="w-full max-w-sm pt-0">
      <div className="relative h-60 overflow-hidden rounded-t-xl">
        <Link href={`/meals/${slug}`}>
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover object-center"
            priority={false}
          />
        </Link>
      </div>
      <CardHeader>
        <CardTitle>
          <Link href={`/meals/${slug}`}>{title}</Link>
        </CardTitle>
        <CardDescription>
          <p>{username}</p>
        </CardDescription>
        <CardAction className="flex gap-2">
          <FavoriteButton mealId={id} isFavorite={is_favorite} />
          {currentUserId === user_id && <DeleteMealButton mealId={id} />}
        </CardAction>
      </CardHeader>
      <CardContent className="text-sm">
        <div>
          <p>Calories: {calories} kcal</p>
          <p>Protein: {protein} g</p>
        </div>
      </CardContent>
    </Card>
  );
}
