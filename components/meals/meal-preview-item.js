"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import RamenDiningOutlinedIcon from "@mui/icons-material/RamenDiningOutlined";

export default function MealPreviewItem({ id, image, title, username, slug }) {
  return (
    <li
      key={id}
      className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
    >
      {image ? (
        <Image
          src={`https://s3.eu-north-1.amazonaws.com/${process.env.NEXT_PUBLIC_AWS_IMAGE_HOSTNAME}/${image}`}
          alt={title}
          width={48}
          height={48}
          className="rounded-md object-cover"
        />
      ) : (
        <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center text-gray-400">
          <RamenDiningOutlinedIcon />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{title}</p>
        <p className="text-sm text-gray-500 truncate">
          {username ? `by ${username}` : "Unknown"}
        </p>
      </div>

      <Link href={`/meals/${slug}`}>
        <Button variant="outline" size="sm">
          View
        </Button>
      </Link>
    </li>
  );
}
