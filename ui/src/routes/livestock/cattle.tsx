import { setStore, store } from "~/store/store";

export default function Cattle(params) {
    function handleInputChange(key: string, value: any) {
        setStore("livestock", "cattle", key, value);
    }

    return (
        <div>
            <h3 class="text-lg font-semibold">Cattle</h3>
            <input
                type="text"
                placeholder="Enter cattle data"
                onInput={(e) => handleInputChange("data", e.currentTarget.value)}
            />
        </div>
    );
}
