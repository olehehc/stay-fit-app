"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

import TrainingsList from "@/components/trainings/trainings-list";
import { CalendarWithRangeSelection } from "@/components/ui/calendar-with-range-selection";
import { Button } from "@/components/ui/button";
import { SwitchWithLabel } from "@/components/ui/switch-with-label";
import LoadingDots from "@/components/ui/loading-dots";
import DeleteConfirmDialog from "@/components/ui/delete-confirm-dialog";
import { formatDateToYMD } from "@/lib/utils";

export default function TrainingsPage() {
  const [trainings, setTrainings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [trainingIdToDelete, setTrainingIdToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 6);

  const [dateRange, setDateRange] = useState(() => {
    return {
      from: today,
      to: nextWeek,
    };
  });

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const from = dateRange?.from ?? null;
    const to = dateRange?.to ?? null;

    async function loadTrainings() {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (from) {
          const dateFrom = formatDateToYMD(dateRange.from);
          params.append("dateFrom", dateFrom);
        }
        if (to) {
          const dateTo = formatDateToYMD(dateRange.to);
          params.append("dateTo", dateTo);
        }

        const res = await fetch(`/api/trainings?${params.toString()}`, {
          signal,
        });
        if (!res.ok) throw new Error("Fetch failed");
        const data = await res.json();
        setTrainings(data);
      } catch (err) {
        if (err.name !== "AbortError") console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    loadTrainings();
    return () => controller.abort();
  }, [dateRange]);

  function onDelete(trainingId) {
    setTrainingIdToDelete(trainingId);
  }

  async function handleDeleteConfirmed() {
    if (!trainingIdToDelete) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/trainings/${trainingIdToDelete}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");

      setTrainings((prev) =>
        prev.filter((training) => training.id !== trainingIdToDelete)
      );
    } catch (error) {
      console.log(error);
      alert("Error occurred while deleting. Reload page and try again later.");
    } finally {
      setIsDeleting(false);
      setTrainingIdToDelete(null);
    }
  }

  return (
    <main className="pt-[92px] p-6 bg-gray-50 flex-1 flex justify-center">
      <DeleteConfirmDialog
        title="Delete exercise?"
        description="This action cannot be undone. This will permanently delete the
                  exercise."
        open={!!trainingIdToDelete}
        onOpenChange={(open) => {
          if (!isDeleting && !open) setTrainingIdToDelete(null);
        }}
        onConfirm={handleDeleteConfirmed}
        isPending={isDeleting}
      />
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 items-stretch">
        <div className="flex-none flex flex-col min-h-0">
          <Button asChild className="mb-4 self-start w-auto">
            <Link href="/trainings/create-training">Add training</Link>
          </Button>
          <div className="flex-1 min-h-0 max-h-[calc(59vh-92px-1.5rem)] overflow-hidden min-w-[576px]">
            <div className="h-full overflow-y-auto">
              {isLoading ? (
                <div className="flex justify-center items-center h-full">
                  <LoadingDots />
                </div>
              ) : trainings.length === 0 ? (
                <p>Lack of Trainings</p>
              ) : (
                <TrainingsList trainings={trainings} onDelete={onDelete} />
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 items-start min-h-0">
          <SwitchWithLabel
            dateRange={dateRange}
            setDateRange={setDateRange}
            today={today}
            nextWeek={nextWeek}
          >
            Next 7 days
          </SwitchWithLabel>

          <div className="flex-1 min-h-0 max-h-[calc(100vh-92px-1.5rem)] overflow-hidden">
            <CalendarWithRangeSelection
              dateRange={dateRange}
              setDateRange={setDateRange}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
