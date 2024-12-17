
import { conversionFactors } from "~/data/energy-and-fuel/conversion-factors";
import { store } from "~/store/store";

export function defaultEnergies() {
  return {
    diesel: store.energyAndFuel?.diesel ?? 0,
    electricity: store.energyAndFuel?.electricity ?? 0,
    biogas: store.energyAndFuel?.biogas ?? 0,
    coal: store.energyAndFuel?.coal ?? 0
  }
}

export function calculateFuelEmission(startYear: number, endYear: number) {

  const years = endYear - startYear + 1;
    
  return Array(years).fill(0).map((_, idx) => {
    const year = startYear + idx;
    return (defaultEnergies().diesel * conversionFactors[store.country].diesel) +
         (defaultEnergies().coal * conversionFactors[store.country].coal) +
         (defaultEnergies().biogas * conversionFactors[store.country].biogas) +
         (defaultEnergies().electricity * conversionFactors[store.country].electricity);
  });
  
}