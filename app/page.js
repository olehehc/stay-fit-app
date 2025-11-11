import { getCurrentUser } from "@/lib/auth";
import { getTrainingsByUserAndDateRange } from "@/lib/repository/trainings";
import { getMealsByUser } from "@/lib/repository/meals";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatDateToYMD } from "@/lib/utils";
import TrainingPreviewItem from "@/components/trainings/training-preview-item";
import MealPreviewItem from "@/components/meals/meal-preview-item";
import HomeGuestSection from "@/components/home/home-guest-section";

export default async function Home() {
  const user = await getCurrentUser();

  if (!user) {
    return <HomeGuestSection />;
  }

  const today = new Date();
  const formattedToday = formatDateToYMD(today);

  const trainings = await getTrainingsByUserAndDateRange(
    user.id,
    formattedToday,
    formattedToday,
    "pending"
  );

  const meals = await getMealsByUser(user.id);

  return (
    <main className="flex-1 p-4 sm:p-4 bg-gray-50 overflow-x-hidden">
      <div className="w-full p-12 max-w-5xl mt-12 mx-auto px-4 sm:px-6 space-y-8">
        <header>
          <h1 className="text-2xl sm:text-3xl font-semibold">
            Welcome back, {user.username || "Athlete"}!
          </h1>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="w-full p-4 sm:p-6 flex flex-col justify-between">
            <div className="flex flex-col gap-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-3">
                Today&rsquo;s pending trainings
              </h2>
              {trainings?.length > 0 ? (
                <ul className="space-y-3 mb-4">
                  {trainings.map((training) => (
                    <TrainingPreviewItem key={training.id} {...training} />
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600 mb-4">
                  No trainings scheduled for today.
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/trainings">
                <Button>View all</Button>
              </Link>
              <Link href="/trainings/create-training">
                <Button variant="outline">Add Training</Button>
              </Link>
            </div>
          </Card>

          <Card className="w-full p-4 sm:p-6 flex flex-col justify-between">
            <div className="flex flex-col gap-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-3">
                Meals & Nutrition
              </h2>
              {meals?.length > 0 ? (
                <ul className="space-y-3 mb-4">
                  {meals.slice(0, 3).map((meal) => (
                    <MealPreviewItem key={meal.id} {...meal} />
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600 mb-4">
                  You haven&rsquo;t added any meals yet.
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/meals">
                <Button>Browse Meals</Button>
              </Link>
              <Link href="/meals/my-meals">
                <Button variant="outline">My Meals</Button>
              </Link>
            </div>
          </Card>
        </section>
      </div>
    </main>
  );
}
