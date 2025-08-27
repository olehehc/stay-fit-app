"use server";

import { redirect } from "next/navigation";
import { compare } from "bcryptjs";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

import { getUserByEmail } from "@/lib/repository/users";
import { isNotEmpty, isEmail } from "@/lib/validation";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined in .env.local");

export default async function signInAction(prevState, formData) {
  const errors = {};
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  if (!isNotEmpty(data.email)) {
    errors.email = "This field is required.";
  } else if (!isEmail(data.email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!isNotEmpty(data.password)) {
    errors.password = "This field is required.";
  }

  if (Object.keys(errors).length > 0) {
    return {
      ok: false,
      errors,
      data,
    };
  }

  const user = getUserByEmail(data.email);

  if (!user) {
    return {
      ok: false,
      errors: {
        email: "Login or password is invalid.",
        password: "Login or password is invalid.",
      },
      data,
    };
  }

  const isPasswordValid = await compare(data.password, user.password);
  if (!isPasswordValid) {
    return {
      ok: false,
      errors: {
        email: "Login or password is invalid.",
        password: "Login or password is invalid.",
      },
      data,
    };
  }

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "1h",
  });

  const cookieStore = await cookies();

  cookieStore.set("session_token", token, {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60,
  });

  redirect("/");
}
