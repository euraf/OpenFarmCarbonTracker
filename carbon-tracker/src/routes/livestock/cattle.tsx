import { DEFAULT_CATTLE_PRODUCTION_CONFIG, setStore, store } from "~/store/store";
import { For, Show } from "solid-js";
import { IconTrash, IconUpdates } from "~/components/ui/icons";
import { TextField, TextFieldInput, TextFieldLabel } from "~/components/ui/text-field";
import { DEFAULT_CATTLE_EMISSION_FACTORS } from "~/data/livestock/emission-factors";

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

function CattleProductionSection() {
    function handleInputChange(configIndex: number, section: string, field: string, value: number) {
        if (section === "year") {
            const configs = store.livestock.cattle.production.configurations;
            const prevYear = configIndex > 0 ? configs[configIndex - 1].year : -Infinity;
            const nextYear = configIndex < configs.length - 1 ? configs[configIndex + 1].year : Infinity;
            
            if (value <= prevYear || value >= nextYear) {
                return;
            }

            setStore("livestock", "cattle", "production", "configurations", configIndex, "year", value);
        } else {
            setStore("livestock", "cattle", "production", "configurations", configIndex, "config", section, field, value);
        }
    }

    function addNewYearConfig() {
        setStore("livestock", "cattle", "production", "configurations", 
            configs => {
                const maxYear = configs.length > 0 
                    ? Math.max(...configs.map(c => c.year))
                    : store.startYear;
                return [...configs, {
                    year: maxYear + 1,
                    config: DEFAULT_CATTLE_PRODUCTION_CONFIG
                }];
            }
        );
    }

    function removeConfig(index: number) {
        setStore("livestock", "cattle", "production", "configurations", 
            configs => configs.filter((_, i) => i !== index)
        );
    }

    return (
        <div class="cattle-production-section">
            <h3 class="text-lg font-semibold mb-4">Cattle Production</h3>
            <div class="overflow-x-auto">
                <div class="flex gap-4 min-w-min pb-4">
                    <For each={store.livestock.cattle.production.configurations}>
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
                                    <TextFieldLabel>Number of Dairy Cows</TextFieldLabel>
                                    <TextFieldInput
                                        type="number"
                                        min={0}
                                        value={config.config.dairyCows.count}
                                        onInput={(e) => handleInputChange(index(), "dairyCows", "count", parseInt(e.currentTarget.value))}
                                    />
                                </TextField>

                                <TextField class="w-full max-w-sm">
                                    <TextFieldLabel>Number of Bulls</TextFieldLabel>
                                    <TextFieldInput
                                        type="number"
                                        min={0}
                                        value={config.config.bulls.count}
                                        onInput={(e) => handleInputChange(index(), "bulls", "count", parseInt(e.currentTarget.value))}
                                    />
                                </TextField>

                                <TextField class="w-full max-w-sm">
                                    <TextFieldLabel>Meat Cattle completed</TextFieldLabel>
                                    <TextFieldInput
                                        type="number"
                                        min={0}
                                        value={config.config.meatCattle.completed}
                                        onInput={(e) => handleInputChange(index(), "meatCattle", "completed", parseInt(e.currentTarget.value))}
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
        setStore("livestock", "cattle", "production", "configurations", 0, "config", section, "emissionFactor", value);
    }

    return (
        <div class="emission-factors">
            <h3 class="text-lg font-semibold mb-4">Emission Factors (kg CO2e per animal)</h3>
            <a class="text-blue-500 block mb-2" href="https://github.com/euraf/OpenFarmCarbonTracker/blob/78d17ca0991d09de98cde370b96272c52f0b1cd5/carbon-tracker/src/data/livestock/emission-factors.ts#L9-L13">Update sources</a>

            <div class="grid gap-4 mb-6">
                <TextField class="w-full max-w-sm">
                    <TextFieldLabel>Dairy Cows</TextFieldLabel>
                    <div class="flex items-center">
                        <TextFieldInput
                            type="number"
                            class={store.livestock.cattle.production.configurations[0].config.dairyCows.emissionFactor !== DEFAULT_CATTLE_EMISSION_FACTORS.dairyCows ? `border-blue-500 border-4`: ''}
                            step="0.1"
                            min={0}
                            value={store.livestock.cattle.production.configurations[0].config.dairyCows.emissionFactor}
                            onInput={(e) => handleFactorChange("dairyCows", parseFloat(e.currentTarget.value))}
                        />
                        <Show when={store.livestock.cattle.production.configurations[0].config.dairyCows.emissionFactor !== DEFAULT_CATTLE_EMISSION_FACTORS.dairyCows}>
                            <IconUpdates color="black" class="ml-2" height={30} onclick={() => handleFactorChange("dairyCows", DEFAULT_CATTLE_EMISSION_FACTORS.dairyCows)} />
                        </Show>
                    </div>
                </TextField>
                <TextField class="w-full max-w-sm">
                    <TextFieldLabel>Bulls</TextFieldLabel>
                    <div class="flex items-center">
                        <TextFieldInput
                            type="number"
                            class={store.livestock.cattle.production.configurations[0].config.bulls.emissionFactor !== DEFAULT_CATTLE_EMISSION_FACTORS.bulls ? `border-blue-500 border-4`: ''}
                            step="0.1"
                            min={0}
                            value={store.livestock.cattle.production.configurations[0].config.bulls.emissionFactor}
                            onInput={(e) => handleFactorChange("bulls", parseFloat(e.currentTarget.value))}
                        />
                        <Show when={store.livestock.cattle.production.configurations[0].config.bulls.emissionFactor !== DEFAULT_CATTLE_EMISSION_FACTORS.bulls}>
                            <IconUpdates color="black" class="ml-2" height={30} onclick={() => handleFactorChange("bulls", DEFAULT_CATTLE_EMISSION_FACTORS.bulls)} />
                        </Show>
                    </div>
                </TextField>
                <TextField class="w-full max-w-sm">
                    <TextFieldLabel>Meat Cattle</TextFieldLabel>
                    <div class="flex items-center">
                        <TextFieldInput
                            type="number"
                            class={store.livestock.cattle.production.configurations[0].config.meatCattle.emissionFactor !== DEFAULT_CATTLE_EMISSION_FACTORS.meatCattle ? `border-blue-500 border-4`: ''}
                            step="0.1"
                            min={0}
                            value={store.livestock.cattle.production.configurations[0].config.meatCattle.emissionFactor}
                            onInput={(e) => handleFactorChange("meatCattle", parseFloat(e.currentTarget.value))}
                        />
                        <Show when={store.livestock.cattle.production.configurations[0].config.meatCattle.emissionFactor !== DEFAULT_CATTLE_EMISSION_FACTORS.meatCattle}>
                            <IconUpdates color="black" class="ml-2" height={30} onclick={() => handleFactorChange("meatCattle", DEFAULT_CATTLE_EMISSION_FACTORS.meatCattle)} />
                        </Show>
                    </div>
                </TextField>
            </div>
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
