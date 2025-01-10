import { Navigate } from "@solidjs/router";
import { Show } from "solid-js";
import SettingsComponent from "~/components/SettingsComponent";
import { store } from "~/store/store";

export default function Home() {
    return (
        <Show when={!store.country} fallback={<Navigate href={"/land-use"} />}>
            <SettingsComponent />
        </Show>
    );
}
