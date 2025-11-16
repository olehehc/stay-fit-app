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
    router.push(`/trainings/${trainingSlug}/session`);
  }

  return (
    <div
      className="
        w-full max-w-3xl mx-auto
        bg-white rounded-2xl border border-gray-200 shadow-sm
        px-6 py-5 sm:px-8 sm:py-6
        flex flex-col sm:flex-row sm:items-center sm:justify-between
        gap-4 sm:gap-6
      "
    >
      <div className="flex-1 min-w-0">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 break-words">
          {title}
        </h2>
        <div className="mt-2 flex flex-wrap items-center text-sm text-gray-500">
          <span className="mr-2">📅 {trainingDate}</span>
          {completed ? (
            <Badge className="px-2 py-0.5 text-xs font-medium text-green-800 bg-green-100 rounded-full">
              Completed
            </Badge>
          ) : (
            <Badge className="px-2 py-0.5 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full">
              Pending
            </Badge>
          )}
        </div>
      </div>

      <div
        className="
          flex flex-wrap sm:flex-nowrap justify-end gap-2 sm:gap-3
          w-full sm:w-auto
        "
      >
        <Button
          title={completed ? "See results" : "Start training"}
          variant="outline"
          onClick={handleSession}
          className="
            flex-1 sm:flex-none
            h-9 sm:h-10
            px-4 sm:px-5
            text-sm sm:text-base font-medium
          "
        >
          {completed ? (
            <SportsScoreIcon fontSize="small" />
          ) : (
            <PlayArrowIcon fontSize="small" />
          )}
        </Button>

        <Button
          title="Edit training"
          variant="outline"
          onClick={completed ? () => {} : handleEdit}
          className={`
            flex-1 sm:flex-none
            h-9 sm:h-10
            px-4 sm:px-5
            text-sm sm:text-base font-medium
            ${completed ? "cursor-not-allowed" : ""}
          `}
        >
          <EditIcon fontSize="small" />
        </Button>

        <Button
          title="Delete training"
          variant="destructive"
          onClick={() => onDelete(trainingSlug)}
          className="
            flex-1 sm:flex-none
            h-9 sm:h-10
            px-4 sm:px-5
            text-sm sm:text-base font-medium
          "
        >
          <DeleteIcon fontSize="small" />
        </Button>
      </div>
    </div>
  );
}
