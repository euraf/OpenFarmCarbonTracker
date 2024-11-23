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
            <h4 class="text-md font-semibold mb-4">Feed</h4>
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
                                onInput={(e) => handleInputChange(index(), "kgsFeed", parseFloat(e.currentTarget.value))}
                            />
                        </TextField>
                        <TextField class="w-24">
                            <TextFieldLabel>Year</TextFieldLabel>
                            <TextFieldInput
                                type="number"
                                min="1900"
                                value={item.year}
                                onInput={(e) => handleInputChange(index(), "year", parseInt(e.currentTarget.value))}
                            />
                        </TextField>
                        <TextField class="w-50">
                            <TextFieldLabel>Emission per Kg</TextFieldLabel>
                            <TextFieldInput
                                type="number"
                                value={item.emissionPerKg}
                                onInput={(e) => handleInputChange(index(), "emissionPerKg", parseFloat(e.currentTarget.value))}
                            />
                        </TextField>
                    </div>
                )}
            </For>
            <button
                class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mt-2"
                onClick={addFeedRecord}
            >
                Add Feed Record
            </button>
        </div>
    );
}

export default function Pigs(params) {
    return (
        <div>
            <h3 class="text-lg font-semibold">Pigs</h3>
            <FeedSection />
        </div>  
    )
}