import { createEffect } from "solid-js";
import { setStore, store } from "~/store/store";
import SettingsComponent from "~/components/SettingsComponent";

export default function Settings() {
    createEffect(() => {
        if (!store.startYear) {
            setStore("startYear", new Date().getFullYear());
        }
    });

    return <SettingsComponent />;
}
