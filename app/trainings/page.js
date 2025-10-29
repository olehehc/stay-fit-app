import Link from "next/link";
import TrainingsList from "@/components/trainings/trainings-list";
import ClientFilters from "@/components/trainings/client-filters";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";
import { getTrainingsByUserAndDateRange } from "@/lib/repository/trainings";
import { formatDateToYMD } from "@/lib/utils";

export default async function TrainingsPage({ searchParams: rawSearchParams }) {
  const searchParams = await rawSearchParams;

  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 6);

  const from = searchParams?.dateFrom ? new Date(searchParams.dateFrom) : today;
  const to = searchParams?.dateTo ? new Date(searchParams.dateTo) : nextWeek;

  const user = await getCurrentUser();

  const trainings = getTrainingsByUserAndDateRange(
    user.id,
    formatDateToYMD(from),
    formatDateToYMD(to)
  );

  return (
    <main className="pt-[92px] p-6 bg-gray-50 flex-1 flex justify-center">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 items-stretch">
        <div className="flex-none flex flex-col min-h-0">
          <Button asChild className="mb-4 self-start w-auto">
            <Link href="/trainings/create-training">Add training</Link>
          </Button>
          <div className="flex-1 min-h-0 max-h-[calc(59vh-92px-1.5rem)] overflow-hidden min-w-[576px]">
            <div className="h-full overflow-y-auto">
              {trainings.length === 0 ? (
                <div className="flex justify-center items-center">
                  <p>Lack of Trainings</p>
                </div>
              ) : (
                <TrainingsList trainings={trainings} />
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 items-start min-h-0">
          <ClientFilters defaultRange={{ from, to }} />
        </div>
      </div>
    </main>
  );
}
