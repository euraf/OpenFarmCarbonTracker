import { createMemo } from "solid-js";
import { LineChart } from "~/components/ui/charts";
import { store } from "~/store/store";
import { calculateBuildingAndEquipmentEmission } from "~/util/buildingAndEquipmentEmission";

export const MyChart = (props: {
  data: { accumulated: number[]; contribution: number[] };
}) => {
  const chartData = createMemo(() => {
    const buildingAndEquipmentEmission = calculateBuildingAndEquipmentEmission();
    const accumulated = props.data.accumulated.map((value, index) => 
      value + (buildingAndEquipmentEmission.accumulated[index] || 0)
    );
    const contribution = props.data.contribution.map((value, index) => 
      value + (buildingAndEquipmentEmission.contribution[index] || 0)
    );

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
