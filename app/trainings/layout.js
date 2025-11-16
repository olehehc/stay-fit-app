import "../globals.css";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default async function TrainingsLayout({ children }) {
  const user = await getCurrentUser();

  if (!user) {
    return redirect("/auth/sign-in");
  }

  return <section>{children}</section>;
}
