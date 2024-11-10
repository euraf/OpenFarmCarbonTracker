import { createMemo } from "solid-js";
import { LineChart } from "~/components/ui/charts";
import { store } from "~/store/store";

export const MyChart = (props: {
  data: { accumulated: number[]; contribution: number[] };
}) => {
  const chartData = createMemo(() => {
    const accumulated = [...props.data.accumulated];
    const contribution = [...props.data.contribution];

    store.buildings.forEach((building) => {
      const yearIndex = building.year - store.startYear;
      if (yearIndex >= 0 && yearIndex < contribution.length) {
        contribution[yearIndex] += building.emission;
        accumulated[yearIndex] += building.emission;
      }
    });

    store.equipment.forEach((equipment) => {
      const yearIndex = equipment.year - store.startYear;
      if (yearIndex >= 0 && yearIndex < contribution.length) {
        contribution[yearIndex] += equipment.emission;
        accumulated[yearIndex] += equipment.emission;
      }
    });

    return {
      labels: accumulated.map((_, i) => `${store.startYear + i}`),
      datasets: [
        {
          label: "Accumulated Emission",
          data: accumulated,
        },
        {
          label: "Yearly Contribution",
          data: contribution,
        },
      ],
    };
  });

  return (
    <div>
      <LineChart
        data={chartData()}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: 0, // disable animations
          },
          scales: {
            y: {
              title: {
                display: true,
                text: "kg CO2e",
              },
            },
          },
        }}
        width={500}
        height={500}
      />
    </div>
  );
};
