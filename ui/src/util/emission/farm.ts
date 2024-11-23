
import { Field } from "~/store/store";
import { calculateFieldEmission } from "./field";
import { calculateFuelEmission } from "./fuel";

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