"use client";

import { useState, useEffect } from "react";
import { DndContext, DragOverlay } from "@dnd-kit/core";

import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import CreateExerciseCard from "@/components/trainings/exercises/create-exercise-card";
import ExercisesTable from "@/components/trainings/exercises/exercises-table/exercises-table";
import { createExercisesTableColumns } from "@/components/trainings/exercises/exercises-table/exercises-table-columns";
import TrainingTable from "@/components/trainings/training-table/training-table";
import DraggableRowPreview from "@/components/trainings/exercises/exercises-table/draggable-row-preview";
import DeleteConfirmDialog from "@/components/ui/delete-confirm-dialog";

export default function CreateTrainingPage() {
  const [isOpen, setIsOpen] = useState(false);

  const [exercises, setExercises] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [droppedRows, setDroppedRows] = useState([]);
  const [activeRow, setActiveRow] = useState(null);

  const [exerciseToDelete, setExerciseToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState(null);

  const [reloadExercises, setReloadExercises] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    async function loadExercises() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/exercises", { signal });
        if (!res.ok) throw new Error("Fetch failed");
        const data = await res.json();
        setExercises(data);
      } catch (err) {
        if (err.name !== "AbortError") console.error(err);
      } finally {
        setIsLoading(false);
        setReloadExercises(false);
      }
    }

    loadExercises();
    return () => controller.abort();
  }, [reloadExercises]);

  function handleClose() {
    setIsOpen(false);
  }

  function handleDragStart(event) {
    setActiveRow(event.active.data.current?.row || null);
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    setActiveRow(null);

    if (over && over.id === "training-dropzone") {
      const exercise = exercises.find((e) => e.id.toString() === active.id);
      if (exercise && !droppedRows.some((r) => r.id === exercise.id)) {
        setDroppedRows((prev) => [...prev, exercise]);
      }
    }
  }

  function handleDragCancel() {
    setActiveRow(null);
  }

  function handleEditOpen(exercise) {
    setEditingExercise(exercise);
    setIsEditOpen(true);
  }

  async function handleDeleteConfirmed() {
    if (!exerciseToDelete) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/exercises/${exerciseToDelete.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");

      setExercises((p) => p.filter((e) => e.id !== exerciseToDelete.id));
    } catch (err) {
      console.error(err);
      alert("Error occurred while deleting. Reload page and try again later.");
    } finally {
      setExerciseToDelete(null);
      setIsDeleting(false);
    }
  }

  const columns = createExercisesTableColumns({
    onEditOpen: handleEditOpen,
    onDelete: (exercise) => setExerciseToDelete(exercise),
  });

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <main className="flex-1 pt-[92px] p-6 bg-gray-50">
        <Button className="mb-6" onClick={() => setIsOpen(true)}>
          Add new exercise
        </Button>

        {isOpen && (
          <Modal onClose={handleClose}>
            <CreateExerciseCard
              onClose={handleClose}
              onSuccess={() => setReloadExercises(true)}
            />
          </Modal>
        )}

        {isEditOpen && editingExercise && (
          <Modal
            onClose={() => {
              setIsEditOpen(false);
              setEditingExercise(null);
            }}
          >
            <CreateExerciseCard
              onClose={() => {
                setIsEditOpen(false);
                setEditingExercise(null);
              }}
              onSuccess={() => setReloadExercises(true)}
              initialData={editingExercise} // прокидываем данные для редактирования
            />
          </Modal>
        )}

        <DeleteConfirmDialog
          title="Delete exercise?"
          description="This action cannot be undone. This will permanently delete the
            exercise."
          open={!!exerciseToDelete}
          onOpenChange={(open) => !open && setExerciseToDelete(null)}
          onConfirm={handleDeleteConfirmed}
          isPending={isDeleting}
        />

        <div className="flex flex-row w-full justify-between">
          <ExercisesTable
            data={exercises}
            columns={columns}
            isLoading={isLoading}
          />
          <div id="training-dropzone" className="w-[60%]">
            <TrainingTable
              droppedRows={droppedRows}
              setDroppedRows={setDroppedRows}
            />
          </div>
        </div>

        <DragOverlay dropAnimation={null}>
          {activeRow ? <DraggableRowPreview row={activeRow} /> : null}
        </DragOverlay>
      </main>
    </DndContext>
  );
}
