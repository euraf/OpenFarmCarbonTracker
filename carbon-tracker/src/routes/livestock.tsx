
import { Navigate, Route } from "@solidjs/router";
import { children, Show } from "solid-js";
import { Link } from "~/components/ui/navbar";
import {
  TextField,
  TextFieldInput,
  TextFieldLabel,
} from "~/components/ui/text-field";
import { setStore, store } from "~/store/store";

export default function Livestock(params) {
  function handleInputChange(type: string, value: number) {
    setStore("livestock", type, value);
  }

  return (
    <Show when={store.country?.length == 2} fallback={<Navigate href={"/"} />}>
      <div class="flex gap-2 mx-4 mt-4 mb-0 bg-white p-2 rounded-lg w-fit">
        <Link href="/livestock/pigs">
          Pigs
        </Link>
        <Link href="/livestock/cattle">
          Cattle
        </Link>
        <Link href="/livestock/chicken">
          Chicken
        </Link>
      </div>

      <div class="card bg-slate-100 shadow-md rounded-lg m-4 p-4 ">
            {params.children}
      </div>
    </Show>
  );
}
