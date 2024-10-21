import { conversionFactors } from "~/data/energy-and-fuel/conversion-factors";
import { Field, store } from "~/store/store";

export function defaultEnergies(){

  

  return {
    diesel: store.energyAndFuel?.diesel ?? 0,
    electricity: store.energyAndFuel?.electricity ?? 0,
    biogas: store.energyAndFuel?.biogas ?? 0,
    coal: store.energyAndFuel?.coal ?? 0
  }
}

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


export function calculateFuelEmission() {
  return (defaultEnergies().diesel * conversionFactors[store.country].diesel) +
         (defaultEnergies().coal * conversionFactors[store.country].coal) +
         (defaultEnergies().biogas * conversionFactors[store.country].biogas) +
         (defaultEnergies().electricity * conversionFactors[store.country].electricity);
}


export function calculateFarmEmission(fields: Field[]): {
  accumulated: number[];
  contribution: number[];
} {
  let emissions = fields.map((field) => {
    return calculateFieldEmission(field);
  });

  if (emissions.length === 0) {
    return {
      accumulated: [],
      contribution: [],
    };
  }

  let maxLengthAccumulated = Math.max(
    ...emissions.map((e) => e.accumulated.length)
  );
  let maxLengthContribution = Math.max(
    ...emissions.map((e) => e.contribution.length)
  );
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

  totalEmissions.accumulated = totalEmissions.accumulated.map((value) => value + calculateFuelEmission());
  totalEmissions.contribution = totalEmissions.contribution.map((value) => value + calculateFuelEmission());

  return totalEmissions;
}
