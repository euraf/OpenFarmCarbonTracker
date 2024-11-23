
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

export function calculateFuelEmission() {
  return (defaultEnergies().diesel * conversionFactors[store.country].diesel) +
         (defaultEnergies().coal * conversionFactors[store.country].coal) +
         (defaultEnergies().biogas * conversionFactors[store.country].biogas) +
         (defaultEnergies().electricity * conversionFactors[store.country].electricity);
}