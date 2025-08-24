import "../globals.css";

export default function AuthLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <main className="flex items-center justify-center min-h-screen bg-gray-50">
          {children}
        </main>
      </body>
    </html>
  );
}
