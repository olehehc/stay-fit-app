"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useExercises } from "@/hooks/useExercises";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import ExercisesSidebar from "@/components/trainings/exercises/exercises-sidebar";
import ExerciseCard from "@/components/trainings/exercises/exercise-card";
import CreateExerciseCard from "@/components/trainings/exercises/create-exercise-card";
import EditExerciseCard from "@/components/trainings/exercises/edit-exercise-card";
import TrainingTable from "@/components/trainings/training-table/training-table";
import DraggableRowPreview from "@/components/trainings/exercises/exercises-table/draggable-row-preview";
import DeleteConfirmDialog from "@/components/ui/delete-confirm-dialog";
import TrainingActionCard from "@/components/trainings/training-action-card";
import { saveTrainingAction } from "@/app/trainings/create-training/actions";
import ExercisesSheet from "../../../components/trainings/exercises/exercises-sheet";
import ExercisesList from "@/components/trainings/exercises/exercises-list";

function useIsDesktop(breakpoint = 1280) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia(`(min-width: ${breakpoint}px)`);
    const update = () => setIsDesktop(!!mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [breakpoint]);

  return isDesktop;
}

export default function CreateTrainingPage() {
  const isDesktop = useIsDesktop();
  const sheetRef = useRef();

  // Create Exercise Modal
  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);

  // Exercises Table
  const [reloadExercises, setReloadExercises] = useState(0);
  const { exercises, isLoadingExercises } = useExercises(reloadExercises);

  // Training Table
  const [droppedRows, setDroppedRows] = useState([]);
  const [activeRow, setActiveRow] = useState(null);

  // View Exercise
  const [exerciseToView, setExerciseToView] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  // Delete Exercise
  const [exerciseToDelete, setExerciseToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Edit Exercise
  const [editingExercise, setEditingExercise] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Draggable Row (desktop only)
  const [previewCellWidths, setPreviewCellWidths] = useState(null);
  const [previewTableWidth, setPreviewTableWidth] = useState(null);

  // Save Training
  const [isSaveTrainingModalOpen, setIsSaveTrainingModalOpen] = useState(false);

  function handleClose() {
    setIsExerciseModalOpen(false);
  }

  // Desktop DnD handlers (only used when isDesktop)
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
    } catch (err) {
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
          {
            ...exercise,
            sets: [
              { id: crypto.randomUUID(), reps: 10, rest_period: 1, weight: 0 },
            ],
          },
        ]);
      } else {
        toast.warning("This exercise is already added.");
      }
    }
  }

  function handleDragCancel() {
    setActiveRow(null);
    setPreviewCellWidths(null);
    setPreviewTableWidth(null);
  }

  function handleViewOpen(exercise) {
    setExerciseToView(exercise);
    setIsViewOpen(true);
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

      setReloadExercises((prev) => prev + 1);
      setDroppedRows((prev) =>
        prev.filter((e) => e.id !== exerciseToDelete.id)
      );
    } catch (err) {
      toast.error(
        "Error occurred while deleting. Reload page and try again later."
      );
    } finally {
      setIsDeleting(false);
      setExerciseToDelete(null);
    }
  }

  function deleteTrainingTableRowHandler(rowId) {
    setDroppedRows((prev) => prev.filter((row) => row.id !== rowId));
  }

  // Mobile: add exercise to training program (no drag)
  const addExerciseToTraining = useCallback(
    (exercise) => {
      if (!exercise || droppedRows.some((r) => r.id === exercise.id)) return;
      setDroppedRows((prev) => [
        ...prev,
        {
          ...exercise,
          sets: [
            { id: crypto.randomUUID(), reps: 10, rest_period: 1, weight: 0 },
          ],
        },
      ]);
      toast.success("The exercise has been added!");
    },
    [droppedRows]
  );

  // The main content area (shared between desktop & mobile)
  const mainContent = (
    <main className="flex-1 pt-[160px] md:pt-[92px] p-6 bg-gray-50">
      <div className="flex w-full gap-6">
        {/* Desktop sidebar */}
        <ExercisesSidebar
          exercises={exercises}
          isLoading={isLoadingExercises}
          onOpenCreate={() => setIsExerciseModalOpen(true)}
          onViewOpen={handleViewOpen}
          onEdit={handleEditOpen}
          onDelete={setExerciseToDelete}
          addedExercises={droppedRows}
        />

        {/* Content column */}
        <div className="w-full xl:w-[65%] ml-auto min-w-0">
          <div className="fixed top-[68px] md:static md:top-auto left-0 w-full z-50 bg-white md:bg-transparent items-center p-4 md:p-0 flex flex-row mb-6 justify-between shadow-md md:shadow-none">
            <ExercisesSheet
              ref={sheetRef}
              exercises={exercises}
              isLoading={isLoadingExercises}
              onAddToTraining={addExerciseToTraining}
              onOpenCreate={() => setIsExerciseModalOpen(true)}
              onView={handleViewOpen}
              onEdit={handleEditOpen}
              onDelete={setExerciseToDelete}
              addedExercises={droppedRows}
            />
            <Button
              onClick={() => setIsSaveTrainingModalOpen(true)}
              disabled={droppedRows.length === 0}
            >
              Save training
            </Button>
          </div>

          <div id="training-dropzone" className="hidden w-full md:block">
            <TrainingTable
              droppedRows={droppedRows}
              setDroppedRows={setDroppedRows}
              onDelete={deleteTrainingTableRowHandler}
              isDesktop={isDesktop}
            />
          </div>

          <div className="flex w-full md:hidden items-center justify-center">
            {droppedRows.length > 0 ? (
              <ExercisesList
                exercises={droppedRows}
                setExercises={setDroppedRows}
                onDelete={deleteTrainingTableRowHandler}
              />
            ) : (
              <p>Lack of exercises</p>
            )}
          </div>
        </div>
      </div>

      {isExerciseModalOpen && (
        <Modal onClose={handleClose}>
          <CreateExerciseCard
            onClose={handleClose}
            onSuccess={() => {
              setReloadExercises((prev) => prev + 1);
            }}
          />
        </Modal>
      )}

      {isViewOpen && exerciseToView && (
        <Modal
          onClose={() => {
            setIsViewOpen(false);
            setExerciseToView(null);
            !isDesktop && setTimeout(() => sheetRef.current?.open(), 80);
          }}
        >
          <ExerciseCard
            title={exerciseToView?.title}
            exerciseType={exerciseToView?.exercise_type}
            muscleGroup={exerciseToView?.muscle_group}
            instructions={exerciseToView?.instructions}
            image={exerciseToView?.image}
            onClose={() => {
              setIsViewOpen(false);
              setExerciseToView(null);
              !isDesktop && setTimeout(() => sheetRef.current?.open(), 80);
            }}
          />
        </Modal>
      )}

      {isEditOpen && editingExercise && (
        <Modal
          onClose={() => {
            setIsEditOpen(false);
            setEditingExercise(null);
            !isDesktop && setTimeout(() => sheetRef.current?.open(), 80);
          }}
        >
          <EditExerciseCard
            onClose={() => {
              setIsEditOpen(false);
              setEditingExercise(null);
              !isDesktop && setTimeout(() => sheetRef.current?.open(), 80);
            }}
            onSuccess={(updatedExercise) => {
              setReloadExercises((prev) => prev + 1);
              setDroppedRows((prev) =>
                prev.map((row) =>
                  row.id === updatedExercise.id
                    ? { ...row, ...updatedExercise }
                    : row
                )
              );
              !isDesktop && setTimeout(() => sheetRef.current?.open(), 80);
            }}
            initialData={editingExercise}
          />
        </Modal>
      )}

      {isSaveTrainingModalOpen && (
        <Modal onClose={() => setIsSaveTrainingModalOpen(false)}>
          <TrainingActionCard
            trainingData={droppedRows}
            onClose={() => setIsSaveTrainingModalOpen(false)}
            action={saveTrainingAction}
            cardTitle={"Save your training"}
            submitButtonTitle={"Save"}
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

      {isDesktop && (
        <DragOverlay dropAnimation={null}>
          {activeRow ? (
            <DraggableRowPreview
              row={activeRow}
              cellWidths={previewCellWidths}
              tableWidth={previewTableWidth}
            />
          ) : null}
        </DragOverlay>
      )}
    </main>
  );

  return isDesktop ? (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      {mainContent}
    </DndContext>
  ) : (
    mainContent
  );
}
