import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import Navigation from "./navigation";

export default async function MainHeader() {
  const user = await getCurrentUser();

  return (
    <header className="flex p-4 fixed top-0 left-0 w-full z-50 bg-black justify-between">
      <Link href="/" className="text-white text-xl font-bold">
        💪 StayFit
      </Link>
      <Navigation user={user} />
    </header>
  );
}
