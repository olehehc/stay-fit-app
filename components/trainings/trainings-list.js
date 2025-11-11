"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import TrainingItem from "./training-item";
import DeleteConfirmDialog from "../ui/delete-confirm-dialog";
import { deleteTrainingBySlug } from "@/lib/repository/trainings";
import { getCurrentUser } from "@/lib/auth";
import { toast } from "sonner";
import AppPagination from "../ui/app-pagination";

export default function TrainingsList({ trainings }) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [trainingSlugToDelete, setTrainingSlugToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 8;
  const totalPages = Math.ceil(trainings.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTrainings = trainings.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  async function handleDeleteConfirmed() {
    if (!trainingSlugToDelete) return;

    const user = await getCurrentUser();

    setIsDeleting(true);
    try {
      const deleteTraining = await deleteTrainingBySlug(
        trainingSlugToDelete,
        user.id
      );

      if (!deleteTraining) throw new Error("Delete failed");

      toast("Training has been deleted.");

      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      console.error(error);
      toast("Error occurred while deleting. Try again later.");
    } finally {
      setIsDeleting(false);
      setTrainingSlugToDelete(null);
    }
  }

  return (
    <>
      <DeleteConfirmDialog
        title="Delete exercise?"
        description="This action cannot be undone. This will permanently delete the exercise."
        open={!!trainingSlugToDelete}
        onOpenChange={(open) => {
          if (!isDeleting && !open) setTrainingSlugToDelete(null);
        }}
        onConfirm={handleDeleteConfirmed}
        isPending={isDeleting}
      />
      <div className="flex flex-col h-full justify-between">
        <ul className="space-y-4 w-full">
          {currentTrainings.map((training) => (
            <li key={training.id}>
              <TrainingItem
                trainingSlug={training.slug}
                trainingId={training.id}
                onDelete={setTrainingSlugToDelete}
                title={training.title}
                trainingDate={training.training_date}
                completed={training.completed}
              />
            </li>
          ))}
        </ul>

        <AppPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </>
  );
}
