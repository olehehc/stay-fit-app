import { getExercisesByCreator } from "@/lib/repository/exercises";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  const exercises = getExercisesByCreator(user.email);

  return Response.json(exercises);
}
