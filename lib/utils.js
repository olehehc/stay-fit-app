import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getPageNumbers(currentPage, totalPages) {
  const pages = [];

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
    return pages;
  }

  pages.push(1);

  if (currentPage <= 4) {
    for (let i = 2; i <= 5; i++) pages.push(i);
    pages.push("ellipsis-right");
  } else if (currentPage >= totalPages - 3) {
    pages.push("ellipsis-left");
    for (let i = totalPages - 4; i <= totalPages - 1; i++) pages.push(i);
  } else {
    pages.push("ellipsis-left");
    pages.push(currentPage - 1);
    pages.push(currentPage);
    pages.push(currentPage + 1);
    pages.push("ellipsis-right");
  }

  pages.push(totalPages);

  return pages;
}

export function formatDateToYMD(date) {
  if (!date) return;

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
}

export function prepareSetsRepsChartData(title, description, data) {
  let setCounter = 1;

  const setsArray = Array.isArray(data)
    ? data.flatMap((exercise) => exercise.sets)
    : data.sets;

  const chartData = setsArray.map((set) => ({
    set: setCounter++,
    "Planned reps": set.reps,
    "Actual reps": set.performed.actual_reps,
  }));

  return { title, description, chartData };
}

export function prepareSetsRestsChartData(title, description, data) {
  let setCounter = 1;

  const setsArray = Array.isArray(data)
    ? data.flatMap((exercise) => exercise.sets)
    : data.sets;

  const chartData = setsArray.map((set) => ({
    set: setCounter++,
    "Planned rest time": set.rest_period,
    "Actual rest time": set.performed.actual_rest_period,
  }));

  return { title, description, chartData };
}

export function prepareStrengthSetsWeightsChartData(title, description, data) {
  let setCounter = 1;

  const chartData = Array.isArray(data)
    ? data.flatMap((exercise) =>
        exercise.exercise_type === "Strength"
          ? exercise.sets.map((set) => ({
              set: setCounter++,
              "Planned weight": set.weight,
              "Actual weight": set.performed.actual_weight,
            }))
          : []
      )
    : data.exercise_type === "Strength"
    ? data.sets.map((set) => ({
        set: setCounter++,
        "Planned weight": set.weight,
        "Actual weight": set.performed.actual_weight,
      }))
    : [];

  return { title, description, chartData };
}
