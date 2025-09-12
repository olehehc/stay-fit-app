"use client";

import { useState } from "react";
import { toast } from "sonner";

import FavoriteIcon from "@mui/icons-material/Favorite";

export default function FavoriteButton() {
  const [isFavorited, setIsFavorited] = useState(false);

  function toggleFavorite() {
    const next = !isFavorited;
    setIsFavorited(next);
    toast(next ? "Added to favorites." : "Removed from favorites.");
  }

  return (
    <button title="Favorite" onClick={toggleFavorite}>
      <FavoriteIcon
        className={`w-5 h-5 ${isFavorited ? "text-red-500" : "text-gray-400"}`}
      />
    </button>
  );
}
