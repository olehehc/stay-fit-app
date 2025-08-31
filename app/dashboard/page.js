import { getCurrentUser } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <p>
        You are not signed in. <a href="/auth/sign-in">Sign In</a>
      </p>
    );
  }

  return (
    <main className="flex-1 flex items-center justify-center p-6 bg-gray-50">
      <h1>Welcome, {user.email}!</h1>
      <p>User ID: {user.id}</p>
    </main>
  );
}
