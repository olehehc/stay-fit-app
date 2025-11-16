import SetItem from "./set-item";

export default function SetsList({ exerciseId, sets, updateSet, onDeleteSet }) {
  return (
    <ul className="space-y-4">
      {sets.map((set) => (
        <li key={set.id}>
          <SetItem
            id={set.id}
            title={set.title}
            reps={set.reps}
            weight={set.weight}
            rest_period={set.rest_period}
            exerciseId={exerciseId}
            updateSet={updateSet}
            onDelete={onDeleteSet}
            setsNumber={sets.length}
          />
        </li>
      ))}
    </ul>
  );
}
