"use client";

import { useParams } from "next/navigation";
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
import TrainingActionCard from "@/components/trainings/training-action-card";
import { updateTrainingAction } from "./actions";
import LoadingDots from "@/components/ui/loading-dots";

export default function EditTrainingPage() {
  const { trainingSlug } = useParams();

  const [trainingData, setTrainingData] = useState({});
  const [droppedRows, setDroppedRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const [exercises, setExercises] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reloadExercises, setReloadExercises] = useState(false);

  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);
  const [activeRow, setActiveRow] = useState(null);
  const [previewCellWidths, setPreviewCellWidths] = useState(null);
  const [previewTableWidth, setPreviewTableWidth] = useState(null);

  const [exerciseToDelete, setExerciseToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState(null);

  const [isSaveTrainingModalOpen, setIsSaveTrainingModalOpen] = useState(false);

  useEffect(() => {
    if (!trainingSlug) return;

    const controller = new AbortController();
    const signal = controller.signal;

    async function loadTraining() {
      setLoading(true);
      try {
        const res = await fetch(`/api/trainings/${trainingSlug}`, { signal });
        if (!res.ok) throw new Error("Fetch failed");
        const data = await res.json();

        setDroppedRows(data.exercises);
        setTrainingData({
          slug: trainingSlug,
          title: data.title,
          trainingDate: data.training_date,
          training: data.exercises,
        });
      } catch (error) {
        if (error.name !== "AbortError") console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadTraining();
    return () => controller.abort();
  }, [trainingSlug]);

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
    setIsExerciseModalOpen(false);
  }

  function handleDragStart(event) {
    const row = event.active.data.current?.row || null;
    setActiveRow(row);

    try {
      const tr = document.querySelector(`[data-row-id="${event.active.id}"]`);
      if (tr) {
        const cells = Array.from(tr.children);
        const widths = cells.map((c) =>
          Math.round(c.getBoundingClientRect().width)
        );
        setPreviewCellWidths(widths);

        const table = tr.closest("table");
        if (table) {
          setPreviewTableWidth(Math.round(table.getBoundingClientRect().width));
        } else {
          setPreviewTableWidth(null);
        }
      } else {
        setPreviewCellWidths(null);
        setPreviewTableWidth(null);
      }
    } catch {
      setPreviewCellWidths(null);
      setPreviewTableWidth(null);
    }
  }

  function handleDragEnd(event) {
    const { active, over } = event;

    setActiveRow(null);
    setPreviewCellWidths(null);
    setPreviewTableWidth(null);

    if (over && over.id === "training-dropzone") {
      const exercise = exercises.find((e) => e.id.toString() === active.id);
      if (exercise && !droppedRows.some((r) => r.id === exercise.id)) {
        setDroppedRows((prev) => [
          ...prev,
          { ...exercise, sets: [{ reps: 10, rest_period: 1, weight: 0 }] },
        ]);
      }
    }
  }

  function handleDragCancel() {
    setActiveRow(null);
    setPreviewCellWidths(null);
    setPreviewTableWidth(null);
  }

  async function handleDeleteConfirmed() {
    if (!exerciseToDelete) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/exercises/${exerciseToDelete.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");

      setExercises((prev) => prev.filter((e) => e.id !== exerciseToDelete.id));
      setDroppedRows((prev) =>
        prev.filter((e) => e.id !== exerciseToDelete.id)
      );
    } catch (err) {
      console.error(err);
      alert("Error occurred while deleting. Reload page and try again later.");
    } finally {
      setIsDeleting(false);
      setExerciseToDelete(null);
    }
  }

  function deleteTrainingTableRowHandler(rowId) {
    setDroppedRows((prev) => prev.filter((row) => row.id !== rowId));
  }

  const exercisesTableColumns = createExercisesTableColumns({
    onEditOpen: (exercise) => {
      setEditingExercise(exercise);
      setIsEditOpen(true);
    },
    onDelete: (exercise) => setExerciseToDelete(exercise),
  });

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <main className="flex-1 pt-[92px] p-6 bg-gray-50">
        <div className="flex w-full gap-6">
          <div className="w-[30%] min-w-0">
            <div className="mb-6">
              <Button onClick={() => setIsExerciseModalOpen(true)}>
                Add new exercise
              </Button>
            </div>
            <ExercisesTable
              data={exercises}
              columns={exercisesTableColumns}
              isLoading={isLoading}
            />
          </div>

          <div className="w-[60%] ml-auto min-w-0">
            <div className="mb-6">
              <Button
                onClick={() => setIsSaveTrainingModalOpen(true)}
                disabled={droppedRows.length === 0}
              >
                Update training
              </Button>
            </div>
            <div id="training-dropzone" className="w-full">
              <TrainingTable
                droppedRows={droppedRows}
                setDroppedRows={setDroppedRows}
                onDelete={deleteTrainingTableRowHandler}
                loading={loading}
              />
            </div>
          </div>
        </div>

        {/* Modals & dialogs */}
        {isExerciseModalOpen && (
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
              onSuccess={(updatedExercise) => {
                setReloadExercises(true);
                setDroppedRows((prev) =>
                  prev.map((row) =>
                    row.id === updatedExercise.id
                      ? { ...row, ...updatedExercise }
                      : row
                  )
                );
              }}
              initialData={editingExercise}
            />
          </Modal>
        )}

        {isSaveTrainingModalOpen && (
          <Modal onClose={() => setIsSaveTrainingModalOpen(false)}>
            <TrainingActionCard
              trainingTitle={trainingData.title}
              trainingDate={trainingData.trainingDate}
              trainingData={trainingData}
              onClose={() => setIsSaveTrainingModalOpen(false)}
              action={updateTrainingAction}
              cardTitle="Update your training"
              submitButtonTitle="Update"
            />
          </Modal>
        )}

        <DeleteConfirmDialog
          title="Delete exercise?"
          description="This action cannot be undone. This will permanently delete the exercise."
          open={!!exerciseToDelete}
          onOpenChange={(open) => !open && setExerciseToDelete(null)}
          onConfirm={handleDeleteConfirmed}
          isPending={isDeleting}
        />

        <DragOverlay dropAnimation={null}>
          {activeRow ? (
            <DraggableRowPreview
              row={activeRow}
              cellWidths={previewCellWidths}
              tableWidth={previewTableWidth}
            />
          ) : null}
        </DragOverlay>
      </main>
    </DndContext>
  );
}
