import { setStore, store } from "~/store/store";
import { For } from "solid-js";
import { IconTrash } from "~/components/ui/icons";
import { TextField, TextFieldInput, TextFieldLabel } from "~/components/ui/text-field";

function FeedSection() {
    function handleInputChange(index: number, field: string, value: any) {
        setStore("livestock", "cattle", "feed", index, field, value);
    }

    function addFeedRecord() {
        const currentYear = new Date().getFullYear();
        setStore("livestock", "cattle", "feed", (items = []) => [
            ...items,
            { label: "", kgsFeed: 0, year: currentYear, emissionPerKg: 0 },
        ]);
    }

    function removeFeedRecord(index: number) {
        setStore("livestock", "cattle", "feed", (items = []) =>
            items.filter((_, i) => i !== index)
        );
    }

    return (
        <div class="feed-section">
            <h3 class="text-lg font-semibold mb-4">Feed</h3>
            <For each={store.livestock.cattle.feed}>
                {(item, index) => (
                    <div class="flex gap-2 items-center">
                        <button
                            type="button"
                            class="bg-gray-700 hover:bg-red-500 hover:text-white text-white p-1 rounded flex mt-5 items-center justify-center w-8 h-8"
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
                class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mt-2"
                onClick={addFeedRecord}
            >
                Add Feed Record
            </button>
        </div>
    );
}

function CattleProductionSection() {
    function handleInputChange(section: string, field: string, value: number) {
        setStore("livestock", "cattle", "production", section, field, value);
    }

    return (
        <div class="cattle-production-section">
            <h3 class="text-lg font-semibold mb-4">Cattle Production</h3>
            
            <TextField class="w-full max-w-sm">
                <TextFieldLabel>Number of Dairy Cows</TextFieldLabel>
                <TextFieldInput
                    type="number"
                    min={0}
                    value={store.livestock.cattle.production.dairyCows.count}
                    onInput={(e) => handleInputChange("dairyCows", "count", parseInt(e.currentTarget.value))}
                />
            </TextField>

            <TextField class="w-full max-w-sm">
                <TextFieldLabel>Number of Bulls</TextFieldLabel>
                <TextFieldInput
                    type="number"
                    min={0}
                    value={store.livestock.cattle.production.bulls.count}
                    onInput={(e) => handleInputChange("bulls", "count", parseInt(e.currentTarget.value))}
                />
            </TextField>

            <TextField class="w-full max-w-sm">
                <TextFieldLabel>Meat Cattle completed</TextFieldLabel>
                <TextFieldInput
                    type="number"
                    min={0}
                    value={store.livestock.cattle.production.meatCattle.completed}
                    onInput={(e) => handleInputChange("meatCattle", "completed", parseInt(e.currentTarget.value))}
                />
            </TextField>
        </div>
    );
}

function EmissionFactorSection() {
    function handleFactorChange(section: string, value: number) {
        setStore("livestock", "cattle", "production", section, "emissionFactor", value);
    }

    const calculateEmissions = () => {
        const prod = store.livestock.cattle.production;
        
        const emissions = {
            dairyCows: prod.dairyCows.count * prod.dairyCows.emissionFactor,
            bulls: prod.bulls.count * prod.bulls.emissionFactor,
            meatCattle: prod.meatCattle.completed * prod.meatCattle.emissionFactor
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
                    <TextFieldLabel>Dairy Cows</TextFieldLabel>
                    <TextFieldInput
                        type="number"
                        step="0.1"
                        min={0}
                        value={store.livestock.cattle.production.dairyCows.emissionFactor}
                        onInput={(e) => handleFactorChange("dairyCows", parseFloat(e.currentTarget.value))}
                    />
                </TextField>
                <TextField class="w-full max-w-sm">
                    <TextFieldLabel>Bulls</TextFieldLabel>
                    <TextFieldInput
                        type="number"
                        step="0.1"
                        min={0}
                        value={store.livestock.cattle.production.bulls.emissionFactor}
                        onInput={(e) => handleFactorChange("bulls", parseFloat(e.currentTarget.value))}
                    />
                </TextField>
                <TextField class="w-full max-w-sm">
                    <TextFieldLabel>Meat Cattle</TextFieldLabel>
                    <TextFieldInput
                        type="number"
                        step="0.1"
                        min={0}
                        value={store.livestock.cattle.production.meatCattle.emissionFactor}
                        onInput={(e) => handleFactorChange("meatCattle", parseFloat(e.currentTarget.value))}
                    />
                </TextField>
            </div>

            <h3 class="text-lg font-semibold mb-4">Annual Emissions</h3>
            <ul class="list-disc pl-5">
                <li>Dairy Cows: {calculateEmissions().dairyCows.toFixed(2)} kg CO2e</li>
                <li>Bulls: {calculateEmissions().bulls.toFixed(2)} kg CO2e</li>
                <li>Meat Cattle: {calculateEmissions().meatCattle.toFixed(2)} kg CO2e</li>
            </ul>

            <p class="font-bold mt-4">
                Total CO2 Emissions: {calculateEmissions().total.toFixed(2)} kg CO2e
            </p>
        </div>
    );
}

export default function Cattle() {
    return (
        <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-4">
                <div class="border rounded-lg p-6 bg-white shadow-md">
                    <CattleProductionSection />
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
