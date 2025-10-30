import TrainingSession from "@/components/sessions/trainings/training-session";
import TrainingSessionResults from "@/components/sessions/trainings/training-session-results";
import { getCurrentUser } from "@/lib/auth";
import { getTrainingAndTrainingSetsBySlug } from "@/lib/repository/trainings";
import { getTrainingSessionBySlug } from "@/lib/repository/sessions";

export default async function TrainingSessionPage({ params }) {
  const { trainingSlug } = await params;

  if (!trainingSlug) {
    throw new Error("Invalid training slug");
  }

  const user = await getCurrentUser();

  const trainingData = await getTrainingAndTrainingSetsBySlug(
    trainingSlug,
    user.id
  );

  if (!trainingData) {
    throw new Error("Training not found");
  }

  let trainingSessionData;

  if (trainingData.completed) {
    trainingSessionData = await getTrainingSessionBySlug(trainingSlug, user.id);
  }

  return (
    <main className="flex flex-col items-center justify-start pt-[92px] p-6 bg-gray-50 flex-1">
      {trainingData.completed ? (
        <TrainingSessionResults trainingSessionData={trainingSessionData} />
      ) : (
        <TrainingSession training={trainingData} userId={user.id} />
      )}
    </main>
  );
}
