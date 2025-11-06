"use client";

import DeleteIcon from "@mui/icons-material/Delete";
import DeleteConfirmDialog from "../ui/delete-confirm-dialog";
import { deleteMealByUser } from "@/lib/repository/meals";
import { useState } from "react";
import { toast } from "sonner";
import { getCurrentUser } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function DeleteMealButton({ mealId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  async function handleDeleteConfirmed() {
    try {
      setIsDeleting(true);
      const user = await getCurrentUser();
      await deleteMealByUser(mealId, user.id);
      router.refresh();
      toast("Meal has been deleted.");
    } catch (error) {
      toast(error?.message || "Error deleting meal");
    } finally {
      setIsDeleting(false);
      setIsOpen(false);
    }
  }

  return (
    <>
      <DeleteConfirmDialog
        title="Delete meal?"
        description="This action cannot be undone. This will permanently delete the meal."
        open={isOpen}
        onOpenChange={setIsOpen}
        onConfirm={handleDeleteConfirmed}
        isPending={isDeleting}
      />
      <button
        title="Delete"
        onClick={() => setIsOpen(true)}
        className="hover:text-gray-700"
      >
        <DeleteIcon />
      </button>
    </>
  );
}
