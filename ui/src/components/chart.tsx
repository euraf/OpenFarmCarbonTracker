import { createMemo, onCleanup, onMount } from "solid-js";
import { LineChart, BarChart } from "~/components/ui/charts";
import { store } from "~/store/store";
import { calculateBuildingAndEquipmentEmission } from "~/util/buildingAndEquipmentEmission";
import { calculateFuelEmission, calculateLandUsedEmission, calculatePigEmission } from "~/util/emission";
import { calculateCattleEmission } from "~/util/emission/livestock/cattle";
import { calculateChickenEmission } from "~/util/emission/livestock/chicken";


export const FieldEmissionChart = (props: {
  data: { accumulated: number[]; contribution: number[] };
}) => {
  let container: HTMLDivElement;

  const lineChartData = createMemo(() => {
    const years = props.data.accumulated.map((_, i) => `${store.startYear + i}`);
    

    return {
      labels: years,
      datasets: [
        {
          type: 'line',
          label: "Accumulated Emission",
          data: props.data.accumulated,
          borderColor: "skyblue",
          yAxisID: 'y',
        },
        {
          type: 'line',
          label: "Yearly Contribution",
          data: props.data.contribution,
          borderColor: "navy",
          yAxisID: 'y',
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
        <h3 class="text-center mb-2">Emissions Over Time</h3>
        <LineChart
          data={lineChartData()}
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
                type: 'linear',
                display: true,
                position: 'left',
                beginAtZero: true,
                title: {
                  display: true,
                  text: "Total kg CO2e",
                },
              },
            },
          }}
          width={800}
        />
      </div>
    </div>
  );
};



export const FarmEmissionCharts = (props: {
  startYear: () => number;
  endYear: () => number;
}) => {
  let container: HTMLDivElement;

  const extendArray = (arr: number[], targetLength: number) => {
    if (arr.length >= targetLength) return arr;
    const lastValue = arr[arr.length - 1] || 0;
    return [...arr, ...Array(targetLength - arr.length).fill(lastValue)];
  };

  const lineChartData = createMemo(() => {

    const years = Array.from({ length: props.endYear() - props.startYear() + 1 }, (_, i) => `${props.startYear() + i}`);

    const buildingAndEquipmentEmission = calculateBuildingAndEquipmentEmission();
    const pigEmission = calculatePigEmission(props.startYear(), props.endYear());
    const cattleEmission = calculateCattleEmission(props.startYear(), props.endYear());
    const chickenEmission = calculateChickenEmission(props.startYear(), props.endYear());
    
    // Extend contribution data for livestock and energy
    const extendedBuildingEmission = {
      contribution: buildingAndEquipmentEmission.contribution,
      accumulated: buildingAndEquipmentEmission.contribution.map((_, index) => 
        buildingAndEquipmentEmission.contribution.slice(0, index + 1).reduce((sum, val) => sum + (val || 0), 0)
      )
    };
  
    const landUseData = calculateLandUsedEmission(props.startYear(), props.endYear()).contribution
    const buildingData = extendedBuildingEmission.contribution;
    const fuelData = calculateFuelEmission(props.startYear(), props.endYear());
    const livestockData = years.map((_, i) => 
      pigEmission[i] +
      cattleEmission[i] +
      chickenEmission[i]
    );

    // Calculate accumulated by summing up values from all sources up to each index
    const accumulated = years.map((_, index) => {
      const landUseSum = landUseData.slice(0, index + 1).reduce((sum, val) => sum + (val || 0), 0);
      const buildingSum = buildingData.slice(0, index + 1).reduce((sum, val) => sum + (val || 0), 0);
      const fuelSum = fuelData.slice(0, index + 1).reduce((sum, val) => sum + (val || 0), 0);
      const livestockSum = livestockData.slice(0, index + 1).reduce((sum, val) => sum + (val || 0), 0);
      return landUseSum + buildingSum + fuelSum + livestockSum;
    });

    // Calculate contribution by adding values from all sources at each index
    const contribution = years.map((_, index) => {
      const landUseVal = landUseData[index] || 0;
      const buildingVal = buildingData[index] || 0;
      const fuelVal = fuelData[index] || 0;
      const livestockVal = livestockData[index] || 0;
      return landUseVal + buildingVal + fuelVal + livestockVal;
    });

    return {
      labels: years,
      datasets: [
        {
          type: 'line',
          label: "Accumulated Emission",
          data: accumulated,
          borderColor: "skyblue",
          yAxisID: 'y',
        },
        {
          type: 'line',
          label: "Yearly Contribution",
          data: contribution,
          borderColor: "navy",
          yAxisID: 'y',
        },
        {
          type: 'bar',
          label: "Land Use",
          data: landUseData,
          backgroundColor: "#FF6384",
          yAxisID: 'y',
        },
        {
          type: 'bar',
          label: "Buildings/Equipment",
          data: buildingData,
          backgroundColor: "#36A2EB",
          yAxisID: 'y',
        },
        {
          type: 'bar',
          label: "Energy/Fuel",
          data: fuelData,
          backgroundColor: "#FFCE56",
          yAxisID: 'y',
        },
        {
          type: 'bar',
          label: "Livestock",
          data: livestockData,
          backgroundColor: "#AB47BC",
          yAxisID: 'y',
        },
      ],
    };
  });

  const distributionChartData = createMemo(() => {
    const years = Array.from({ length: props.endYear() - props.startYear() + 1 }, (_, i) => i);
    
    // Calculate totals only for the selected year range
    const totalLandUseEmission = calculateLandUsedEmission(props.startYear(), props.endYear()).contribution.reduce((sum, value) => sum + value, 0);

    const buildingAndEquipmentEmission = calculateBuildingAndEquipmentEmission();
    const totalBuildingAndEquipmentEmission = buildingAndEquipmentEmission.contribution
      .slice(0, years.length)
      .reduce((sum, value) => sum + (value || 0), 0);

    const totalFuelEmission = calculateFuelEmission(props.startYear(), props.endYear()).reduce((sum, value) => sum + value, 0);
    
    const pigEmission = calculatePigEmission(props.startYear(), props.endYear());
    const cattleEmission = calculateCattleEmission(props.startYear(), props.endYear());
    const chickenEmission = calculateChickenEmission(props.startYear(), props.endYear());
    

    const totalLivestockEmission = 
      pigEmission.reduce((sum, value) => sum + value, 0) +
      cattleEmission.reduce((sum, value) => sum + value, 0) +
      chickenEmission.reduce((sum, value) => sum + value, 0);
    
    return {
      labels: ["Land Use", "Buildings/Equipment", "Energy/Fuel", "Livestock"],
      datasets: [
        {
          data: [
            totalLandUseEmission, 
            totalBuildingAndEquipmentEmission, 
            totalFuelEmission,
            totalLivestockEmission
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
        <h3 class="text-center mb-2">Emissions Over Time</h3>
        <LineChart
          data={lineChartData()}
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
                type: 'linear',
                display: true,
                position: 'left',
                beginAtZero: true,
                title: {
                  display: true,
                  text: "Total kg CO2e",
                },
              },
             
            },
          }}
          width={800}
        />
      </div>


      <div class="flex-1 h-96 max-h-[400px] mb-20 text-center flex flex-col items-center">
        <h3 class="text-center mb-2">Emission distribution for all years summed</h3>
        <BarChart
          data={distributionChartData()}
          options={{
            plugins:{
              legend: {
                display: false,
              },
            },
            responsive: true,
            maintainAspectRatio: true,
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
          width={800}
        />
      </div>
    </div>
  );
};
