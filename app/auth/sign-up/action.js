"use server";

import { redirect } from "next/navigation";
import { hash } from "bcryptjs";

import { createUser, getUserByEmail } from "@/lib/repository/users";
import {
  isNotEmpty,
  hasMinLength,
  isAtMostLength,
  hasLetter,
  hasNumber,
  hasSpecialChar,
  isEqual,
  isEmail,
} from "@/lib/validation";

export default async function signUpAction(prevState, formData) {
  const errors = {};

  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  if (!isNotEmpty(data.username)) {
    errors.username = "This field is required";
  } else if (!hasMinLength(data.username, 4)) {
    errors.username = "Username must be at least 4 characters";
  } else if (!isAtMostLength(data.username, 20)) {
    errors.username = "Username cannot exceed 20 characters";
  }

  if (!isNotEmpty(data.email)) {
    errors.email = "This field is required";
  } else if (!isEmail(data.email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!isNotEmpty(data.password)) {
    errors.password = ["This field is required"];
  } else {
    const passwordErrors = [];

    if (!hasMinLength(data.password, 8)) {
      passwordErrors.push("Password must be at least 8 characters long");
    }
    if (!hasLetter(data.password)) {
      passwordErrors.push("Password must contain at least one letter");
    }
    if (!hasNumber(data.password)) {
      passwordErrors.push("Password must contain at least one number");
    }
    if (!hasSpecialChar(data.password)) {
      passwordErrors.push(
        "Password must contain at least one special character"
      );
    }

    if (passwordErrors.length > 0) {
      errors.password = passwordErrors;
    }
  }

  if (!isNotEmpty(data.confirmPassword)) {
    errors.confirmPassword = "This field is required";
  } else if (!isEqual(data.password, data.confirmPassword)) {
    errors.confirmPassword = "Passwords do not match";
  }

  if (Object.keys(errors).length > 0) {
    return {
      ok: false,
      errors,
      data,
    };
  }

  const existingUser = getUserByEmail(data.email);
  if (existingUser) {
    return {
      ok: false,
      errors: { email: "User with this email already exists" },
      data,
    };
  }

  const hashedPassword = await hash(data.password, 10);

  createUser({
    username: data.username,
    email: data.email,
    password: hashedPassword,
  });

  return { ok: true };
}
