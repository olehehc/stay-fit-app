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
  TableCell,
} from "@/components/ui/table";
import { useDroppable } from "@dnd-kit/core";
import AddIcon from "@mui/icons-material/Add";

import TrainingTableRow from "./training-table-row";
import SetRow from "./training-table-set-row";
import getTrainingTableColumns from "./training-table-columns";
import LoadingDots from "@/components/ui/loading-dots";

export default function TrainingTable({
  droppedRows: rows = [],
  setDroppedRows,
  onDelete,
  isLoading = false,
  isDesktop,
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: "training-dropzone",
  });

  const columns = getTrainingTableColumns(setRowsWrapper, onDelete);

  function setRowsWrapper(updater) {
    if (typeof updater === "function") {
      setDroppedRows((prev) => updater(prev));
    } else {
      setDroppedRows(updater);
    }
  }

  function updateSet(exerciseId, setIndex, newValues) {
    setDroppedRows((prev) =>
      prev.map((row) =>
        row.id === exerciseId
          ? {
              ...row,
              sets: row.sets.map((s, i) =>
                i === setIndex ? { ...s, ...newValues } : s
              ),
            }
          : row
      )
    );
  }

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div
      ref={setNodeRef}
      className={`h-[70vh] rounded-md border shadow-md ${
        isOver ? "bg-blue-50" : ""
      }`}
    >
      <div className="h-full flex flex-col">
        <Table className="bg-white min-w-full table-fixed rounded-t-md overflow-hidden">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header, i) => (
                  <TableHead
                    key={header.id}
                    className="first:rounded-tl-md last:rounded-tr-md truncate whitespace-nowrap overflow-hidden"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
        </Table>
        <div
          className={`rounded-md flex-1 overflow-y-auto ${
            isOver ? "bg-blue-50" : "bg-white"
          }`}
        >
          {rows.length === 0 && !isLoading ? (
            <div className="h-full w-full flex flex-col items-center justify-center p-6">
              {isDesktop && (
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full border-2 border-dashed border-gray-200 bg-white/50">
                  <AddIcon />
                </div>
              )}
              <div className="text-lg font-medium text-foreground mb-1">
                {isDesktop ? "Drag an exercise here" : "Add an exercise"}
              </div>
            </div>
          ) : (
            <Table className="min-w-full table-fixed">
              <TableBody>
                {isLoading ? (
                  <TableRow className="h-full">
                    <TableCell className="text-center py-6">
                      <LoadingDots className="justify-center" />
                    </TableCell>
                  </TableRow>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <React.Fragment key={row.id}>
                      <TrainingTableRow row={row} />
                      {row.original.sets.map((setData, index) => (
                        <SetRow
                          className={`${isOver ? "bg-blue-50" : "bg-gray-100"}`}
                          key={`${row.id}-set-${index}`}
                          exerciseId={row.original.id}
                          setIndex={index}
                          setData={setData}
                          updateSet={updateSet}
                        />
                      ))}
                    </React.Fragment>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
}
