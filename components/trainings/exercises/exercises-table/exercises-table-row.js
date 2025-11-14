import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { TableRow, TableCell } from "@/components/ui/table";
import { flexRender } from "@tanstack/react-table";

export default function ExercisesTableRow({ row, className }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: row.original.id.toString(),
    data: { row },
  });

  return (
    <TableRow
      ref={setNodeRef}
      data-row-id={row.original.id.toString()}
      {...attributes}
      {...listeners}
      className={`cursor-grab select-none ${
        isDragging ? "opacity-50" : ""
      } ${className}`}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell
          key={cell.id}
          className="truncate whitespace-nowrap overflow-hidden"
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}
