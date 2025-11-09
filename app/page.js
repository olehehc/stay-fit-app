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
    <main className="flex-1 p-6 pt-[68px] bg-gray-50">
      <div className="max-w-5xl mt-6 mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-semibold">
            Welcome back, {user.username || "Athlete"}!
          </h1>
        </header>

        <section className="grid md:grid-cols-2 gap-6">
          <Card className="p-6 flex flex-col justify-between">
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-semibold mb-3">
                Today&rsquo;s pending trainings
              </h2>
              {trainings && trainings.length > 0 ? (
                <ul className="space-y-3 mb-4">
                  {trainings.map((training) => (
                    <TrainingPreviewItem
                      key={training.id}
                      id={training.id}
                      title={training.title}
                      slug={training.slug}
                      completed={training.completed}
                    />
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600 mb-4">
                  No trainings scheduled for today.
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <Link href="/trainings">
                <Button>View all</Button>
              </Link>
              <Link href="/trainings/create-training">
                <Button variant="outline">Add Training</Button>
              </Link>
            </div>
          </Card>

          <Card className="p-6 flex flex-col justify-between">
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-semibold mb-3">Meals & Nutrition</h2>

              {meals && meals.length > 0 ? (
                <ul className="space-y-3 mb-4">
                  {meals.slice(0, 3).map((meal) => (
                    <MealPreviewItem
                      key={meal.id}
                      id={meal.id}
                      image={meal.image}
                      title={meal.title}
                      username={meal.username}
                      slug={meal.slug}
                    />
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600 mb-4">
                  You haven&rsquo;t added any meals yet. Start tracking what you
                  eat!
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <Link href="/meals/my-meals">
                <Button>My Meals</Button>
              </Link>
              <Link href="/meals/favorites">
                <Button variant="outline">Favorites</Button>
              </Link>
            </div>
          </Card>
        </section>
      </div>
    </main>
  );
}
