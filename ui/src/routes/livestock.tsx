import { Navigate } from "@solidjs/router";
import { Show } from "solid-js";
import {
  TextField,
  TextFieldInput,
  TextFieldLabel,
} from "~/components/ui/text-field";
import { setStore, store } from "~/store/store";

export default function Livestock() {
  function handleInputChange(type: string, value: number) {
    setStore("livestock", type, value);
  }

  return (
    <Show when={store.country?.length == 2} fallback={<Navigate href={"/"} />}>
      <div class="card bg-white shadow-md rounded-lg m-4 p-4 grid grid-cols-2 gap-4">
        <div class="energy-and-fuel-inputs">
          <h3 class="text-lg font-semibold">Livestock</h3>
        </div>
      </div>
    </Show>
  );
}
