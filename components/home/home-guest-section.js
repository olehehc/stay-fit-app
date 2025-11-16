import Link from "next/link";
import { Button } from "@/components/ui/button";
import HomeFeatureCard from "./home-feature-card";
import FitnessCenterTwoToneIcon from "@mui/icons-material/FitnessCenterTwoTone";
import SsidChartOutlinedIcon from "@mui/icons-material/SsidChartOutlined";
import RamenDiningOutlinedIcon from "@mui/icons-material/RamenDiningOutlined";

export default function HomeGuestSection() {
  return (
    <main className="flex-1 p-6 pt-[68px] bg-gray-50">
      <div className="max-w-5xl mt-6 mx-auto text-center space-y-10">
        <h1 className="flex flex-wrap justify-center items-center gap-3 text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-16 text-center">
          Welcome to{" "}
          <span className="px-3 sm:px-4 py-1.5 sm:py-2 text-white bg-black dark:bg-white dark:text-black rounded-xl whitespace-nowrap shadow-md">
            💪 StayFit
          </span>
        </h1>

        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Build consistency in your fitness journey. Create training plans,
          analyze results and browse meals - all in one place.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4 sm:px-6">
          <Link href="/auth/sign-up">
            <Button size="lg" className="w-full sm:w-auto">
              Get Started
            </Button>
          </Link>
          <Link href="/auth/sign-in">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Sign In
            </Button>
          </Link>
          <Link href="/meals">
            <Button size="lg" variant="ghost" className="w-full sm:w-auto">
              Explore Meals
            </Button>
          </Link>
        </div>

        <section className="grid md:grid-cols-3 gap-6 mt-16 text-left">
          <HomeFeatureCard
            icon={FitnessCenterTwoToneIcon}
            title="Plan Your Trainings"
            description="Create personalized workout plans."
          />
          <HomeFeatureCard
            icon={SsidChartOutlinedIcon}
            title="Stay Consistent"
            description="Analyze your trainings and stay accountable to your goals."
          />
          <HomeFeatureCard
            icon={RamenDiningOutlinedIcon}
            title="Find Your Meals"
            description="Log your meals, explore others&rsquo; recipes, and favorite the best ones."
          />
        </section>
      </div>
    </main>
  );
}
