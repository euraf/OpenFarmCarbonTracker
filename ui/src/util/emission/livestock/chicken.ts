
import { FeedRecord, store } from "~/store/store";

function calculateChickenFeedEmission(): number {
  const feedEmissions = store.livestock.chicken.feed.reduce((total: number, feed: FeedRecord) => {
    return total + (feed.kgsFeed * feed.emissionPerKg);
  }, 0);
  
  return feedEmissions;
}

function calculateChickenProductionEmission(): number {
  const production = store.livestock.chicken.production;
  
  const broilersEmission = production.broilers.completed * production.broilers.emissionFactor;
  const eggLayingHensEmission = production.eggLayingHens.count * production.eggLayingHens.emissionFactor;

  return broilersEmission + eggLayingHensEmission;
}

export function calculateChickenEmission(): {
  accumulated: number[];
  contribution: number[];
} {
  const feedEmission = calculateChickenFeedEmission();
  const productionEmission = calculateChickenProductionEmission();
  const totalEmission = feedEmission + productionEmission;

  // Use same year calculation as other livestock
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