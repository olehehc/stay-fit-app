"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import TextAreaWithCounter from "../../ui/text-area-with-counter";
import ImagePicker from "../../ui/image-picker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createExerciseAction,
  updateExerciseAction,
} from "@/app/trainings/create-training/actions";
import ExerciseTypeDropdown from "./exercise-type-dropdown";
import MuscleGroupDropdown from "./muscle-group-dropdown";
import LoadingDots from "@/components/ui/loading-dots";

export default function CreateExerciseCard({
  onClose,
  initialData,
  onSuccess,
}) {
  const isEditMode = Boolean(initialData);

  const [state, formAction, isPending] = useActionState(
    isEditMode ? updateExerciseAction : createExerciseAction,
    {
      errors: null,
      data: {},
    }
  );

  useEffect(() => {
    if (state.ok) {
      toast(
        isEditMode
          ? "Exercise has successfully been updated!"
          : "Exercise has successfully been created!"
      );
      onClose();
      if (onSuccess) onSuccess();
    }
  }, [state.ok, onClose, onSuccess, isEditMode]);

  const buttonText = isEditMode ? "Update Exercise" : "Create Exercise";

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>
          {isEditMode ? "Edit exercise" : "Add your exercise"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-6" noValidate action={formAction}>
          {isEditMode && (
            <input type="hidden" name="id" value={initialData.id} />
          )}

          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              type="text"
              defaultValue={initialData?.title || state.data?.title || ""}
              className={state.errors?.title && "border-destructive"}
            />
            {state.errors?.title && (
              <p className="text-xs text-destructive">{state.errors.title}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label>Exercise Type</Label>
              <ExerciseTypeDropdown
                name="exerciseType"
                defaultValue={
                  initialData?.exerciseType || state.data?.exerciseType
                }
                className={state.errors?.exerciseType && "border-destructive"}
              />
              {state.errors?.exerciseType && (
                <p className="text-xs text-destructive">
                  {state.errors.exerciseType}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label>Muscle Group</Label>
              <MuscleGroupDropdown
                name="muscleGroup"
                defaultValue={
                  initialData?.muscleGroup || state.data?.muscleGroup
                }
                className={state.errors?.muscleGroup && "border-destructive"}
              />
              {state.errors?.muscleGroup && (
                <p className="text-xs text-destructive">
                  {state.errors.muscleGroup}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="instructions">Instructions</Label>
            <TextAreaWithCounter
              state={state}
              maxChars={1000}
              maxVH={25}
              defaultValue={
                initialData?.instructions || state.data?.instructions || ""
              }
            >
              {state.errors?.instructions && (
                <p className="text-xs text-destructive">
                  {state.errors.instructions}
                </p>
              )}
            </TextAreaWithCounter>
          </div>

          <ImagePicker
            label="Image"
            name="image"
            error={state.errors?.image}
            defaultValue={initialData?.image}
          />

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? <LoadingDots /> : buttonText}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
