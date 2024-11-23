import { setStore, store } from "~/store/store";

export default function Chicken(params) {
    function handleInputChange(key: string, value: any) {
        setStore("livestock", "chicken", key, value);
    }

    return (
        <div>
            <h3 class="text-lg font-semibold">Chicken</h3>
            <input
                type="text"
                placeholder="Enter chicken data"
                onInput={(e) => handleInputChange("data", e.currentTarget.value)}
            />
        </div>
    );
}
