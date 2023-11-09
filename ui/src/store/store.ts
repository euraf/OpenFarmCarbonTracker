import { createEffect, createSignal } from "solid-js";
import { createStore } from "solid-js/store";

export type SimpleTier1LPISSegment = {
  LPIS_ID: number;
  years: number;
}

export type FixedSplitRotation = {
  splitTreePercent: number,
  cropSegments: SimpleTier1LPISSegment[],
  treeSegments: SimpleTier1LPISSegment[]
}

export type Rotation = FixedSplitRotation;

export type Field = {
  uuid: string;
  name: string;
  area?: number;
  rotations?: Rotation[];
  repeatLastRotation: boolean;
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