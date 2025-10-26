import TrainingSession from "@/components/sessions/trainings/training-session";
import { getCurrentUser } from "@/lib/auth";
import { getTrainingAndTrainingSetsByUserAndTrainingId } from "@/lib/repository/trainings";

export default async function TrainingSessionPage({ searchParams }) {
  const query = await searchParams;
  const trainingIdStr = query?.trainingId;
  const trainingId = trainingIdStr ? parseInt(trainingIdStr, 10) : null;

  if (!trainingId) {
    throw new Error("Invalid training ID");
  }

  const user = await getCurrentUser();

  const trainingData = getTrainingAndTrainingSetsByUserAndTrainingId(
    trainingId,
    user.id
  );

  if (!trainingData) {
    throw new Error("Training not found");
  }

  return (
    <main className="flex flex-col items-center justify-start pt-[92px] p-6 bg-gray-50 flex-1">
      {trainingData.completed ? (
        <p>Training Results</p>
      ) : (
        <TrainingSession training={trainingData} userId={user.id} />
      )}
    </main>
  );
}
