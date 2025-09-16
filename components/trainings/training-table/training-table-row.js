import { TableRow, TableCell } from "@/components/ui/table";
import { flexRender } from "@tanstack/react-table";

export default function TrainingTableRow({ row }) {
  return (
    <TableRow key={row.id}>
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}
