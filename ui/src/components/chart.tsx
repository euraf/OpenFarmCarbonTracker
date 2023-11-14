import { createMemo, onMount } from "solid-js";
import { Chart, Title, Tooltip, Legend, Colors } from "chart.js";
import { Line } from "solid-chartjs";

export const MyChart = (props: {
  data: { accumulated: number[]; contribution: number[] };
}) => {
  /**
   * You must register optional elements before using the chart,
   * otherwise you will have the most primitive UI
   */
  onMount(() => {
    Chart.register(Title, Tooltip, Legend, Colors);
  });

  const chartData = createMemo(()=>({
    labels: props.data.accumulated.map((el, i) => `${i + 1}. year`),
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
  const chartOptions = {
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
  };

  return (
    <>
      <div>
        <Line
          data={chartData()}
          options={chartOptions}
          width={500}
          height={500}
        />
      </div>
    </>
  );
};
