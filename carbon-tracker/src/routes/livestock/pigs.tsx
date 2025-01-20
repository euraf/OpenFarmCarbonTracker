import { DEFAULT_PIG_PRODUCTION_CONFIG, setStore, store } from "~/store/store";
import { createMemo, createSignal, For, Show } from "solid-js";
import { IconSearch, IconTrash, IconUpdates } from "~/components/ui/icons";
import { TextField, TextFieldInput, TextFieldLabel } from "~/components/ui/text-field";
import { cn } from "~/lib/utils";
import { DEFAULT_PIG_EMISSION_FACTORS } from "~/data/livestock/emission-factors";
import { EmissionFactorField } from "~/components/livestock/emission-factor-textfield";

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

function PigProductionSection(props: { setInspectYear: (year: number) => void }) {
    
    function handleInputChange(configIndex: number, section: string, field: string, value: number) {
        if (section === "year") {
            const configs = store.livestock.pigs.production.configurations;
            const prevYear = configIndex > 0 ? configs[configIndex - 1].year : -Infinity;
            const nextYear = configIndex < configs.length - 1 ? configs[configIndex + 1].year : Infinity;
            
            // Ensure year stays between previous and next config years
            if (value <= prevYear || value >= nextYear) {
                return;
            }

            setStore("livestock", "pigs", "production", "configurations", configIndex, "year", value);
        } else {
            setStore("livestock", "pigs", "production", "configurations", configIndex, "config", section, field, value);
        }
    }

    function addNewYearConfig() {
        
        
        setStore("livestock", "pigs", "production", "configurations", 
          configs => {
            const maxYear = configs.length > 0 
              ? Math.max(...configs.map(c => c.year))
              : store.startYear;
            return [...configs, {
              year: maxYear + 1,
              config: DEFAULT_PIG_PRODUCTION_CONFIG
            }];
          }
        );
    }

    function removeConfig(index: number) {
        setStore("livestock", "pigs", "production", "configurations", 
            configs => configs.filter((_, i) => i !== index)
        );
    }

    return (
        <div class="pig-production-section">
            <div class="mb-6">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-semibold">Amount of Pigs</h3>
                   
                </div>

                <div class="overflow-x-auto">
                    <div class="flex gap-4 min-w-min pb-4">
                        <For each={store.livestock.pigs.production.configurations}>
                            {(config, index) => {
                                
                                return (
                                    <div class={cn(
                                        "border-2 rounded-lg p-4 bg-white min-w-[320px] relative",
                                    )}>
                                        {/* <button
                                            type="button"
                                            class="absolute top-2 right-12 bg-gray-700 hover:bg-red-500 hover:text-white text-white p-1 rounded-md flex items-center justify-center w-8 h-8"
                                            onClick={() => props.setInspectYear(config.year)}
                                        >
                                                <IconSearch />
                                        </button>
                                         */}
                                        <button
                                            disabled={index() == 0}
                                            type="button"
                                            class={`absolute top-2 right-2  ${index() !== 0 ? "hover:bg-red-500 bg-gray-700" : "bg-gray-400"} hover:text-white text-white p-1 rounded-md flex items-center justify-center w-8 h-8`}
                                            onClick={() => removeConfig(index())}
                                        >
                                                <IconTrash />
                                        </button>
                                                
                                        <TextField class="w-full max-w-sm mb-4">
                                            <TextFieldLabel>From Year</TextFieldLabel>
                                            <TextFieldInput
                                                type="number"
                                                min={(index() > 0 ? store.livestock.pigs.production.configurations[index() - 1].year : -Infinity) + 1}
                                                max={(index() < store.livestock.pigs.production.configurations.length - 1 ? store.livestock.pigs.production.configurations[index() + 1].year : Infinity) - 1}
                                                value={config.year}
                                                disabled={index() === 0}
                                                onInput={(e) => handleInputChange(index(), "year", "value", Number.parseInt(e.currentTarget.value))}
                                            />
                                        </TextField>

                                        <TextField class="w-full max-w-sm">
                                            <TextFieldLabel>Farrowing stages completed (0-3 weeks age)</TextFieldLabel>
                                            <TextFieldInput
                                                type="number"
                                                min={0}
                                                value={config.config.farrowing.completed}
                                                onInput={(e) => handleInputChange(index(), "farrowing", "completed", Number.parseInt(e.currentTarget.value))}
                                            />
                                        </TextField>
                                        <TextField class="w-full max-w-sm">
                                            <TextFieldLabel>Nursery stage completed (3-9 weeks)</TextFieldLabel>
                                            <TextFieldInput
                                                type="number"
                                                min={0}
                                                value={config.config.nursery.completed}
                                                onInput={(e) => handleInputChange(index(), "nursery", "completed", Number.parseInt(e.currentTarget.value))}
                                            />
                                        </TextField>
                                        <TextField class="w-full max-w-sm">
                                            <TextFieldLabel>Finishers stage completed (9-28 weeks)</TextFieldLabel>
                                            <TextFieldInput
                                                type="number"
                                                min={0}
                                                value={config.config.finishers.completed}
                                                onInput={(e) => handleInputChange(index(), "finishers", "completed", Number.parseInt(e.currentTarget.value))}
                                            />
                                        </TextField>
                                        <TextField class="w-full max-w-sm">
                                            <TextFieldLabel>Number of Sows at the farm</TextFieldLabel>
                                            <TextFieldInput
                                                type="number"
                                                min={0}
                                                value={config.config.sows.count}
                                                onInput={(e) => handleInputChange(index(), "sows", "count", Number.parseInt(e.currentTarget.value))}
                                            />
                                        </TextField>
                                        <TextField class="w-full max-w-sm">
                                            <TextFieldLabel>Number of Boars at the farm</TextFieldLabel>
                                            <TextFieldInput
                                                type="number"
                                                min={0}
                                                value={config.config.boars.count}
                                                onInput={(e) => handleInputChange(index(), "boars", "count", Number.parseInt(e.currentTarget.value))}
                                            />
                                        </TextField>
                                    </div>
                                );
                            }}
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
        </div>
    );
}

