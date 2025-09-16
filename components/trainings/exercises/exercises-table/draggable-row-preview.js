import React from "react";
import { flexRender } from "@tanstack/react-table";
import { Table, TableBody, TableRow, TableCell } from "@/components/ui/table";

export default function DraggableRowPreview({ row }) {
  if (!row) return null;

  return (
    <Table className="pointer-events-none z-50 border-collapse">
      <TableBody>
        <TableRow className="bg-white shadow-lg">
          {row.getVisibleCells().map((cell) => (
            <TableCell key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          ))}
        </TableRow>
      </TableBody>
    </Table>
  );
}
