import { Navigate } from "@solidjs/router";
import { Show } from "solid-js";
import { TextField, TextFieldInput, TextFieldLabel } from "~/components/ui/text-field";
import { conversionFactors } from "~/data/energy-and-fuel/conversion-factors";
import { setStore, store } from "~/store/store";
import { getStoreCountryName } from "~/util/countries";
import { calculateFuelEmission, defaultEnergies } from "~/util/emission";
import { ConversionUnitField } from "~/components/energy/conversion-unit-textfield";

export default function EnergyAndFuel() {
	function handleInputChange(type: string, value: number) {
		setStore("energyAndFuel", type, value);
	}

	function handleConversionFactorChange(type: string, value: number) {
		if (!store.energyAndFuel?.conversionFactors) {
			setStore("energyAndFuel", "conversionFactors", conversionFactors);
		}

		setStore("energyAndFuel", "conversionFactors", store.country, type, value);
	}

	return (
		<Show when={store.country?.length == 2} fallback={<Navigate href={"/"} />}>
			<div class="card bg-slate-100 shadow-md rounded-lg m-4 p-4 grid grid-cols-2 gap-4">
				<div class="border rounded-lg p-6 bg-white shadow-md">
					<div class="energy-and-fuel-inputs">
						<h3 class="text-lg font-semibold">Yearly Consumption</h3>

						<TextField class="grid w-full max-w-sm items-center gap-1.5">
							<TextFieldLabel for="diesel">Diesel (liters)</TextFieldLabel>
							<TextFieldInput
								type="number"
								id="diesel"
								value={defaultEnergies().diesel}
								min="0"
								onInput={(e) =>
									handleInputChange(
										"diesel",
										Math.max(0, parseFloat(e.currentTarget.value)),
									)
								}
							/>
						</TextField>
						<TextField class="grid w-full max-w-sm items-center gap-1.5">
							<TextFieldLabel for="coal">Coal (kg)</TextFieldLabel>
							<TextFieldInput
								type="number"
								id="coal"
								value={defaultEnergies().coal}
								min="0"
								onInput={(e) =>
									handleInputChange(
										"coal",
										Math.max(0, parseFloat(e.currentTarget.value)),
									)
								}
							/>
						</TextField>
						<TextField class="grid w-full max-w-sm items-center gap-1.5">
							<TextFieldLabel for="biogas">
								Biogas (m<sup>3</sup>)
							</TextFieldLabel>
							<TextFieldInput
								type="number"
								id="biogas"
								value={defaultEnergies().biogas}
								min="0"
								onInput={(e) =>
									handleInputChange(
										"biogas",
										Math.max(0, parseFloat(e.currentTarget.value)),
									)
								}
							/>
						</TextField>
						<TextField class="grid w-full max-w-sm items-center gap-1.5">
							<TextFieldLabel for="electricity">
								Electricity (kWh)
							</TextFieldLabel>
							<TextFieldInput
								type="number"
								id="electricity"
								value={defaultEnergies().electricity}
								min="0"
								onInput={(e) =>
									handleInputChange(
										"electricity",
										Math.max(0, parseFloat(e.currentTarget.value)),
									)
								}
							/>
						</TextField>
					</div>
				</div>
				<div class="border rounded-lg p-6 bg-white shadow-md">
					<div class="energy-and-fuel-summary">
						<h4 class="text-md font-semibold mt-2">
							Conversion Units for {getStoreCountryName()}
						</h4>
						<a target="_blank" class="text-blue-500 block mb-2" href="https://github.com/euraf/OpenFarmCarbonTracker/blob/78d17ca0991d09de98cde370b96272c52f0b1cd5/carbon-tracker/src/data/energy-and-fuel/conversion-factors.ts">Update sources</a>
						<div class="grid gap-4">
							<ConversionUnitField
								label="Diesel"
								value={() => defaultEnergies().conversionFactors[store.country].diesel}
								defaultValue={conversionFactors[store.country].diesel}
								onChange={(value) => handleConversionFactorChange("diesel", value)}
								unit="kg CO2 per liter"
							/>
							<ConversionUnitField
								label="Coal"
								value={() => defaultEnergies().conversionFactors[store.country].coal}
								defaultValue={conversionFactors[store.country].coal}
								onChange={(value) => handleConversionFactorChange("coal", value)}
								unit="kg CO2 per kg"
							/>
							<ConversionUnitField
								label="Biogas"
								value={() => defaultEnergies().conversionFactors[store.country].biogas}
								defaultValue={conversionFactors[store.country].biogas}
								onChange={(value) => handleConversionFactorChange("biogas", value)}
								unit="kg CO2 per m³"
							/>
							<ConversionUnitField
								label="Electricity"
								value={() => defaultEnergies().conversionFactors[store.country].electricity}
								defaultValue={conversionFactors[store.country].electricity}
								onChange={(value) => handleConversionFactorChange("electricity", value)}
								unit="kg CO2 per kWh"
							/>
						</div>

						<h4 class="text-lg font-semibold">Energy and Fuel Usage Summary</h4>
						<ul class="list-disc pl-5">
							<li>Diesel: {defaultEnergies().diesel.toFixed(2)} liters</li>
							<li>Coal: {defaultEnergies().coal.toFixed(2)} kg</li>
							<li>
								Biogas: {defaultEnergies().biogas.toFixed(2)} m<sup>3</sup>
							</li>
							<li>
								Electricity: {defaultEnergies().electricity.toFixed(2)} kWh
							</li>
						</ul>
						<h4 class="text-md font-semibold mt-2">Yealry CO2 Emissions</h4>
						<ul class="list-disc pl-5">
							<li>
								Diesel CO2:{" "}
								{(
									defaultEnergies().diesel *
									defaultEnergies().conversionFactors[store.country].diesel
								).toFixed(2)}{" "}
								kg
							</li>
							<li>
								Coal CO2:{" "}
								{(
									defaultEnergies().coal * defaultEnergies().conversionFactors[store.country].coal
								).toFixed(2)}{" "}
								kg
							</li>
							<li>
								Biogas CO2:{" "}
								{(
									defaultEnergies().biogas *
									defaultEnergies().conversionFactors[store.country].biogas
								).toFixed(2)}{" "}
								kg
							</li>
							<li>
								Electricity CO2:{" "}
								{(
									defaultEnergies().electricity *
									defaultEnergies().conversionFactors[store.country].electricity
								).toFixed(2)}{" "}
								kg
							</li>
						</ul>
						{/* <p class="font-bold mt-2">
							Total CO2 Emissions:{" "}
							{Number(calculateFuelEmission().toFixed(2)).toLocaleString()} kg
							CO<sub>2</sub>e
						</p> */}
					</div>
				</div>
			</div>
		</Show>
	);
}
