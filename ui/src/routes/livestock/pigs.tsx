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
                            <TextFieldLabel>Kgs Feed</TextFieldLabel>
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
                            <TextFieldLabel>Emission per Kg</TextFieldLabel>
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
    function handleInputChange(key: string, value: number) {
        setStore("livestock", "pigs", key, value);
    }

    return (
        <div class="pig-production-section">
            <h3 class="text-lg font-semibold mb-4">Pig Production</h3>

            <p class="text-gray-600 text-md mb-4">Please enter annual numbers for the pig production below.</p>

            <TextField class="w-full max-w-sm">
                <TextFieldLabel>Farrowing stages completed (0-3 weeks age)</TextFieldLabel>
                <TextFieldInput
                    type="number"
                    value={store.livestock.pigs.farrowingCompleted || 0}
                    onInput={(e) => handleInputChange("farrowingCompleted", Number.parseInt(e.currentTarget.value))}
                />
            </TextField>
            <TextField class="w-full max-w-sm">
                <TextFieldLabel>Nursery stage completed (3-9 weeks of age)</TextFieldLabel>
                <TextFieldInput
                    type="number"
                    value={store.livestock.pigs.nurseryCompleted || 0}
                    onInput={(e) => handleInputChange("nurseryCompleted", Number.parseInt(e.currentTarget.value))}
                />
            </TextField>
            <TextField class="w-full max-w-sm">
                <TextFieldLabel>Finishers stage completed (9-28 weeks of age)</TextFieldLabel>
                <TextFieldInput
                    type="number"
                    value={store.livestock.pigs.finishersCompleted || 0}
                    onInput={(e) => handleInputChange("finishersCompleted", Number.parseInt(e.currentTarget.value))}
                />
            </TextField>
            <TextField class="w-full max-w-sm">
                <TextFieldLabel>Number of Sows at the farm</TextFieldLabel>
                <TextFieldInput
                    type="number"
                    value={store.livestock.pigs.numberOfSows || 0}
                    onInput={(e) => handleInputChange("numberOfSows", Number.parseInt(e.currentTarget.value))}
                />
            </TextField>
            <TextField class="w-full max-w-sm">
                <TextFieldLabel>Number of Boars at the farm</TextFieldLabel>
                <TextFieldInput
                    type="number"
                    value={store.livestock.pigs.numberOfBoars || 0}
                    onInput={(e) => handleInputChange("numberOfBoars", Number.parseInt(e.currentTarget.value))}
                />
            </TextField>
        </div>
    );
}

export default function Pigs(params) {
    return (
        <div class="flex flex-col gap-4">
            <div class="border rounded-lg p-6 bg-white shadow-md">
                <PigProductionSection />
            </div>
            
            <div class="border rounded-lg p-6 bg-white shadow-md">
                <FeedSection />
            </div>
        </div>  
    )
}