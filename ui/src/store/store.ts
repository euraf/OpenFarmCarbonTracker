import { createEffect, createSignal } from "solid-js";
import { createStore } from "solid-js/store";

export type SimpleTier1LPISSegment = {
  LPIS_ID?: number;
  years?: number;
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
  geometry?: string;
  rotations?: Rotation[];
  repeatLastRotation: boolean;
};

const lsCountry = localStorage.getItem("country") ?? "DK";
export const [country, setCountry] = createSignal<string>(lsCountry);

createEffect(() => {
localStorage.setItem("country", country());
});


const lsStore = JSON.parse(localStorage.getItem("store") ?? '{"fields":[]}');
export const [store, setStore] = createStore<{ fields: Field[], country: string }>(lsStore);

createEffect(() => {

  localStorage.setItem("store", JSON.stringify(store));
});