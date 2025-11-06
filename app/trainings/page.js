import Link from "next/link";
import TrainingsList from "@/components/trainings/trainings-list";
import ClientFilters from "@/components/trainings/client-filters";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";
import { getTrainingsByUserAndDateRange } from "@/lib/repository/trainings";
import { formatDateToYMD } from "@/lib/utils";

export default async function TrainingsPage({ searchParams: rawSearchParams }) {
  const searchParams = await rawSearchParams;

  const from = searchParams?.dateFrom ? new Date(searchParams.dateFrom) : null;
  const to = searchParams?.dateTo ? new Date(searchParams.dateTo) : null;

  const user = await getCurrentUser();

  const trainings = await getTrainingsByUserAndDateRange(
    user.id,
    formatDateToYMD(from),
    formatDateToYMD(to)
  );

  return (
    <main className="pt-[68px] bg-gray-50 flex-1 flex justify-center">
      <div className="mx-auto flex flex-col lg:flex-row w-full">
        <div className="flex flex-col p-6 justify-between items-start h-full bg-gray-100 rounded-r-3xl">
          <Button asChild className="w-auto">
            <Link href="/trainings/create-training">Add training</Link>
          </Button>
          <ClientFilters defaultRange={{ from, to }} />
        </div>

        <div className="flex-1 min-h-0 overflow-hidden p-6 flex justify-center">
          <div className="h-full overflow-y-auto">
            {trainings.length === 0 ? (
              <div className="h-full flex justify-center items-center">
                <p>Lack of Trainings</p>
              </div>
            ) : (
              <TrainingsList trainings={trainings} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
