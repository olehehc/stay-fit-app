import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
} from "@/components/ui/table";
import { useDroppable } from "@dnd-kit/core";

import TrainingTableRow from "./training-table-row";
import getTrainingTableColumns from "./training-table-columns";

export default function TrainingTable({
  droppedRows = [],
  setDroppedRows,
  onDelete,
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: "training-dropzone",
  });

  const rows = droppedRows;

  const columns = getTrainingTableColumns(setRowsWrapper, onDelete);

  function setRowsWrapper(updater) {
    if (typeof updater === "function") {
      setDroppedRows((prev) => {
        const next = updater(prev);
        return next;
      });
    } else {
      setDroppedRows(updater);
    }
  }

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div
      ref={setNodeRef}
      className={`h-[70vh] overflow-hidden rounded-md border ${
        isOver ? "bg-blue-50" : ""
      }`}
    >
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TrainingTableRow key={row.id} row={row} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
