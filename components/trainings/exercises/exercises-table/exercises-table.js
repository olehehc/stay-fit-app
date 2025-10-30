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

import ExercisesTableRow from "./exercises-table-row";
import LoadingDots from "@/components/ui/loading-dots";

export default function ExercisesTable({ columns, data, isLoading = false }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const headerColsCount =
    table.getHeaderGroups()[0]?.headers.length ?? columns.length;

  return (
    <div className="bg-white w-full h-[70vh] rounded-md border shadow-md">
      <div className="h-full flex flex-col">
        <Table className="min-w-full table-fixed rounded-t-md overflow-hidden">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="first:rounded-tl-md last:rounded-tr-md sticky top-0 z-10 whitespace-normal break-words"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
        </Table>
        <div className="flex-1 overflow-y-auto">
          <Table className="min-w-full table-fixed">
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={headerColsCount}
                    className="text-center py-6"
                  >
                    <LoadingDots className="justify-center" />
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows.length ? (
                table
                  .getRowModel()
                  .rows.map((row) => (
                    <ExercisesTableRow key={row.id} row={row} />
                  ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={headerColsCount}
                    className="text-center py-6"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
