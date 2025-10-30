"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import TrainingItem from "./training-item";
import DeleteConfirmDialog from "../ui/delete-confirm-dialog";
import { deleteTrainingBySlug } from "@/lib/repository/trainings";
import { getCurrentUser } from "@/lib/auth";
import { toast } from "sonner";

export default function TrainingsList({ trainings }) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [trainingSlugToDelete, setTrainingSlugToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
      alert("Error occurred while deleting. Try again later."); // TODO replace default alert with custom alert
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

      <ul className="space-y-4">
        {trainings.map((training) => (
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
    </>
  );
}
