import { createMemo, onCleanup, onMount } from "solid-js";
import { LineChart, PieChart } from "~/components/ui/charts";
import { store } from "~/store/store";
import { calculateBuildingAndEquipmentEmission } from "~/util/buildingAndEquipmentEmission";
import { calculateFuelEmission, calculatePigEmission } from "~/util/emission";

export const MyChart = (props: {
  data: { accumulated: number[]; contribution: number[] };
}) => {
  let container: HTMLDivElement;

  const chartData = createMemo(() => {
    const buildingAndEquipmentEmission = calculateBuildingAndEquipmentEmission();
    const pigEmission = calculatePigEmission();
    const accumulated = props.data.accumulated.map((value, index) => 
      value + 
      (buildingAndEquipmentEmission.accumulated[index] || 0) +
      (pigEmission.accumulated[index] || 0)
    );
    const contribution = props.data.contribution.map((value, index) => 
      value + 
      (buildingAndEquipmentEmission.contribution[index] || 0) +
      (pigEmission.contribution[index] || 0)
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
    const pigEmission = calculatePigEmission();
    const totalPigEmission = pigEmission.accumulated.reduce((sum, value) => sum + value, 0);

    return {
      labels: ["Land Use", "Buildings/Equipment", "Energy/Fuel", "Livestock"],
      datasets: [
        {
          data: [
            totalLandUseEmission, 
            totalBuildingAndEquipmentEmission, 
            totalFuelEmission,
            totalPigEmission
          ],
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#AB47BC"],
        },
      ],
    };
  });

  onMount(() => {
    const resizeObserver = new ResizeObserver(() => {
      container && container.dispatchEvent(new Event("resize"));
    });

    resizeObserver.observe(container);

    onCleanup(() => {
      resizeObserver.disconnect();
    });
  });

  return (
    <div class="flex flex-col xl:flex-row " ref={el => container = el}>
      <div class="flex-1 h-96 max-h-[400px] mb-20 flex flex-col items-center">


        <h3 class="text-center mb-2 ">Yearly and Accumulated Emissions</h3>
        <LineChart
          data={chartData()}
          options={{
            
            responsive: true,
            maintainAspectRatio: true,
            
            scales: {
              x: {
                ticks: {
                  maxRotation: 0,
                  minRotation: 0,
                },
              },
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: "kg CO2e",
                },
                ticks: {
                  color: "#000", // Ensure y-axis labels are visible
                },
              },
            },
          }}
          
          width={800}
          
          
        />
      </div>



      <div class="flex-1 h-96 max-h-[400px] mb-20 text-center flex flex-col items-center">
        <h3 class="text-center mb-2">Emission distribution for all years summed</h3>
        <PieChart
          data={pieChartData()}
          options={{
            responsive: true,
            maintainAspectRatio: true,
          }}
          width={800}
        />
      </div>
    </div>
  );
};
