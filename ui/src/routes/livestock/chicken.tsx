import { setStore, store } from "~/store/store";

export default function Chicken(params) {
	function handleInputChange(key: string, value: any) {
		setStore("livestock", "chicken", key, value);
	}

	return (
		<div class="flex flex-col gap-4">
			<div class="border rounded-lg p-6 bg-white shadow-md">
				<h3 class="text-lg font-semibold">Chicken</h3>
				<input
					type="text"
					placeholder="Enter chicken data"
					onInput={(e) => handleInputChange("data", e.currentTarget.value)}
				/>
			</div>
		</div>
	);
}
