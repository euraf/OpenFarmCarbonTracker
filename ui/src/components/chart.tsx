import { createMemo } from "solid-js";
import { LineChart } from "~/components/ui/charts";
import { store } from "~/store/store";

export const MyChart = (props: {
  data: { accumulated: number[]; contribution: number[] };
}) => {
  const chartData = createMemo(() => ({
    labels: props.data.accumulated.map((_, i) => `${store.startYear + i}`),
    datasets: [
      {
        label: "Accumulated Emission",
        data: props.data.accumulated,
      },
      {
        label: "Yearly Contribution",
        data: props.data.contribution,
      },
    ],
  }));

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
