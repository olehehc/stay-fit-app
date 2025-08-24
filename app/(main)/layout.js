import "./globals.css";
import MainHeader from "@/components/main-header/main-header";

export const metadata = {
  title: "FitMeals",
  description: "A social platform for nutrition and workouts",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <MainHeader />
        <main className="flex-1 p-6 bg-gray-50">{children}</main>
        <footer className="bg-gray-200 p-4 text-center">
          © 2025 FitMeals. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
