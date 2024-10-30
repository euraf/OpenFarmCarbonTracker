import { Navigate } from "@solidjs/router";
import { Show } from "solid-js";
import {
  TextField,
  TextFieldInput,
  TextFieldLabel,
} from "~/components/ui/text-field";
import { conversionFactors } from "~/data/energy-and-fuel/conversion-factors";
import { setStore, store } from "~/store/store";
import { getStoreCountryName } from "~/util/countries";
import { calculateFuelEmission, defaultEnergies } from "~/util/emission";

export default function EnergyAndFuel() {
  function handleInputChange(type: string, value: number) {
    setStore("animals", type, value);
  }

  return (
    <Show when={store.country?.length == 2} fallback={<Navigate href={"/"} />}>
      <div class="card bg-white shadow-md rounded-lg m-4 p-4 grid grid-cols-2 gap-4">
        <div class="energy-and-fuel-inputs">
          <h3 class="text-lg font-semibold">Animals</h3>
        </div>
      </div>
    </Show>
  );
}
