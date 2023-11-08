import { createEffect, createSignal } from "solid-js";
import { createStore } from "solid-js/store";

export type Field = {
  uuid: string;
  name: string;
  LPIS_ID?: number;
  area?: number;
};

const lsCountry = localStorage.getItem("country") ?? "DK";
export const [country, setCountry] = createSignal<string>(lsCountry);




createEffect(() => {

  console.log("SAVING")
  localStorage.setItem("country", country());
});


const lsStore = JSON.parse(localStorage.getItem("store") ?? '{"fields":[]}');
console.log("lsStore", lsStore);
export const [store, setStore] = createStore<{ fields: Field[] }>(lsStore);

createEffect(() => {

  console.log("SAVING")
  localStorage.setItem("store", JSON.stringify(store));
});