import SetItem from "./set-item";

export default function SetsList({ sets, exerciseId, toggleComplete, updateSet }) {
  return (
    <ul className="space-y-4">
      {sets.map((set, index) => (
        <li key={set.id}>
          <SetItem
            setId={set.id}
            title={set.title}
            reps={set.reps}
            weight={set.weight}
            rest_period={set.rest_period}
            completed={set.completed}
            exerciseId={exerciseId}
            toggleComplete={toggleComplete}
            updateSet={updateSet}
          />
        </li>
      ))}
    </ul>
  );
}
