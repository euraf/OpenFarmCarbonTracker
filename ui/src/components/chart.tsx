import { createMemo } from "solid-js";
import { LineChart, PieChart } from "~/components/ui/charts";
import { store } from "~/store/store";
import { calculateBuildingAndEquipmentEmission } from "~/util/buildingAndEquipmentEmission";
import { calculateFuelEmission } from "~/util/emission";

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

  const pieChartData = createMemo(() => {
    const totalLandUseEmission = props.data.accumulated.reduce((sum, value) => sum + value, 0);
    const buildingAndEquipmentEmission = calculateBuildingAndEquipmentEmission();
    const totalBuildingAndEquipmentEmission = buildingAndEquipmentEmission.accumulated.reduce((sum, value) => sum + value, 0);
    const totalFuelEmission = calculateFuelEmission() * props.data.accumulated.length;

    return {
      labels: ["Land Use", "Buildings/Equipment", "Energy/Fuel"],
      datasets: [
        {
          data: [totalLandUseEmission, totalBuildingAndEquipmentEmission, totalFuelEmission],
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        },
      ],
    };
  });

  return (
    <div class="chart-container">
      <div class="chart">
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
                beginAtZero: true,
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
      <div class="chart">
        <PieChart
          data={pieChartData()}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            animation: {
              duration: 0, // disable animations
            },
          }}
          width={500}
          height={500}
        />
      </div>
      <style jsx>{`
        .chart-container {
          display: flex;
          flex-direction: column;
        }
        .chart {
          height: 500px;
        }
        @media (min-width: 800px) {
          .chart-container {
            flex-direction: row;
          }
          .chart {
            flex: 1;
          }
        }
      `}</style>
    </div>
  );
};
