"use client";

import { useRouter } from "next/navigation";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SportsScoreIcon from "@mui/icons-material/SportsScore";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

export default function TrainingItem({
  trainingSlug,
  title,
  trainingDate,
  completed = false,
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
    <div className="w-full rounded-md border shadow-sm p-4 flex flex-row items-center justify-between w-xl">
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-gray-500">
          📅 {trainingDate}{" "}
          {completed ? (
            <Badge className="ml-2 px-2 py-0.5 text-xs font-medium text-green-800 bg-green-200 rounded-full">
              Completed
            </Badge>
          ) : (
            <Badge className="ml-2 px-2 py-0.5 text-xs font-medium text-gray-800 bg-gray-200 rounded-full">
              Pending
            </Badge>
          )}
        </p>
      </div>
      <div className="flex gap-2">
        <Button
          title={completed ? "See results" : "Start training"}
          variant="outline"
          onClick={handleSession}
        >
          {completed ? <SportsScoreIcon /> : <PlayArrowIcon />}
        </Button>

        <Button
          title="Edit training"
          variant="outline"
          onClick={handleEdit}
          disabled={completed}
        >
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
