
import { store } from "~/store/store";

export function calculateBuildingAndEquipmentEmission() {
  const accumulated: number[] = [];
  const contribution: number[] = [];

  store.buildings.forEach((building) => {
    const yearIndex = building.year - store.startYear;
    if (yearIndex >= 0) {
      if (!contribution[yearIndex]) contribution[yearIndex] = 0;
      if (!accumulated[yearIndex]) accumulated[yearIndex] = 0;
      contribution[yearIndex] += building.emission;
      accumulated[yearIndex] += building.emission;
    }
  });

  store.equipment.forEach((equipment) => {
    const yearIndex = equipment.year - store.startYear;
    if (yearIndex >= 0) {
      if (!contribution[yearIndex]) contribution[yearIndex] = 0;
      if (!accumulated[yearIndex]) accumulated[yearIndex] = 0;
      contribution[yearIndex] += equipment.emission;
      accumulated[yearIndex] += equipment.emission;
    }
  });

  return { accumulated, contribution };
}