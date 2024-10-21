import { Navigate } from "@solidjs/router";
import { Show } from "solid-js";
import { TextField, TextFieldInput, TextFieldLabel } from "~/components/ui/text-field";
import { conversionFactors } from "~/data/energy-and-fuel/conversion-factors";
import { setStore, store } from "~/store/store";
import { getStoreCountryName } from "~/util/countries";
import { calculateFuelEmission, defaultEnergies } from "~/util/emission";



export default function EnergyAndFuel() {
  function handleInputChange(type: string, value: number) {
    setStore("energyAndFuel", type, value);
  }



  return (
    <Show when={store.country?.length == 2} fallback={<Navigate href={"/"} />}>
      <div class="card bg-white shadow-md rounded-lg m-4 p-4 grid grid-cols-2 gap-4">
        <div class="energy-and-fuel-inputs">
          <h3 class="text-lg font-semibold">Yearly Consumption</h3>

          <TextField class="grid w-full max-w-sm items-center gap-1.5">
            <TextFieldLabel for="diesel">Diesel (liters)</TextFieldLabel>
            <TextFieldInput
              type="number"
              id="diesel"
              value={defaultEnergies().diesel}
              min="0"
              onInput={(e) => handleInputChange("diesel", Math.max(0, parseFloat(e.currentTarget.value)))}
            />
          </TextField>
          <TextField class="grid w-full max-w-sm items-center gap-1.5">
            <TextFieldLabel for="coal">Coal (kg)</TextFieldLabel>
            <TextFieldInput
              type="number"
              id="coal"
              value={defaultEnergies().coal}
              min="0"
              onInput={(e) => handleInputChange("coal", Math.max(0, parseFloat(e.currentTarget.value)))}
            />
          </TextField>
          <TextField class="grid w-full max-w-sm items-center gap-1.5">
            <TextFieldLabel for="biogas">Biogas (m<sup>3</sup>)</TextFieldLabel>
            <TextFieldInput
              type="number"
              id="biogas"
              value={defaultEnergies().biogas}
              min="0"
              onInput={(e) => handleInputChange("biogas", Math.max(0, parseFloat(e.currentTarget.value)))}
            />
          </TextField>
          <TextField class="grid w-full max-w-sm items-center gap-1.5">
            <TextFieldLabel for="electricity">Electricity (kWh)</TextFieldLabel>
            <TextFieldInput
              type="number"
              id="electricity"
              value={defaultEnergies().electricity}
              min="0"
              onInput={(e) => handleInputChange("electricity", Math.max(0, parseFloat(e.currentTarget.value)))}
            />
          </TextField>
        </div>

        <div class="energy-and-fuel-summary">
          <h4 class="text-md font-semibold mt-2">Conversion Units for {getStoreCountryName()}</h4>
          <ul class="list-disc pl-5">
            <li>Diesel: {conversionFactors[store.country].diesel} kg CO2 per liter</li>
            <li>Coal: {conversionFactors[store.country].coal} kg CO2 per kg</li>
            <li>Biogas: {conversionFactors[store.country].biogas} kg CO2 per m<sup>3</sup></li>
            <li>Electricity: {conversionFactors[store.country].electricity} kg CO2 per kWh</li>
          </ul>

          <h3 class="text-lg font-semibold">Energy and Fuel Usage Summary</h3>
          <ul class="list-disc pl-5">
            <li>Diesel: {defaultEnergies().diesel.toFixed(2)} liters</li>
            <li>Coal: {defaultEnergies().coal.toFixed(2)} kg</li>
            <li>Biogas: {defaultEnergies().biogas.toFixed(2)} m<sup>3</sup></li>
            <li>Electricity: {defaultEnergies().electricity.toFixed(2)} kWh</li>
          </ul>
          <h4 class="text-md font-semibold mt-2">CO2 Emissions</h4>
          <ul class="list-disc pl-5">
            <li>Diesel CO2: {(defaultEnergies().diesel * conversionFactors[store.country].diesel).toFixed(2)} kg</li>
            <li>Coal CO2: {(defaultEnergies().coal * conversionFactors[store.country].coal).toFixed(2)} kg</li>
            <li>Biogas CO2: {(defaultEnergies().biogas * conversionFactors[store.country].biogas).toFixed(2)} kg</li>
            <li>Electricity CO2: {(defaultEnergies().electricity * conversionFactors[store.country].electricity).toFixed(2)} kg</li>
          </ul>
          <p class="font-bold mt-2">
            Total CO2 Emissions: {Number(calculateFuelEmission().toFixed(2)).toLocaleString()} kg CO<sub>2</sub>e
          </p>
        </div>
      </div>
    </Show>
  );
}
