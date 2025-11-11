"use client";

import { useState } from "react";

import MealItem from "./meal-item";
import AppPagination from "../ui/app-pagination";

export default function MealsGrid({ meals, currentUserId }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const totalPages = Math.ceil(meals.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentMeals = meals.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 list-none p-0 m-0">
        {currentMeals.map((meal) => (
          <li key={meal.id}>
            <MealItem {...meal} currentUserId={currentUserId} />
          </li>
        ))}
      </ul>

      <AppPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
