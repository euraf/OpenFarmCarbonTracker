
import { FeedRecord, store } from "~/store/store";

function calculatePigFeedEmission(): number {
  const feedEmissions = store.livestock.pigs.feed.reduce((total: number, feed: FeedRecord) => {
    return total + (feed.kgsFeed * feed.emissionPerKg);
  }, 0);
  
  return feedEmissions;
}

function calculatePigProductionEmission(): number {
  const production = store.livestock.pigs.production;
  
  const farrowingEmission = production.farrowing.completed * production.farrowing.emissionFactor;
  const nurseryEmission = production.nursery.completed * production.nursery.emissionFactor;
  const finishersEmission = production.finishers.completed * production.finishers.emissionFactor;
  const sowsEmission = production.sows.count * production.sows.emissionFactor;
  const boarsEmission = production.boars.count * production.boars.emissionFactor;

  return farrowingEmission + nurseryEmission + finishersEmission + sowsEmission + boarsEmission;
}

export function calculatePigEmission(): {
  accumulated: number[];
  contribution: number[];
} {
  const feedEmission = calculatePigFeedEmission();
  const productionEmission = calculatePigProductionEmission();
  const totalEmission = feedEmission + productionEmission;

  // For now, we'll just return the same emission for each year
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