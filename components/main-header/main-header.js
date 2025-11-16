import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import Navigation from "./navigation";
import MobileNavigation from "./mobile-navigation";

export default async function MainHeader() {
  const user = await getCurrentUser();

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black justify-between items-center">
      <div className="flex max-w-[1440px] mx-auto p-4 justify-between items-center">
        <Link href="/" className="text-white text-xl font-bold">
          💪 StayFit
        </Link>
        <div className="hidden md:flex">
          <Navigation user={user} />
        </div>
        <div className="md:hidden">
          <MobileNavigation user={user} />
        </div>
      </div>
    </header>
  );
}
