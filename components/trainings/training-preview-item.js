"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SportsScoreIcon from "@mui/icons-material/SportsScore";

export default function TrainingPreviewItem({ id, title, slug, completed }) {
  return (
    <li
      key={id}
      className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
    >
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{title}</p>
        {completed ? (
          <Badge className="text-xs font-medium text-green-800 bg-green-200 rounded-full">
            Completed
          </Badge>
        ) : (
          <Badge className="text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full">
            Pending
          </Badge>
        )}
      </div>

      <Link href={`/trainings/${slug}/session`}>
        <Button variant="outline" size="sm" title="Start training">
          {completed ? <SportsScoreIcon /> : <PlayArrowIcon />}
        </Button>
      </Link>
    </li>
  );
}
