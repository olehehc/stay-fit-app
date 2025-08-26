import "./globals.css";

export const metadata = {
  title: "FitMeals",
  description: "A social platform for nutrition and workouts",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
