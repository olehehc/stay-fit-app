"use client";

import { useState } from "react";
import { toast } from "sonner";

import FavoriteIcon from "@mui/icons-material/Favorite";

export default function LikeButton() {
  const [isLiked, setIsLiked] = useState(false);

  function toggleLiked() {
    const next = !isLiked;
    setIsLiked(next);
    toast(next ? "Added to favorites." : "Removed from favorites.");
  }

  return (
    <button title="Favorite" onClick={toggleLiked}>
      <FavoriteIcon
        className={`w-5 h-5 ${isLiked ? "text-red-500" : "text-gray-400"}`}
      />
    </button>
  );
}
