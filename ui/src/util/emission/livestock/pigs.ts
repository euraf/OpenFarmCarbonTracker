import { FeedRecord, PigProductionConfig, store } from "~/store/store";

function calculatePigFeedEmissionForYear(year: number): number {
  return store.livestock.pigs.feed
    .filter(feed => feed.year === year)
    .reduce((total: number, feed: FeedRecord) => {
      return total + (feed.kgsFeed * feed.emissionPerKg);
    }, 0);
}

function getProductionConfigForYear(year: number): PigProductionConfig {
  const configs = store.livestock.pigs.production.configurations;
  // Sort configurations by year in descending order
  const sortedConfigs = [...configs].sort((a, b) => b.year - a.year);
  // Find the first configuration that's applicable for the given year
  const config = sortedConfigs.find(c => c.year <= year)?.config;
  return config || configs[0].config; // Fallback to first config if none found
}

function calculatePigProductionEmissionForYear(year: number): number {
  const config = getProductionConfigForYear(year);
  
  return config.farrowing.completed * config.farrowing.emissionFactor +
         config.nursery.completed * config.nursery.emissionFactor +
         config.finishers.completed * config.finishers.emissionFactor +
         config.sows.count * config.sows.emissionFactor +
         config.boars.count * config.boars.emissionFactor;
}


export function calculatePigEmissionForYear(year: number): number {
  const feedEmission = calculatePigFeedEmissionForYear(year);
  const productionEmission = calculatePigProductionEmissionForYear(year);
  return feedEmission + productionEmission;
}


export function calculatePigEmissionContribution(): number[] {
  const startYear = store.startYear;
  const maxYear = startYear+100;
  const years = maxYear - startYear + 1;
  
  return Array(years).fill(0).map((_, idx) => {
    const year = startYear + idx;
    return calculatePigEmissionForYear(year);
  });
}

export function calculatePigEmission(): {
  accumulated: number[];
  contribution: number[];
} {
  const contribution = calculatePigEmissionContribution();
  const accumulated = contribution.reduce((acc: number[], curr: number) => 
    [...acc, (acc[acc.length - 1] || 0) + curr],
    []
  );

  return { accumulated, contribution };
}
// export function calculatePigEmission(): {
//   accumulated: number[];
//   contribution: number[];
// } {
//   const startYear = store.startYear;
//   const years = store.endYear - startYear + 1;
  
//   const contributionByYear = Array(years).fill(0).map((_, idx) => {
//     const year = startYear + idx;
//     const feedEmission = calculatePigFeedEmissionForYear(year);
//     const productionEmission = calculatePigProductionEmissionForYear(year);
//     return feedEmission + productionEmission;
//   });

//   return {
//     accumulated: contributionByYear.reduce((acc, curr, idx) => 
//       [...acc, (acc[idx - 1] || 0) + curr], 
//     []),
//     contribution: contributionByYear
//   };
// }