import MainHeader from "@/components/main-header/main-header";
import NavLink from "@/components/main-header/nav-link";
import "../globals.css";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <MainHeader>
        <NavLink href="/">Home</NavLink>
      </MainHeader>
      <main className="flex-1 flex items-center justify-center bg-gray-50">
        {children}
      </main>
    </div>
  );
}
