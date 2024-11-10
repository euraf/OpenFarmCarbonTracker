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

const lsStore = JSON.parse(
  localStorage.getItem("store") ?? JSON.stringify(initStore()),
);
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
    livestock: any;
    buildings: BuildingOrEquipment[];
    equipment: BuildingOrEquipment[];
  }
>(lsStore);

createEffect(() => {
  localStorage.setItem("store", JSON.stringify(store));
});

export function initStore() {
  return { 
    fields: [], 
    startYear: new Date().getFullYear(),
    country: undefined, 
    energyAndFuel: {}, 
    buildings: [], 
    equipment: [] 
  };
}
