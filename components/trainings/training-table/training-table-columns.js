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
                    sets: [...r.sets, { reps: 10, weight: 0, rest_period: 1 }],
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
      cell: ({ row }) => {
        const sets = row.original.sets || [];
        if (sets.length === 0) return null;

        const repsValues = sets.map((set) => set.reps);
        const sum = repsValues.reduce((acc, val) => acc + val, 0);

        return <span>{sum}</span>;
      },
    },
    {
      accessorKey: "weight",
      header: "Weight",
      cell: ({ row }) => {
        const sets = row.original.sets || [];
        if (sets.length === 0) return null;

        const volume = sets.reduce(
          (acc, set) => acc + set.reps * set.weight,
          0
        );
        return <span>{volume} kg</span>;
      },
    },
    {
      accessorKey: "rest_period",
      header: "Rest",
      cell: ({ row }) => {
        const sets = row.original.sets || [];
        if (sets.length === 0) return null;

        const restPeriodValues = sets.map((set) => set.rest_period);
        const sum = restPeriodValues.reduce((acc, val) => acc + val, 0);

        return <span>{sum} min</span>;
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
