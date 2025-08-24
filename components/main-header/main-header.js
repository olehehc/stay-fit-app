export default function MainHeader({ children }) {
  return (
    <header className="bg-black p-4 flex justify-between items-center">
      <h1 className="text-white text-xl font-bold">💪 FitMeals</h1>
      <nav className="flex gap-4">{children}</nav>
    </header>
  );
}
