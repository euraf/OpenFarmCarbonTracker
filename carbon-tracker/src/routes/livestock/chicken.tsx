import { DEFAULT_CHICKEN_PRODUCTION_CONFIG, setStore, store } from "~/store/store";
import { For, Show } from "solid-js";
import { IconTrash, IconUpdates } from "~/components/ui/icons";
import { TextField, TextFieldInput, TextFieldLabel } from "~/components/ui/text-field";
import { DEFAULT_CHICKEN_EMISSION_FACTORS } from "~/data/livestock/emission-factors";

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
    function handleInputChange(configIndex: number, section: string, field: string, value: number) {
        if (section === "year") {
            const configs = store.livestock.chicken.production.configurations;
            const prevYear = configIndex > 0 ? configs[configIndex - 1].year : -Infinity;
            const nextYear = configIndex < configs.length - 1 ? configs[configIndex + 1].year : Infinity;
            
            if (value <= prevYear || value >= nextYear) {
                return;
            }

            setStore("livestock", "chicken", "production", "configurations", configIndex, "year", value);
        } else {
            setStore("livestock", "chicken", "production", "configurations", configIndex, "config", section, field, value);
        }
    }

    function addNewYearConfig() {
        setStore("livestock", "chicken", "production", "configurations", 
            configs => {
                const maxYear = configs.length > 0 
                    ? Math.max(...configs.map(c => c.year))
                    : store.startYear;
                return [...configs, {
                    year: maxYear + 1,
                    config: DEFAULT_CHICKEN_PRODUCTION_CONFIG
                }];
            }
        );
    }

    function removeConfig(index: number) {
        setStore("livestock", "chicken", "production", "configurations", 
            configs => configs.filter((_, i) => i !== index)
        );
    }

    return (
        <div class="chicken-production-section">
            <h3 class="text-lg font-semibold mb-4">Chicken Production</h3>
            <div class="overflow-x-auto">
                <div class="flex gap-4 min-w-min pb-4">
                    <For each={store.livestock.chicken.production.configurations}>
                        {(config, index) => (
                            <div class="border-2 rounded-lg p-4 bg-white min-w-[320px] relative">
                                <button
                                    disabled={index() === 0}
                                    type="button"
                                    class={`absolute top-2 right-2 ${index() !== 0 ? "hover:bg-red-500 bg-gray-700" : "bg-gray-400"} hover:text-white text-white p-1 rounded-md flex items-center justify-center w-8 h-8`}
                                    onClick={() => removeConfig(index())}
                                >
                                    <IconTrash />
                                </button>

                                <TextField class="w-full max-w-sm mb-4">
                                    <TextFieldLabel>From Year</TextFieldLabel>
                                    <TextFieldInput
                                        type="number"
                                        min={store.startYear}
                                        value={config.year}
                                        disabled={index() === 0}
                                        onInput={(e) => handleInputChange(index(), "year", "value", Number.parseInt(e.currentTarget.value))}
                                    />
                                </TextField>

                                <TextField class="w-full max-w-sm">
                                    <TextFieldLabel>Broilers completed</TextFieldLabel>
                                    <TextFieldInput
                                        type="number"
                                        min={0}
                                        value={config.config.broilers.completed}
                                        onInput={(e) => handleInputChange(index(), "broilers", "completed", parseInt(e.currentTarget.value))}
                                    />
                                </TextField>

                                <TextField class="w-full max-w-sm">
                                    <TextFieldLabel>Number of Egg Laying Hens</TextFieldLabel>
                                    <TextFieldInput
                                        type="number"
                                        min={0}
                                        value={config.config.eggLayingHens.count}
                                        onInput={(e) => handleInputChange(index(), "eggLayingHens", "count", parseInt(e.currentTarget.value))}
                                    />
                                </TextField>
                            </div>
                        )}
                    </For>
                    <button
                        type="button"
                        class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                        onClick={addNewYearConfig}
                    >
                        Adjust amounts at a certain year
                    </button>
                </div>
            </div>
        </div>
    );
}

function EmissionFactorSection() {
    function handleFactorChange(section: string, value: number) {
        setStore("livestock", "chicken", "production", "configurations", 0, "config", section, "emissionFactor", value);
    }

    return (
        <div class="emission-factors">
            <h3 class="text-lg font-semibold mb-4">Emission Factors (kg CO2e per animal)</h3>
            <a target="_blank" class="text-blue-500 block mb-2" href="https://github.com/euraf/OpenFarmCarbonTracker/blob/78d17ca0991d09de98cde370b96272c52f0b1cd5/carbon-tracker/src/data/livestock/emission-factors.ts#L15-L18">Update sources</a>
            <div class="grid gap-4 mb-6">
                <TextField class="w-full max-w-sm">
                    <TextFieldLabel>Broiler emission factor</TextFieldLabel>
                    <div class="flex items-center">
                        <TextFieldInput
                            type="number"
                            class={store.livestock.chicken.production.configurations[0].config.broilers.emissionFactor !== DEFAULT_CHICKEN_EMISSION_FACTORS.broilers ? `border-blue-500 border-4`: ''}
                            min={0}
                            value={store.livestock.chicken.production.configurations[0].config.broilers.emissionFactor}
                            onInput={(e) => handleFactorChange("broilers", parseFloat(e.currentTarget.value))}
                        />
                        <Show when={store.livestock.chicken.production.configurations[0].config.broilers.emissionFactor !== DEFAULT_CHICKEN_EMISSION_FACTORS.broilers}>
                            <IconUpdates color="black" class="ml-2" height={30} onclick={() => handleFactorChange("broilers", DEFAULT_CHICKEN_EMISSION_FACTORS.broilers)} />
                        </Show>
                    </div>
                </TextField>

                <TextField class="w-full max-w-sm">
                    <TextFieldLabel>Egg Laying Hen emission factor</TextFieldLabel>
                    <div class="flex items-center">
                        <TextFieldInput
                            type="number"
                            class={store.livestock.chicken.production.configurations[0].config.eggLayingHens.emissionFactor !== DEFAULT_CHICKEN_EMISSION_FACTORS.eggLayingHens ? `border-blue-500 border-4`: ''}
                            min={0}
                            value={store.livestock.chicken.production.configurations[0].config.eggLayingHens.emissionFactor}
                            onInput={(e) => handleFactorChange("eggLayingHens", parseFloat(e.currentTarget.value))}
                        />
                        <Show when={store.livestock.chicken.production.configurations[0].config.eggLayingHens.emissionFactor !== DEFAULT_CHICKEN_EMISSION_FACTORS.eggLayingHens}>
                            <IconUpdates color="black" class="ml-2" height={30} onclick={() => handleFactorChange("eggLayingHens", DEFAULT_CHICKEN_EMISSION_FACTORS.eggLayingHens)} />
                        </Show>
                    </div>
                </TextField>
            </div>

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
