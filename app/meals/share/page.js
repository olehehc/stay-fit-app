import ShareMealCard from "@/components/meals/share-meal-card";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default async function ShareMealPage() {
  const user = await getCurrentUser();

  if (!user) {
    return redirect("/auth/sign-in");
  }

  return (
    <main className="flex-1 flex items-center justify-center pt-[92px] p-6 bg-gray-50">
      <ShareMealCard />
    </main>
  );
}
