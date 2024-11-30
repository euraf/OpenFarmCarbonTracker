import { createSignal } from "solid-js";
import { countries } from "~/util/countries";
import { setStore, store } from "~/store/store";
import { Button } from "~/components/ui/button";

export default function SettingsComponent() {
    const [selectedCountry, setSelectedCountry] = createSignal(store.country || "");
    const [startYear, setStartYear] = createSignal(store.startYear || "");
    const [showMessage, setShowMessage] = createSignal(false);

    function handleSave() {
        if (selectedCountry()) {
            setStore("country", selectedCountry());
        }
        if (startYear()) {
            setStore("startYear", parseInt(startYear()));
        }
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 3000); // Hide message after 3 seconds
        if (window.location.pathname === "/") {
            window.location.reload();
        }
    }

    return (
        <div class="max-w-xs mt-4 mx-auto bg-white p-5 rounded-lg shadow-md text-center">
            <h2 class="text-lg font-semibold mb-4">Settings</h2>
            <div class="mb-3">
                <label for="country" class="block text-left mb-1">Country</label>
                <select
                    id="country"
                    value={selectedCountry()}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    class="w-full p-2 rounded-md border border-gray-300"
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
                    value={startYear()}
                    onInput={(e) => setStartYear(e.currentTarget.value)}
                    class="w-full p-2 rounded-md border border-gray-300"
                />
            </div>
            <Button onClick={handleSave} class="w-full">
                Save
            </Button>
            {showMessage() && (
                <div class="mt-3 text-green-500">
                    Settings saved successfully!
                </div>
            )}
        </div>
    );
}