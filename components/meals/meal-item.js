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
import FavoriteButton from "../ui/favorite-button";

export default function MealItem({
  id,
  title,
  slug,
  image,
  username,
  calories,
  protein,
  is_favorite,
}) {
  return (
    <Card className="w-full max-w-sm pt-0">
      <div className="relative h-60 overflow-hidden rounded-t-xl">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover object-center"
          priority={false}
        />
      </div>
      <CardHeader>
        <CardTitle>
          <Link href={`/meals/${slug}`}>{title}</Link>
        </CardTitle>
        <CardDescription>
          <p>{username}</p>
        </CardDescription>
        <CardAction>
          <FavoriteButton mealId={id} isFavorite={is_favorite} />
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
