import "../globals.css";
import MainHeader from "@/components/main-header/main-header";
import NavLink from "@/components/main-header/nav-link";

export const metadata = {
  title: "FitMeals",
  description: "A social platform for nutrition and workouts",
};

export default function MainLayout({ children }) {
  return (
    <>
      <MainHeader>
        <NavLink href="/">Home</NavLink>
        <NavLink href="/auth/sign-in">Sign In</NavLink>
      </MainHeader>
      <main className="flex-1 p-6 bg-gray-50">{children}</main>
      <footer className="bg-gray-200 p-4 text-center">
        © 2025 FitMeals. All rights reserved.
      </footer>
    </>
  );
}
