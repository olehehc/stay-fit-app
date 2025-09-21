import DeleteIcon from "@mui/icons-material/Delete";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function getTrainingTableColumns(setRows, onDelete) {
  return [
    { accessorKey: "title", header: "Title" },
    { accessorKey: "muscle_group", header: "Muscle Group" },
    { accessorKey: "exercise_type", header: "Exercise Type" },
    {
      accessorKey: "sets",
      header: "Sets",
      cell: ({ row }) => (
        <Input
          type="number"
          className="h-8 w-16"
          value={row.original.sets || ""}
          onChange={(e) => {
            const newValue = e.target.value;
            setRows((prev) =>
              prev.map((r) =>
                r.id === row.original.id ? { ...r, sets: newValue } : r
              )
            );
          }}
        />
      ),
    },
    {
      accessorKey: "reps",
      header: "Reps",
      cell: ({ row }) => (
        <Input
          type="number"
          className="h-8 w-16"
          value={row.original.reps || ""}
          onChange={(e) => {
            const newValue = e.target.value;
            setRows((prev) =>
              prev.map((r) =>
                r.id === row.original.id ? { ...r, reps: newValue } : r
              )
            );
          }}
        />
      ),
    },
    {
      accessorKey: "delete",
      header: "",
      cell: ({ row }) => (
        <Button
          title="Delete"
          className="h-8 w-16"
          onClick={() => onDelete(row.original.id)}
        >
          <DeleteIcon />
        </Button>
      ),
    },
  ];
}