function EmissionSummarySection(props:{year:()=>number}) {
    const calculateEmissions = createMemo(() => {
        const currentYear = props.year();
        const configs = store.livestock.pigs.production.configurations;
        const currentConfig = ()=>[...configs]
        .sort((a, b) => b.year - a.year)
        .find(c => c.year <= currentYear)?.config || configs[0].config;
        
        const emissions = {
            farrowing: currentConfig().farrowing.completed * currentConfig().farrowing.emissionFactor,
            nursery: currentConfig().nursery.completed * currentConfig().nursery.emissionFactor,
            finishers: currentConfig().finishers.completed * currentConfig().finishers.emissionFactor,
            sows: currentConfig().sows.count * currentConfig().sows.emissionFactor,
            boars: currentConfig().boars.count * currentConfig().boars.emissionFactor
        };

        return {
            ...emissions,
            total: Object.values(emissions).reduce((sum, val) => sum + val, 0)
        };
    });

    function handleFactorChange(section: string, value: number) {
        // Update emission factor for all configurations

        console.log(value, section)
        setStore("livestock", "pigs", "production", "configurations", 
            configs => configs.map(c => ({
                ...c,
                config: {
                    ...c.config,
                    [section]: { ...c.config[section], emissionFactor: value }
                }
            }))
        );
    }

    const currentConfig = () => store.livestock.pigs.production.configurations[0].config;

    return (
        <div class="emission-summary">
            <h3 class="text-lg font-semibold mb-4">Emission Factors (kg CO2e per pig)</h3>
            <a target="_blank" class="text-blue-500 block mb-2" href="https://github.com/euraf/OpenFarmCarbonTracker/blob/78d17ca0991d09de98cde370b96272c52f0b1cd5/carbon-tracker/src/data/livestock/emission-factors.ts#L1-L7">Update sources</a>
            <div class="grid gap-4 mb-6">
                <EmissionFactorField
                    label="Farrowing (0-3 weeks)"
                    value={() => currentConfig().farrowing.emissionFactor}
                    defaultValue={DEFAULT_PIG_EMISSION_FACTORS.farrowing}
                    onChange={(value) => handleFactorChange("farrowing", value)}
                />
                <EmissionFactorField
                    label="Nursery (3-9 weeks)"
                    value={() => currentConfig().nursery.emissionFactor}
                    defaultValue={DEFAULT_PIG_EMISSION_FACTORS.nursery}
                    onChange={(value) => handleFactorChange("nursery", value)}
                />
                <EmissionFactorField
                    label="Finishers (9-28 weeks)"
                    value={() => currentConfig().finishers.emissionFactor}
                    defaultValue={DEFAULT_PIG_EMISSION_FACTORS.finishers}
                    onChange={(value) => handleFactorChange("finishers", value)}
                />
                <EmissionFactorField
                    label="Sows"
                    value={() => currentConfig().sows.emissionFactor}
                    defaultValue={DEFAULT_PIG_EMISSION_FACTORS.sows}
                    onChange={(value) => handleFactorChange("sows", value)}
                />
                <EmissionFactorField
                    label="Boars"
                    value={() => currentConfig().boars.emissionFactor}
                    defaultValue={DEFAULT_PIG_EMISSION_FACTORS.boars}
                    onChange={(value) => handleFactorChange("boars", value)}
                />
            </div>
        </div>
    );
}

export default function Pigs() {

    const [inspectYear, setInspectYear] = createSignal(store.startYear);

    return (
        <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-4">
                <div class="border rounded-lg p-6 bg-white shadow-md">
                    <PigProductionSection setInspectYear={setInspectYear} />
                </div>
                <div class="border rounded-lg p-6 bg-white shadow-md">
                    <FeedSection />
                </div>
            </div>
            <div class="border rounded-lg p-6 bg-white shadow-md">
                <EmissionSummarySection year={inspectYear} />
            </div>
        </div>
    );
}