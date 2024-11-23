
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
        emission[y] +=
          2200 * (1 - rotation.splitTreePercent / 100) * ((field.area ?? 0) / 10000);
      }

      cropYearIdx += segment.years ?? 0;
    });

    console.log(field.area)

    let treeYearIdx = currentYearIdx;
    rotation.treeSegments.forEach((segment) => {
      for (let y = treeYearIdx; y < treeYearIdx + (segment.years ?? 0); y++) {
        // First year, there is a cost to implementing trees
        if (y == treeYearIdx) {
          emission[y] +=
            ((10000 * rotation.splitTreePercent) / 100) * ((field.area ?? 0) / 10000);
        } else {
          emission[y] -=
            ((15000 * rotation.splitTreePercent) / 100) * ((field.area ?? 0) / 10000);
        }
      }

      treeYearIdx += segment.years ?? 0;
    });

    currentYearIdx += maxLength;
  });

  let accumulatedEmission: number[] = [];
  let totalEmission = 0;
  emission.forEach((emissionValue) => {
    totalEmission += emissionValue;
    accumulatedEmission.push(totalEmission);
  });

  return { accumulated: accumulatedEmission, contribution: emission };
}