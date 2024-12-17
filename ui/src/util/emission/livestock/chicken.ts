import { ChickenProductionConfig, FeedRecord, store } from "~/store/store";

function calculateChickenFeedEmissionForYear(year: number): number {
  return store.livestock.chicken.feed
    .filter(feed => feed.year === year)
    .reduce((total: number, feed: FeedRecord) => {
      return total + (feed.kgsFeed * feed.emissionPerKg);
    }, 0);
}

function getProductionConfigForYear(year: number): ChickenProductionConfig {
  const configs = store.livestock.chicken.production.configurations;
  const sortedConfigs = [...configs].sort((a, b) => b.year - a.year);
  const config = sortedConfigs.find(c => c.year <= year)?.config;
  return config || configs[0].config;
}

function calculateChickenProductionEmissionForYear(year: number): number {
  const config = getProductionConfigForYear(year);
  return config.broilers.completed * config.broilers.emissionFactor +
         config.eggLayingHens.count * config.eggLayingHens.emissionFactor;
}

export function calculateChickenEmissionForYear(year: number): number {
  const feedEmission = calculateChickenFeedEmissionForYear(year);
  const productionEmission = calculateChickenProductionEmissionForYear(year);
  return feedEmission + productionEmission;
}

export function calculateChickenEmission(): {
  accumulated: number[];
  contribution: number[];
} {
  const contribution = Array(2030 - store.startYear + 1)
    .fill(0)
    .map((_, idx) => {
      const year = store.startYear + idx;
      return calculateChickenEmissionForYear(year);
    });

  const accumulated = contribution.reduce(
    (acc: number[], curr: number) => [...acc, (acc[acc.length - 1] || 0) + curr],
    []
  );

  return { accumulated, contribution };
}