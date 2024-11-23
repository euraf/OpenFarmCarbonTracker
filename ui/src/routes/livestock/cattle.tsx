import { setStore, store } from "~/store/store";

export default function Cattle(params) {
    function handleInputChange(key: string, value: any) {
        setStore("livestock", "cattle", key, value);
    }

    return (
        <div class="flex flex-col gap-4">
            <div class="border rounded-lg p-6 bg-white shadow-md">

            <h3 class="text-lg font-semibold">Cattle</h3>
            
            </div>
        </div>
        
    );
}
