"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import LoadingDots from "@/components/ui/loading-dots";

export default function ExercisesSheet({
  exercises,
  isLoading,
  onAddToTraining,
  onOpenCreate,
  onView,
  onEdit,
  onDelete,
  addedExercises,
}) {
  function isAdded(currentExercise) {
    return addedExercises.find((exercise) => exercise.id === currentExercise);
  }

  return (
    <div className="xl:hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button>Open exercises</Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[70vh] overflow-auto">
              <SheetHeader>
                <SheetTitle>Exercises</SheetTitle>
              </SheetHeader>

              <div className="flex flex-col h-full justify-between p-4">
                {isLoading ? (
                  <LoadingDots />
                ) : exercises.length === 0 ? (
                  <>
                    <p className="text-sm text-muted-foreground">
                      No exercises yet
                    </p>
                    <Button
                      variant="ghost"
                      onClick={onOpenCreate}
                      aria-label="Add exercise"
                    >
                      Add
                    </Button>
                  </>
                ) : (
                  <ul className="space-y-4 w-full">
                    {exercises.map((ex) => (
                      <li key={ex.id}>
                        <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm px-6 py-5 sm:px-8 sm:py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-row gap-1 items-center">
                              <h2 className="font-semibold text-base sm:text-lg md:text-xl truncate">
                                {ex.title}
                              </h2>
                              <Button
                                variant="iconGhost"
                                size="icon"
                                onClick={() => onView(ex)}
                                aria-label={`Open ${ex.title} info`}
                                className="p-2 sm:p-1"
                              >
                                <InfoIcon fontSize="small" />
                              </Button>
                            </div>

                            <div className="mt-2 flex flex-wrap items-center text-sm text-gray-500">
                              <span className="mr-2">
                                Muscle: {ex.muscle_group}
                              </span>
                              <span className="mr-2">
                                Type: {ex.exercise_type}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-wrap sm:flex-nowrap justify-end gap-2 sm:gap-3 w-full sm:w-auto">
                            <Button
                              title="Add exercise"
                              variant="outline"
                              onClick={() => onAddToTraining(ex)}
                              className={`flex-1 sm:flex-none h-9 sm:h-10 px-4 sm:px-5 text-sm sm:text-base font-medium ${
                                isAdded(ex.id) ? "bg-green-200" : ""
                              }`}
                              disabled={isAdded(ex.id)}
                            >
                              {isAdded(ex.id) ? (
                                <DoneOutlinedIcon fontSize="small" />
                              ) : (
                                <AddOutlinedIcon fontSize="small" />
                              )}
                            </Button>

                            <Button
                              title="Edit exercise"
                              variant="outline"
                              onClick={() => onEdit(ex)}
                              className="flex-1 sm:flex-none h-9 sm:h-10 px-4 sm:px-5 text-sm sm:text-base font-medium"
                            >
                              <EditIcon fontSize="small" />
                            </Button>

                            <Button
                              title="Delete exercise"
                              variant="destructive"
                              onClick={() => onDelete(ex)}
                              className="flex-1 sm:flex-none h-9 sm:h-10 px-4 sm:px-5 text-sm sm:text-base font-medium"
                            >
                              <DeleteIcon fontSize="small" />
                            </Button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}
