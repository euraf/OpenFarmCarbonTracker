import { setStore, store } from "~/store/store";
import { For } from "solid-js";
import { IconTrash } from "~/components/ui/icons";
import { TextField, TextFieldInput, TextFieldLabel } from "~/components/ui/text-field";

function FeedSection() {
    function handleInputChange(index: number, field: string, value: any) {
        setStore("livestock", "chicken", "feed", index, field, value);
    }

    function addFeedRecord() {
        const currentYear = new Date().getFullYear();
        setStore("livestock", "chicken", "feed", (items = []) => [
            ...items,
            { label: "", kgsFeed: 0, year: currentYear, emissionPerKg: 0 },
        ]);
    }

    function removeFeedRecord(index: number) {
        setStore("livestock", "chicken", "feed", (items = []) =>
            items.filter((_, i) => i !== index)
        );
    }

    return (
        <div class="feed-section">
            <h3 class="text-lg font-semibold mb-4">Feed</h3>
            <For each={store.livestock.chicken.feed}>
                {(item, index) => (
                    <div class="flex gap-2 items-center">
                        <button
                            type="button"
                            class="bg-gray-700 hover:bg-red-500 hover:text-white text-white p-1 rounded-md flex mt-5 items-center justify-center w-8 h-8"
                            onClick={() => removeFeedRecord(index())}
                        >
                            <IconTrash />
                        </button>
                        <TextField class="flex-1">
                            <TextFieldLabel>Label</TextFieldLabel>
                            <TextFieldInput
                                type="text"
                                value={item.label}
                                onInput={(e) => handleInputChange(index(), "label", e.currentTarget.value)}
                            />
                        </TextField>
                        <TextField class="w-24">
                            <TextFieldLabel>Kg. feed</TextFieldLabel>
                            <TextFieldInput
                                type="number"
                                min={0}
                                value={item.kgsFeed}
                                onInput={(e) => handleInputChange(index(), "kgsFeed", Number.parseFloat(e.currentTarget.value))}
                            />
                        </TextField>
                        <TextField class="w-24">
                            <TextFieldLabel>Year</TextFieldLabel>
                            <TextFieldInput
                                type="number"
                                min="1900"
                                value={item.year}
                                onInput={(e) => handleInputChange(index(), "year", Number.parseInt(e.currentTarget.value))}
                            />
                        </TextField>
                        <TextField class="w-50">
                            <TextFieldLabel>Kg. CO2e per Kg. feed</TextFieldLabel>
                            <TextFieldInput
                                type="number"
                                min={0}
                                value={item.emissionPerKg}
                                onInput={(e) => handleInputChange(index(), "emissionPerKg", Number.parseFloat(e.currentTarget.value))}
                            />
                        </TextField>
                    </div>
                )}
            </For>
            <button
                type="button"
                class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md mt-2"
                onClick={addFeedRecord}
            >
                Add Feed Record
            </button>
        </div>
    );
}

function ChickenProductionSection() {
    function handleInputChange(section: string, field: string, value: number) {
        setStore("livestock", "chicken", "production", section, field, value);
    }

    return (
        <div class="chicken-production-section">
            <h3 class="text-lg font-semibold mb-4">Chicken Production</h3>
            
            <TextField class="w-full max-w-sm">
                <TextFieldLabel>Broilers completed</TextFieldLabel>
                <TextFieldInput
                    type="number"
                    min={0}
                    value={store.livestock.chicken.production.broilers.completed}
                    onInput={(e) => handleInputChange("broilers", "completed", parseInt(e.currentTarget.value))}
                />
            </TextField>

            <TextField class="w-full max-w-sm">
                <TextFieldLabel>Number of Egg Laying Hens</TextFieldLabel>
                <TextFieldInput
                    type="number"
                    min={0}
                    value={store.livestock.chicken.production.eggLayingHens.count}
                    onInput={(e) => handleInputChange("eggLayingHens", "count", parseInt(e.currentTarget.value))}
                />
            </TextField>
        </div>
    );
}

function EmissionFactorSection() {
    function handleFactorChange(section: string, value: number) {
        setStore("livestock", "chicken", "production", section, "emissionFactor", value);
    }

    const calculateEmissions = () => {
        const prod = store.livestock.chicken.production;
        
        const emissions = {
            broilers: prod.broilers.completed * prod.broilers.emissionFactor,
            eggLayingHens: prod.eggLayingHens.count * prod.eggLayingHens.emissionFactor
        };

        return {
            ...emissions,
            total: Object.values(emissions).reduce((sum, val) => sum + val, 0)
        };
    };

    return (
        <div class="emission-factors">
            <h3 class="text-lg font-semibold mb-4">Emission Factors (kg CO2e per animal)</h3>
            <div class="grid gap-4 mb-6">
                <TextField class="w-full max-w-sm">
                    <TextFieldLabel>Broiler emission factor</TextFieldLabel>
                    <TextFieldInput
                        type="number"
                        step="0.1"
                        min={0}
                        value={store.livestock.chicken.production.broilers.emissionFactor}
                        onInput={(e) => handleFactorChange("broilers", parseFloat(e.currentTarget.value))}
                    />
                </TextField>

                <TextField class="w-full max-w-sm">
                    <TextFieldLabel>Egg Laying Hen emission factor</TextFieldLabel>
                    <TextFieldInput
                        type="number"
                        step="0.1"
                        min={0}
                        value={store.livestock.chicken.production.eggLayingHens.emissionFactor}
                        onInput={(e) => handleFactorChange("eggLayingHens", parseFloat(e.currentTarget.value))}
                    />
                </TextField>
            </div>

            <h3 class="text-lg font-semibold mb-4">Annual Emissions</h3>
            <ul class="list-disc pl-5">
                <li>Broilers: {calculateEmissions().broilers.toFixed(2)} kg CO2e</li>
                <li>Egg Laying Hens: {calculateEmissions().eggLayingHens.toFixed(2)} kg CO2e</li>
            </ul>

            <p class="font-bold mt-4">
                Total CO2 Emissions: {calculateEmissions().total.toFixed(2)} kg CO2e
            </p>
        </div>
    );
}

export default function Chicken() {
    return (
        <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-4">
                <div class="border rounded-lg p-6 bg-white shadow-md">
                    <ChickenProductionSection />
                </div>
                <div class="border rounded-lg p-6 bg-white shadow-md">
                    <FeedSection />
                </div>
            </div>
            <div class="border rounded-lg p-6 bg-white shadow-md">
                <EmissionFactorSection />
            </div>
        </div>
    );
}
