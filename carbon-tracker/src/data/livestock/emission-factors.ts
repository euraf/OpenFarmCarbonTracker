export const DEFAULT_PIG_EMISSION_FACTORS = {
  farrowing: 0.8,       // kg CO2e per pig produced during their stage (0-3 weeks)
  nursery: 1.2,         // kg CO2e per pig produced during their stage (3-9 weeks)
  finishers: 2.5,       // kg CO2e per pig produced during their stage (9-28 weeks)
  sows: 4.2,            // kg CO2e per pig yearly
  boars: 3.8            // kg CO2e per pig yearly
};

export const DEFAULT_CATTLE_EMISSION_FACTORS = {
  dairyCows: 3500,      // kg CO2e per animal yearly
  bulls: 2800,          // kg CO2e per animal yearly
  meatCattle: 2200      // kg CO2e per animal produced
};

export const DEFAULT_CHICKEN_EMISSION_FACTORS = {
  broilers: 2.5,        // kg CO2e per animal produced
  eggLayingHens: 4.2    // kg CO2e per animal yearly
};