import DeleteIcon from "@mui/icons-material/Delete";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

import { Button } from "@/components/ui/button";

export default function getTrainingTableColumns(setRows, onDelete) {
  return [
    { accessorKey: "title", header: "Title" },
    { accessorKey: "muscle_group", header: "Muscle Group" },
    { accessorKey: "exercise_type", header: "Exercise Type" },
    {
      accessorKey: "sets",
      header: "Sets",
      cell: ({ row }) => {
        const setsCount = Array.isArray(row.original.sets)
          ? row.original.sets.length
          : 0;

        function addSet() {
          setRows((prev) =>
            prev.map((r) =>
              r.id === row.original.id
                ? { ...r, sets: [...r.sets, { reps: 0, rest_period: 1 }] }
                : r
            )
          );
        }

        function removeSet() {
          setRows((prev) =>
            prev.map((r) =>
              r.id === row.original.id
                ? {
                    ...r,
                    sets: r.sets.slice(0, Math.max(r.sets.length - 1, 0)),
                  }
                : r
            )
          );
        }

        return (
          <div className="flex items-center border rounded-md overflow-hidden w-fit shadow-xs">
            <Button
              variant="ghost"
              size="icon"
              onClick={removeSet}
              disabled={setsCount <= 1}
            >
              <RemoveIcon fontSize="small" />
            </Button>

            <span className="px-3 min-w-[2rem] text-center">{setsCount}</span>

            <Button variant="ghost" size="icon" onClick={addSet}>
              <AddIcon fontSize="small" />
            </Button>
          </div>
        );
      },
    },
    {
      accessorKey: "reps",
      header: "Reps",
      cell: ({ row }) => <p>min-max</p>,
    },
    {
      accessorKey: "rest_period",
      header: "Rest",
      cell: ({ row }) => <p>min-max</p>,
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
