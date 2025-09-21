import React from "react";
import { flexRender } from "@tanstack/react-table";
import { Table, TableBody, TableRow, TableCell } from "@/components/ui/table";

export default function DraggableRowPreview({
  row,
  cellWidths = null,
  tableWidth = null,
}) {
  if (!row) return null;

  return (
    <div
      className="pointer-events-none z-50"
      style={tableWidth ? { width: `${tableWidth}px` } : undefined}
    >
      <Table className="w-full">
        <TableBody>
          <TableRow className="bg-white shadow-lg">
            {row.getVisibleCells().map((cell, idx) => (
              <TableCell
                key={cell.id}
                style={
                  cellWidths && typeof cellWidths[idx] === "number"
                    ? { width: `${cellWidths[idx]}px` }
                    : undefined
                }
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
