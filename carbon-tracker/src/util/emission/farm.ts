import { Field, store } from "~/store/store";
import { calculateFieldEmission } from "./field";
import { calculateFuelEmission } from "./fuel";
import { calculatePigEmission } from "./livestock/pigs";

export function calculateLandUsedEmission(startYear: number, endYear: number): {
  accumulated: number[];
  contribution: number[];
} {

  let returnVal: {
    accumulated: number[];
    contribution: number[];
  } = { accumulated: [], contribution: [] }

  store.fields.map(
    (field) => {
      const fieldEmission = calculateFieldEmission(field);
      
      // Extend arrays to match the longest length
      const maxLength = Math.max(
        returnVal.accumulated.length,
        fieldEmission.accumulated.length
      );

      const newAccumulated = new Array(maxLength).fill(0).map((_, i) => 
        (returnVal.accumulated[i] || 0) + (fieldEmission.accumulated[i] || 0)
      );

      const newContribution = new Array(maxLength).fill(0).map((_, i) => 
        (returnVal.contribution[i] || 0) + (fieldEmission.contribution[i] || 0)
      );

      returnVal = {
        accumulated: newAccumulated,
        contribution: newContribution
      };

    });


  
    const years = endYear - startYear + 1;
    
    // Trim or extend arrays to match the required length
    returnVal.accumulated = returnVal.accumulated.slice(0, years);
    returnVal.contribution = returnVal.contribution.slice(0, years);

    // Extend if needed
    while (returnVal.accumulated.length < years) {
      returnVal.accumulated.push(0);
    }
    while (returnVal.contribution.length < years) {
      returnVal.contribution.push(0);
    }

    return returnVal;
  
  
}
