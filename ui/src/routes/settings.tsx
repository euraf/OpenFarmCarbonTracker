import { createEffect } from "solid-js";
import { setStore, store } from "~/store/store";
import { countries } from "~/util/countries";
import { Button } from "~/components/ui/button";

export default function Settings() {
    createEffect(() => {
        if (!store.startYear) {
            setStore("startYear", new Date().getFullYear());
        }
    });


    return (
        <div class="max-w-xs mt-4 mx-auto bg-white p-5 rounded-lg shadow-md text-center">
            <h2 class="text-lg font-semibold mb-4">Settings</h2>
            <div class="mb-3">
                <label for="country" class="block text-left mb-1">Country</label>
                <select
                    id="country"
                    value={store.country}
                    onChange={(e) => setStore("country", e.target.value)}
                    class="w-full p-2 rounded border border-gray-300"
                >
                    <option value="" disabled>
                        Select a country
                    </option>
                    {countries.map((country) => (
                        <option value={country.code}>{country.name}</option>
                    ))}
                </select>
            </div>
            <div class="mb-3">
                <label for="startYear" class="block text-left mb-1">Start Year</label>
                <input
                    id="startYear"
                    type="number"
                    min="1900"
                    value={store.startYear}
                    onInput={(e) => setStore("startYear", parseInt(e.currentTarget.value))}
                    class="w-full p-2 rounded border border-gray-300"
                />
            </div>
        </div>
    );
}
