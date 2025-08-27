import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata = {
  title: "FitMeals",
  description: "A social platform for nutrition and workouts",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            className: "text-center flex justify-center",
          }}
        />
      </body>
    </html>
  );
}
