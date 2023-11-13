import { onMount } from "solid-js";
import { Chart, Title, Tooltip, Legend, Colors } from "chart.js";
import { Line } from "solid-chartjs";

export const MyChart = (props: { data: number[] }) => {
  /**
   * You must register optional elements before using the chart,
   * otherwise you will have the most primitive UI
   */
  onMount(() => {
    Chart.register(Title, Tooltip, Legend, Colors);
  });

  const chartData = {
    labels: props.data.map((el, i) => `${i + 1}. year`),
    datasets: [
      {
        label: "Emission",
        data: props.data,
      },
    ],
  };
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div>
      <Line data={chartData} options={chartOptions} width={500} height={500} />
    </div>
  );
};
