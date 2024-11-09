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

const lsStore = JSON.parse(
  localStorage.getItem("store") ?? JSON.stringify(initStore()),
);
export const [store, setStore] = createStore<
  {
    fields: Field[];
    country: CountryCode;
    energyAndFuel: {
      diesel?: number;
      coal?: number;
      biogas?: number;
      electricity?: number;
    };
    livestock: any;
    buildingsAndEquipment: any;
  }
>(lsStore);

createEffect(() => {
  localStorage.setItem("store", JSON.stringify(store));
});

export function initStore() {
  return { fields: [], country: undefined, energyAndFuel: {} };
}
