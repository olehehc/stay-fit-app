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
                ? {
                    ...r,
                    sets: [
                      ...r.sets,
                      {
                        id: crypto.randomUUID(),
                        reps: 10,
                        weight: 0,
                        rest_period: 1,
                      },
                    ],
                  }
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
          <div className="flex items-center border rounded-md overflow-hidden w-fit h-8 shadow-xs">
            <Button
              variant="ghost"
              size="icon"
              onClick={removeSet}
              disabled={setsCount <= 1}
            >
              <RemoveIcon fontSize="small" />
            </Button>
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
      cell: ({ row }) => {
        const sets = row.original.sets || [];
        if (sets.length === 0) return null;

        const repsValues = sets.map((set) => Number(set.reps));
        const sum = repsValues.reduce((acc, val) => acc + val, 0);

        return (
          <div className="relative w-20 min-w-0">
            <span className="px-3 block max-w-[80px] truncate">{sum}</span>
            <span className="absolute inset-y-0 right-2 flex items-center text-sm pointer-events-none"></span>
          </div>
        );
      },
    },
    {
      accessorKey: "weight",
      header: "Weight",
      cell: ({ row }) => {
        const sets = row.original.sets || [];
        if (sets.length === 0) return null;

        const volume = sets.reduce(
          (acc, set) => acc + Number(set.reps) * Number(set.weight),
          0
        );
        return (
          <div className="relative w-20 min-w-0">
            <span className="px-3 block max-w-[80px] truncate">
              {Math.round(volume * 10) / 10}
            </span>
            <span className="absolute inset-y-0 right-2 flex items-center text-sm pointer-events-none">
              kg
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "rest_period",
      header: "Rest",
      cell: ({ row }) => {
        const sets = row.original.sets || [];
        if (sets.length === 0) return null;

        const restPeriodValues = sets.map((set) => Number(set.rest_period));
        const sum = restPeriodValues.reduce((acc, val) => acc + val, 0);

        return (
          <div className="relative w-20 min-w-0">
            <span className="px-3 block max-w-[80px] truncate">{sum}</span>
            <span className="absolute inset-y-0 right-2 flex items-center text-sm pointer-events-none">
              min
            </span>
          </div>
        );
      },
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
