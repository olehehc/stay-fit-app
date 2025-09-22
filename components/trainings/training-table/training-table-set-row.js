import { TableRow, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";

export default function SetRow({ exerciseId, setIndex, setData, updateSet }) {
  const { reps, rest_period } = setData;

  return (
    <TableRow key={`${exerciseId}-set-${setIndex}`}>
      <TableCell>Set {setIndex + 1}</TableCell>
      <TableCell></TableCell>
      <TableCell></TableCell>
      <TableCell></TableCell>
      <TableCell>
        <Input
          type="number"
          value={reps}
          min={1}
          max={50}
          className="h-8 w-16"
          onChange={(e) =>
            updateSet(exerciseId, setIndex, { reps: Number(e.target.value) })
          }
        />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <Input
            type="number"
            value={rest_period}
            min={0}
            step={0.5}
            className="h-8 w-16"
            onChange={(e) =>
              updateSet(exerciseId, setIndex, {
                rest_period: Number(e.target.value),
              })
            }
          />
          <span className="text-sm text-muted-foreground">min</span>
        </div>
      </TableCell>
      <TableCell></TableCell>
    </TableRow>
  );
}
