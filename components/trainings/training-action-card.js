"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LoadingDots from "@/components/ui/loading-dots";
import DatePicker from "../ui/date-picker";
import { XIcon } from "lucide-react";

export default function TrainingActionCard({
  trainingTitle,
  trainingDate,
  trainingData,
  onClose,
  action,
  cardTitle,
  submitButtonTitle,
}) {
  const router = useRouter();

  const [state, formAction, isPending] = useActionState(
    (prevState, formData) => action(trainingData, prevState, formData),
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
      <CardHeader className="flex items-center justify-between px-6 pb-0">
        <CardTitle>{cardTitle}</CardTitle>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-md text-muted-foreground opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
        >
          <XIcon className="size-4" />
        </button>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-6" noValidate action={formAction}>
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              type="text"
              defaultValue={state.data?.title || trainingTitle || ""}
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
              defaultValue={trainingDate}
              error={state.errors?.training_date && "border-destructive"}
            />
            {state.errors?.training_date && (
              <p className="text-xs text-destructive">
                {state.errors.training_date}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? <LoadingDots /> : submitButtonTitle}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
