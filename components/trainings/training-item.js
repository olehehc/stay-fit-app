"use client";

import { useRouter } from "next/navigation";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button } from "../ui/button";

export default function TrainingItem({
  trainingSlug,
  title,
  trainingDate,
  onDelete,
}) {
  const router = useRouter();

  function handleEdit() {
    router.push(`/trainings/${trainingSlug}/edit`);
  }

  function handleSession() {
    router.push(`trainings/${trainingSlug}/session`);
  }

  return (
    <div className="bg-white w-full rounded-md border shadow-sm p-4 flex flex-row items-center justify-between w-xl">
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-gray-500">📅 {trainingDate}</p>
      </div>
      <div className="flex gap-2">
        <Button
          title="Start training"
          variant="outline"
          onClick={handleSession}
        >
          <PlayArrowIcon />
        </Button>
        <Button title="Edit training" variant="outline" onClick={handleEdit}>
          <EditIcon />
        </Button>
        <Button
          title="Delete training"
          variant="destructive"
          onClick={() => onDelete(trainingSlug)}
        >
          <DeleteIcon />
        </Button>
      </div>
    </div>
  );
}
