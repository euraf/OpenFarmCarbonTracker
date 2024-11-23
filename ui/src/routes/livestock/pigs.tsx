import { setStore, store } from "~/store/store";
import { For } from "solid-js";
import { IconTrash } from "~/components/ui/icons";
import { TextField, TextFieldInput, TextFieldLabel } from "~/components/ui/text-field";

type FeedRecord = {
    label: string;
    kgsFeed: number;
    year: number;
    emissionPerKg: number;
};

function FeedSection() {
    function handleInputChange(index: number, field: keyof FeedRecord, value: string | number) {
        setStore("livestock", "pigs", "feed", index, field, value);
    }

    function addFeedRecord() {
        const currentYear = new Date().getFullYear();
        setStore("livestock", "pigs", "feed", (items: FeedRecord[] = []) => [
            ...items,
            { label: "", kgsFeed: 0, year: currentYear, emissionPerKg: 0 },
        ]);
    }

    function removeFeedRecord(index: number) {
        setStore("livestock", "pigs", "feed", (items: FeedRecord[] = []) =>
            items.filter((_, i) => i !== index)
        );
    }

    return (
        <div class="feed-section">
            <h3 class="text-lg font-semibold mb-4">Feed</h3>

            

            <For each={store.livestock.pigs.feed}>
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

function PigProductionSection() {
    function handleInputChange(section: string, field: string, value: number) {
        setStore("livestock", "pigs", "production", section, field, value);
    }

    return (
        <div class="pig-production-section">
            <h3 class="text-lg font-semibold mb-4">Pig Production</h3>
            <p class="text-gray-600 text-md mb-4">Please enter annual numbers for the pig production below.</p>

            <TextField class="w-full max-w-sm">
                <TextFieldLabel>Farrowing stages completed (0-3 weeks age)</TextFieldLabel>
                <TextFieldInput
                    type="number"
                    value={store.livestock.pigs.production.farrowing.completed}
                    onInput={(e) => handleInputChange("farrowing", "completed", Number.parseInt(e.currentTarget.value))}
                />
            </TextField>
            <TextField class="w-full max-w-sm">
                <TextFieldLabel>Nursery stage completed (3-9 weeks of age)</TextFieldLabel>
                <TextFieldInput
                    type="number"
                    value={store.livestock.pigs.production.nursery.completed}
                    onInput={(e) => handleInputChange("nursery", "completed", Number.parseInt(e.currentTarget.value))}
                />
            </TextField>
            <TextField class="w-full max-w-sm">
                <TextFieldLabel>Finishers stage completed (9-28 weeks of age)</TextFieldLabel>
                <TextFieldInput
                    type="number"
                    value={store.livestock.pigs.production.finishers.completed}
                    onInput={(e) => handleInputChange("finishers", "completed", Number.parseInt(e.currentTarget.value))}
                />
            </TextField>
            <TextField class="w-full max-w-sm">
                <TextFieldLabel>Number of Sows at the farm</TextFieldLabel>
                <TextFieldInput
                    type="number"
                    value={store.livestock.pigs.production.sows.count}
                    onInput={(e) => handleInputChange("sows", "count", Number.parseInt(e.currentTarget.value))}
                />
            </TextField>
            <TextField class="w-full max-w-sm">
                <TextFieldLabel>Number of Boars at the farm</TextFieldLabel>
                <TextFieldInput
                    type="number"
                    value={store.livestock.pigs.production.boars.count}
                    onInput={(e) => handleInputChange("boars", "count", Number.parseInt(e.currentTarget.value))}
                />
            </TextField>
        </div>
    );
}

function EmissionSummarySection() {
    const calculateEmissions = () => {
        const prod = store.livestock.pigs.production;
        
        const emissions = {
            farrowing: prod.farrowing.completed * prod.farrowing.emissionFactor,
            nursery: prod.nursery.completed * prod.nursery.emissionFactor,
            finishers: prod.finishers.completed * prod.finishers.emissionFactor,
            sows: prod.sows.count * prod.sows.emissionFactor,
            boars: prod.boars.count * prod.boars.emissionFactor
        };

        return {
            ...emissions,
            total: Object.values(emissions).reduce((sum, val) => sum + val, 0)
        };
    };

    function handleFactorChange(section: string, value: number) {
        setStore("livestock", "pigs", "production", section, "emissionFactor", value);
    }

    return (
        <div class="emission-summary">
            <h3 class="text-lg font-semibold mb-4">Emission Factors (kg CO2e per pig)</h3>
            <div class="grid gap-4 mb-6">
                <TextField class="w-full max-w-sm">
                    <TextFieldLabel>Farrowing (0-3 weeks)</TextFieldLabel>
                    <TextFieldInput
                        type="number"
                        step="0.1"
                        value={store.livestock.pigs.production.farrowing.emissionFactor}
                        onInput={(e) => handleFactorChange("farrowing", Number.parseFloat(e.currentTarget.value))}
                    />
                </TextField>
                <TextField class="w-full max-w-sm">
                    <TextFieldLabel>Nursery (3-9 weeks)</TextFieldLabel>
                    <TextFieldInput
                        type="number"
                        step="0.1"
                        value={store.livestock.pigs.production.nursery.emissionFactor}
                        onInput={(e) => handleFactorChange("nursery", Number.parseFloat(e.currentTarget.value))}
                    />
                </TextField>
                <TextField class="w-full max-w-sm">
                    <TextFieldLabel>Finishers (9-28 weeks)</TextFieldLabel>
                    <TextFieldInput
                        type="number"
                        step="0.1"
                        value={store.livestock.pigs.production.finishers.emissionFactor}
                        onInput={(e) => handleFactorChange("finishers", Number.parseFloat(e.currentTarget.value))}
                    />
                </TextField>
                <TextField class="w-full max-w-sm">
                    <TextFieldLabel>Sows</TextFieldLabel>
                    <TextFieldInput
                        type="number"
                        step="0.1"
                        value={store.livestock.pigs.production.sows.emissionFactor}
                        onInput={(e) => handleFactorChange("sows", Number.parseFloat(e.currentTarget.value))}
                    />
                </TextField>
                <TextField class="w-full max-w-sm">
                    <TextFieldLabel>Boars</TextFieldLabel>
                    <TextFieldInput
                        type="number"
                        step="0.1"
                        value={store.livestock.pigs.production.boars.emissionFactor}
                        onInput={(e) => handleFactorChange("boars", Number.parseFloat(e.currentTarget.value))}
                    />
                </TextField>
            </div>

            <h3 class="text-lg font-semibold mb-4">Annual Emissions</h3>
            <ul class="list-disc pl-5">
                <li>Farrowing: {calculateEmissions().farrowing.toFixed(2)} kg CO2e</li>
                <li>Nursery: {calculateEmissions().nursery.toFixed(2)} kg CO2e</li>
                <li>Finishers: {calculateEmissions().finishers.toFixed(2)} kg CO2e</li>
                <li>Sows: {calculateEmissions().sows.toFixed(2)} kg CO2e</li>
                <li>Boars: {calculateEmissions().boars.toFixed(2)} kg CO2e</li>
            </ul>

            <p class="font-bold mt-4">
                Total CO2 Emissions: {calculateEmissions().total.toFixed(2)} kg CO2e
            </p>
        </div>
    );
}

export default function Pigs(params) {
    return (
        <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-4">
                <div class="border rounded-lg p-6 bg-white shadow-md">
                    <PigProductionSection />
                </div>
                <div class="border rounded-lg p-6 bg-white shadow-md">
                    <FeedSection />
                </div>
            </div>
            <div class="border rounded-lg p-6 bg-white shadow-md">
                <EmissionSummarySection />
            </div>
        </div>
    );
}