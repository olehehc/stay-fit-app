"use server";

import { redirect } from "next/navigation";

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

export async function signUpAction(prevState, formData) {
  const errors = {};

  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  if (!isNotEmpty(data.username)) {
    errors.username = "Required field";
  } else if (!hasMinLength(data.username, 4)) {
    errors.username = "Username has to have at least 4 characters";
  } else if (!isAtMostLength(data.username, 20)) {
    errors.username = "Username has to have 20 characters max";
  }

  if (!isNotEmpty(data.email)) {
    errors.email = "Required field";
  } else if (!isEmail(data.email)) {
    errors.email = "Invalid email address";
  }

  if (!isNotEmpty(data.password)) {
    errors.password = ["Required field"];
  } else {
    const passwordErrors = [];

    if (!hasMinLength(data.password, 8)) {
      passwordErrors.push("At least 8 characters long");
    }
    if (!hasLetter(data.password)) {
      passwordErrors.push("At least one letter");
    }
    if (!hasNumber(data.password)) {
      passwordErrors.push("At least one number");
    }
    if (!hasSpecialChar(data.password)) {
      passwordErrors.push("At least one special character");
    }

    if (passwordErrors.length > 0) {
      errors.password = passwordErrors;
    }
  }

  if (!isNotEmpty(data.confirmPassword)) {
    errors.confirmPassword = "Required field";
  } else if (!isEqual(data.password, data.confirmPassword)) {
    errors.confirmPassword = "Passwords do not match";
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  redirect("/");
}
