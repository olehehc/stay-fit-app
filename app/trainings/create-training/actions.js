"use server";

import { getCurrentUser } from "@/lib/auth";
import {
  isNotEmpty,
  hasMinLength,
  isAtMostLength,
  isProvided,
  isAtLeastSize,
  isUnderSizeLimit,
} from "@/lib/validation";
import {
  saveExercise,
  updateExerciseByCreator,
} from "@/lib/repository/exercises";

export async function createExerciseAction(prevState, formData) {
  const user = await getCurrentUser();

  const errors = {};

  const data = {
    creator: user.username,
    creator_email: user.email,
    title: formData.get("title"),
    exercise_type: formData.get("exerciseType"),
    muscle_group: formData.get("muscleGroup"),
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

  if (!isNotEmpty(data.exercise_type)) {
    errors.exercise_type = "This field is required";
  }

  if (!isNotEmpty(data.muscle_group)) {
    errors.muscle_group = "This field is required";
  }

  if (!isNotEmpty(data.instructions)) {
    errors.instructions = "This field is required";
  } else if (!hasMinLength(data.instructions, 20)) {
    errors.instructions = "Instructions must be at least 20 characters";
  }

  const MAX_FILE_SIZE = 10 * 1024 * 1024;

  if (!isProvided(data.image)) {
    errors.image = "Image is required";
  } else if (!isAtLeastSize(data.image.size, 1)) {
    errors.image = "Image file is empty";
  } else if (!isUnderSizeLimit(data.image.size, MAX_FILE_SIZE)) {
    errors.image = "Image exceeds maximum size of 10MB";
  }

  if (Object.keys(errors).length > 0) {
    return {
      ok: false,
      errors,
      data,
    };
  }

  await saveExercise(data);

  return { ok: true };
}

export async function updateExerciseAction(prevState, formData, initialData) {
  const user = await getCurrentUser();
  const errors = {};

  const data = {
    id: formData.get("id"),
    creator: user.username,
    creator_email: user.email,
    title: formData.get("title"),
    exercise_type: formData.get("exerciseType"),
    muscle_group: formData.get("muscleGroup"),
    instructions: formData.get("instructions"),
    image: formData.get("image"),
  };

  if (!isNotEmpty(data.title)) {
    errors.title = "This field is required";
  } else if (!hasMinLength(data.title, 4)) {
    errors.title = "Title must be at least 4 characters";
  } else if (!isAtMostLength(data.title, 30)) {
    errors.title = "Title cannot exceed 30 characters";
  }

  if (!isNotEmpty(data.exercise_type)) {
    errors.exerciseType = "This field is required";
  }

  if (!isNotEmpty(data.muscle_group)) {
    errors.muscleGroup = "This field is required";
  }

  if (!isNotEmpty(data.instructions)) {
    errors.instructions = "This field is required";
  } else if (!hasMinLength(data.instructions, 20)) {
    errors.instructions = "Instructions must be at least 20 characters";
  }

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const imageChanged = formData.get("imageChanged") === "1";

  if (imageChanged) {
    if (!isProvided(data.image)) {
      errors.image = "Image is required";
    } else if (!isAtLeastSize(data.image.size, 1)) {
      errors.image = "Image file is empty";
    } else if (!isUnderSizeLimit(data.image.size, MAX_FILE_SIZE)) {
      errors.image = "Image exceeds maximum size of 10MB";
    }
  }

  if (Object.keys(errors).length > 0) {
    return {
      ok: false,
      errors,
      data,
    };
  }

  const payload = {
    ...data,
    imageToDelete: imageChanged ? initialData.image : undefined,
    image: imageChanged ? data.image : undefined,
  };

  const updated = await updateExerciseByCreator(data.id, user.email, payload);
  if (!updated) {
    return {
      ok: false,
      errors: { general: "Exercise not found or not yours" },
      data,
    };
  }

  return { ok: true, data: updated };
}
