import NavLink from "./nav-link";

export default function MainHeader() {
  return (
    <header className="bg-black p-4 flex justify-between items-center">
      <h1 className="text-white text-xl font-bold">💪 FitMeals</h1>
      <nav className="flex gap-4">
        <NavLink href="/">Home</NavLink>
        <NavLink href="/auth/sign-in">Sign In</NavLink>
        <NavLink href="/auth/sign-up">Sign Up</NavLink>
      </nav>
    </header>
  );
}
