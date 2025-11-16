"use server";

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { revalidatePath } from "next/cache";

const JWT_SECRET = process.env.JWT_SECRET || "build-fallback-secret";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (e) {
    return null;
  }
}

export async function signOut(pathname) {
  const cookieStore = await cookies();
  cookieStore.delete("session_token", { path: "/" });
  revalidatePath(pathname);
  return { success: true };
}
