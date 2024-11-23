
import { FeedRecord, store } from "~/store/store";

function calculateCattleFeedEmission(): number {
  const feedEmissions = store.livestock.cattle.feed.reduce((total: number, feed: FeedRecord) => {
    return total + (feed.kgsFeed * feed.emissionPerKg);
  }, 0);
  
  return feedEmissions;
}

function calculateCattleProductionEmission(): number {
  const production = store.livestock.cattle.production;
  
  const dairyCowsEmission = production.dairyCows.count * production.dairyCows.emissionFactor;
  const bullsEmission = production.bulls.count * production.bulls.emissionFactor;
  const meatCattleEmission = production.meatCattle.completed * production.meatCattle.emissionFactor;

  return dairyCowsEmission + bullsEmission + meatCattleEmission;
}

export function calculateCattleEmission(): {
  accumulated: number[];
  contribution: number[];
} {
  const feedEmission = calculateCattleFeedEmission();
  const productionEmission = calculateCattleProductionEmission();
  const totalEmission = feedEmission + productionEmission;

  // Use same year calculation as pigs
  const years = Math.max(
    store.fields.reduce((max, field) => 
      Math.max(max, field.rotations?.reduce((sum, rot) => 
        sum + Math.max(
          rot.cropSegments.reduce((s, seg) => s + (seg.years || 0), 0),
          rot.treeSegments.reduce((s, seg) => s + (seg.years || 0), 0)
        ), 0) || 0
      ), 1)
  );

  return {
    accumulated: Array(years).fill(totalEmission).map((val, idx) => val * (idx + 1)),
    contribution: Array(years).fill(totalEmission)
  };
}