"use client";

import { useState, useEffect } from "react";

export function useExercises(reloadTrigger) {
  const [exercises, setExercises] = useState([]);
  const [isLoadingExercises, setIsLoadingExercises] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    async function load() {
      setIsLoadingExercises(true);
      try {
        const res = await fetch("/api/exercises", { signal });
        if (!res.ok) throw new Error("Failed to fetch exercises");
        const data = await res.json();
        setExercises(data);
      } catch (error) {
        if (error.name !== "AbortError") console.log(error);
      } finally {
        setIsLoadingExercises(false);
      }
    }

    load();
    return () => controller.abort();
  }, [reloadTrigger]);
  return { exercises, isLoadingExercises };
}
