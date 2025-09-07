"use server";

import { getCurrentUser } from "@/lib/auth";
import { isNotEmpty, hasMinLength, isAtMostLength } from "@/lib/validation";
import { saveMeal } from "@/lib/repository/meals";

export default async function shareMealAction(prevState, formData) {
  const user = await getCurrentUser();

  console.log(user);

  const errors = {};

  const data = {
    creator: user.username,
    creator_email: user.email,
    title: formData.get("title"),
    calories: formData.get("calories"),
    protein: formData.get("protein"),
    instructions: formData.get("instructions"),
    image: formData.get("image"),
  };

  if (!isNotEmpty(data.title)) {
    errors.title = "This field is required";
  } else if (!hasMinLength(data.title, 4)) {
    errors.title = "Username must be at least 4 characters";
  } else if (!isAtMostLength(data.title, 30)) {
    errors.title = "Username cannot exceed 30 characters";
  }

  if (!isNotEmpty(data.calories)) {
    errors.calories = "This field is required";
  }

  if (!isNotEmpty(data.protein)) {
    errors.protein = "This field is required";
  }

  if (!isNotEmpty(data.instructions)) {
    errors.instructions = "This field is required";
  } else if (!hasMinLength(data.instructions, 20)) {
    errors.instructions = "Instructions must be at least 20 characters";
  }

  if (!data.image) {
    errors.image = "Image is required";
  } else if (data.image.size === 0) {
    errors.image = "Image file is empty";
  }

  if (Object.keys(errors).length > 0) {
    return {
      ok: false,
      errors,
      data,
    };
  }

  await saveMeal(data);
  return { ok: true };
}
