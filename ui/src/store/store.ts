import { createEffect, createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { CountryCode } from "~/util/countries";

export type SimpleTier1LPISSegment = {
  LPIS_ID?: number;
  years?: number;
};

export type FixedSplitRotation = {
  splitTreePercent: number;
  cropSegments: SimpleTier1LPISSegment[];
  treeSegments: SimpleTier1LPISSegment[];
};

export type Rotation = FixedSplitRotation;

export type Field = {
  uuid: string;
  name: string;
  area?: number;
  geometry?: string;
  rotations?: Rotation[];
  repeatLastRotation: boolean;
};

export type BuildingOrEquipment = {
  name: string;
  year: number;
  emission: number;
};

export type FeedRecord = {
  label: string;
  kgsFeed: number;
  year: number;
  emissionPerKg: number;
};

export type Livestock = {
  pigs: {
    feed: FeedRecord[];
  };
  cattle: object;
  chicken: object;
};

const lsStore = JSON.parse(
  localStorage.getItem("store") ?? JSON.stringify(initStore()),
);

function validateStore(store: any) {
  if (!store.livestock) {
    store.livestock = { pigs: { feed: [] }, cattle: {}, chicken: {} };
  } else {
    if (!store.livestock.pigs) store.livestock.pigs = { feed: [] };
    if (!store.livestock.cattle) store.livestock.cattle = {};
    if (!store.livestock.chicken) store.livestock.chicken = {};
  }
  return store;
}

export const [store, setStore] = createStore<
  {
    fields: Field[];
    startYear: number;
    country: CountryCode;
    energyAndFuel: {
      diesel?: number;
      coal?: number;
      biogas?: number;
      electricity?: number;
    };
    livestock: Livestock;
    buildings: BuildingOrEquipment[];
    equipment: BuildingOrEquipment[];
  }
>(validateStore(lsStore));

createEffect(() => {
  localStorage.setItem("store", JSON.stringify(store));
});

export function initStore() {
  return { 
    fields: [], 
    startYear: new Date().getFullYear(),
    country: undefined, 
    energyAndFuel: {}, 
    livestock: { pigs: { feed: [] }, cattle: {}, chicken: {} },
    buildings: [], 
    equipment: [] 
  };
}
