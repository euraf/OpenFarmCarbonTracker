import { CattleProductionConfig, FeedRecord, store } from "~/store/store";

function calculateCattleFeedEmissionForYear(year: number): number {
  return store.livestock.cattle.feed
    .filter(feed => feed.year === year)
    .reduce((total: number, feed: FeedRecord) => {
      return total + (feed.kgsFeed * feed.emissionPerKg);
    }, 0);
}

function getProductionConfigForYear(year: number): CattleProductionConfig {
  const configs = store.livestock.cattle.production.configurations;
  const sortedConfigs = [...configs].sort((a, b) => b.year - a.year);
  const config = sortedConfigs.find(c => c.year <= year)?.config;
  return config || configs[0].config;
}

function calculateCattleProductionEmissionForYear(year: number): number {
  const config = getProductionConfigForYear(year);
  
  return config.dairyCows.count * config.dairyCows.emissionFactor +
         config.bulls.count * config.bulls.emissionFactor +
         config.meatCattle.completed * config.meatCattle.emissionFactor;
}

export function calculateCattleEmissionForYear(year: number): number {
  const feedEmission = calculateCattleFeedEmissionForYear(year);
  const productionEmission = calculateCattleProductionEmissionForYear(year);
  return feedEmission + productionEmission;
}

export function calculateCattleEmission(): {
  accumulated: number[];
  contribution: number[];
} {
  const contribution = Array(2030 - store.startYear + 1)
    .fill(0)
    .map((_, idx) => {
      const year = store.startYear + idx;
      return calculateCattleEmissionForYear(year);
    });

  const accumulated = contribution.reduce(
    (acc: number[], curr: number) => [...acc, (acc[acc.length - 1] || 0) + curr],
    []
  );

  return { accumulated, contribution };
}