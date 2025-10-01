"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveTrainingAction } from "@/app/trainings/create-training/actions";
import LoadingDots from "@/components/ui/loading-dots";
import DatePicker from "../ui/date-picker";

export default function SaveTrainingCard({ trainingData, onClose }) {
  const router = useRouter();

  const [state, formAction, isPending] = useActionState(
    (prevState, formData) =>
      saveTrainingAction(trainingData, prevState, formData),
    {
      errors: null,
      data: {},
    }
  );

  useEffect(() => {
    if (state.ok) {
      toast("Training has successfully been created!");
      onClose();
      router.push("/trainings");
    }
  }, [state.ok, onClose, state.data, router]);

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Save your training</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-6" noValidate action={formAction}>
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              type="text"
              defaultValue={state.data?.title || ""}
              className={state.errors?.title && "border-destructive"}
            />
            {state.errors?.title && (
              <p className="text-xs text-destructive">{state.errors.title}</p>
            )}
          </div>

          <div className="grid gap-2">
            <DatePicker
              id="date"
              name="date"
              label="Training Date"
              error={state.errors?.training_date && "border-destructive"}
            />
            {state.errors?.training_date && (
              <p className="text-xs text-destructive">
                {state.errors.training_date}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? <LoadingDots /> : "Save"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
