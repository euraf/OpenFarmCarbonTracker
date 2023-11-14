import { Field } from "~/store/store";

export function calculateFieldEmission(field: Field): {
  accumulated: number[];
  contribution: number[];
} {
  let emission: number[] = [];

  let currentYearIdx = 0;
  field.rotations?.forEach((rotation) => {
    const cropLength = rotation.cropSegments.reduce((acc, current) => {
      return (acc += current.years ?? 0);
    }, 0);

    const treeLength = rotation.treeSegments.reduce((acc, current) => {
      return (acc += current.years ?? 0);
    }, 0);

    const maxLength = Math.max(cropLength, treeLength);

    for (let y = currentYearIdx; y < currentYearIdx + maxLength; y++) {
      emission[y] = 0;
    }

    let cropYearIdx = currentYearIdx;
    rotation.cropSegments.forEach((segment) => {
      for (let y = cropYearIdx; y < cropYearIdx + (segment.years ?? 0); y++) {
        emission[y] += 2200 * (1 - rotation.splitTreePercent / 100);
      }

      cropYearIdx += segment.years ?? 0;
    });

    let treeYearIdx = currentYearIdx;
    rotation.treeSegments.forEach((segment) => {
      for (let y = treeYearIdx; y < treeYearIdx + (segment.years ?? 0); y++) {
        // First year, there is a cost to implementing trees
        if (y == treeYearIdx) {
          emission[y] += (10000 * rotation.splitTreePercent) / 100;
        } else {
          emission[y] -= (15000 * rotation.splitTreePercent) / 100;
        }
      }

      treeYearIdx += segment.years ?? 0;
    });

    currentYearIdx += maxLength;
  });

  console.log("Emission", emission);

  let accumulatedEmission: number[] = [];
  let totalEmission = 0;
  emission.forEach((emissionValue) => {
    totalEmission += emissionValue;
    accumulatedEmission.push(totalEmission);
  });
  console.log("Accumulated Emission", accumulatedEmission);

  return { accumulated: accumulatedEmission, contribution: emission };
}

export function calculateFarmEmission(fields: Field[]): {
  accumulated: number[];
  contribution: number[];
} {
  let emissions = fields.map((field) => {
    return calculateFieldEmission(field);
  });

  let maxLengthAccumulated = Math.max(...emissions.map(e => e.accumulated.length));
  let maxLengthContribution = Math.max(...emissions.map(e => e.contribution.length));
  let totalEmissions = {
    accumulated: Array(maxLengthAccumulated).fill(0),
    contribution: Array(maxLengthContribution).fill(0),
  };

  emissions.forEach((emission) => {
    emission.accumulated.forEach((value, index) => {
      if (index < totalEmissions.accumulated.length) {
        totalEmissions.accumulated[index] += value;
      }
    });
    emission.contribution.forEach((value, index) => {
      if (index < totalEmissions.contribution.length) {
        totalEmissions.contribution[index] += value;
      }
    });
  });

  return totalEmissions;

}
