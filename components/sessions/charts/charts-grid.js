import ExerciseChart from "./exercise-chart";

export default function ChartsGrid({ chartsData }) {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {chartsData.map(
        (chartData, index) =>
          chartData.chartData.length > 0 && (
            <li key={index} className="w-full">
              <ExerciseChart
                title={chartData.title}
                description={chartData.description}
                chartData={chartData.chartData}
                trendDescription={chartData.trendDescription}
              />
            </li>
          )
      )}
    </ul>
  );
}
