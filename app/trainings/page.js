import TrainingsList from "@/components/trainings/trainings-list";
import TrainingsSidebar from "@/components/trainings/trainings-sidebar";
import { getCurrentUser } from "@/lib/auth";
import { getTrainingsByUserAndDateRange } from "@/lib/repository/trainings";
import { formatDateToYMD } from "@/lib/utils";

export default async function TrainingsPage({ searchParams: rawSearchParams }) {
  const searchParams = await rawSearchParams;

  const from = searchParams?.dateFrom ? new Date(searchParams.dateFrom) : null;
  const to = searchParams?.dateTo ? new Date(searchParams.dateTo) : null;
  const status = searchParams?.status;

  const user = await getCurrentUser();

  const trainings = await getTrainingsByUserAndDateRange(
    user.id,
    formatDateToYMD(from),
    formatDateToYMD(to),
    status
  );

  return (
    <main className="pt-[132px] lg:pt-[68px] bg-gray-50 flex-1 flex justify-center">
      <div className="mx-auto flex flex-col lg:flex-row w-full">
        <TrainingsSidebar from={from} to={to} />

        <div className="flex-1 min-h-0 overflow-hidden p-6 flex justify-center">
          <div className="h-full overflow-y-auto w-full">
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
