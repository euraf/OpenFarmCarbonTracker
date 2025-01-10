
import { conversionFactors } from "~/data/energy-and-fuel/conversion-factors";
import { store } from "~/store/store";

export function defaultEnergies() {
  return {
    conversionFactors: store.energyAndFuel.conversionFactors ?? conversionFactors,
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
    return (defaultEnergies().diesel * defaultEnergies().conversionFactors[store.country].diesel) +
         (defaultEnergies().coal * defaultEnergies().conversionFactors[store.country].coal) +
         (defaultEnergies().biogas * defaultEnergies().conversionFactors[store.country].biogas) +
         (defaultEnergies().electricity * defaultEnergies().conversionFactors[store.country].electricity);
  });
  
}