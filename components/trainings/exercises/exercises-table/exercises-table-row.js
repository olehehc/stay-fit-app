import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { TableRow, TableCell } from "@/components/ui/table";
import { flexRender } from "@tanstack/react-table";

export default function ExercisesTableRow({ row }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: row.original.id.toString(),
    data: { row },
  });

  return (
    <TableRow
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`cursor-grab select-none ${isDragging ? "opacity-50" : ""}`}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}
