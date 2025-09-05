"use client";

import { useState } from "react";
import MealItem from "./meal-item";
import MealsPagination from "./meals-pagination";

export default function MealsGrid({ meals }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const totalPages = Math.ceil(meals.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentMeals = meals.slice(startIndex, startIndex + itemsPerPage);

  return (
    <>
      <div className="w-full max-w-[1440px] mx-auto">
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 list-none p-0 m-0">
          {currentMeals.map((meal) => (
            <li key={meal.id}>
              <MealItem {...meal} />
            </li>
          ))}
        </ul>
      </div>

      <MealsPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </>
  );
}
