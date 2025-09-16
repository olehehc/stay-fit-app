export default function getTrainingTableColumns(setRows) {
  return [
    { accessorKey: "title", header: "Title" },
    { accessorKey: "muscle_group", header: "Muscle Group" },
    { accessorKey: "exercise_type", header: "Exercise Type" },
    {
      accessorKey: "sets",
      header: "Sets",
      cell: ({ row }) => (
        <input
          type="number"
          className="w-16 border rounded px-2"
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
        <input
          type="number"
          className="w-16 border rounded px-2"
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
  ];
}
