import { v4 as uuidv4 } from "uuid";
import { A } from "@solidjs/router";
import { createEffect, createSignal, Match, Switch } from "solid-js";
import { Button } from "~/components/ui/button";
import { TextField, TextFieldInput } from "~/components/ui/text-field";
import { Field, setStore, store } from "~/store/store";
import maplibregl from "maplibre-gl";
import { GoogleSatStyle } from "~/util/map_styles/google-sat-style";
import "maplibre-gl/dist/maplibre-gl.css";
import DefaultMode from "~/components/map-editor/DefaultMode";
import { EditFieldMode } from "~/components/map-editor/EditFieldMode";
import { centroid, feature, featureCollection } from "@turf/turf";

export enum modes {
  default = 0,
  editField = 2,
}

function calculateCentroid(geometries: any[]): [number, number] {
  const fC = featureCollection(geometries);
  const c = centroid(fC);
  return c.geometry.coordinates as [number, number];
}

export default function Fields() {
  const [mapref, setMapref] = createSignal<HTMLElement>();

  const [mode, setMode] = createSignal<modes>(modes.default);
  const [styleLoaded, setStyleLoaded] = createSignal<boolean>(false);

  let map: maplibregl.Map;

  createEffect(() => {
    if (mapref() && !styleLoaded()) {
      if (store.fields.length > 0) {
        map = new maplibregl.Map({
          container: mapref()!,
          attributionControl: false,
          style: GoogleSatStyle,
          center: calculateCentroid(
            store.fields.map((field) => field.geometry),
          ),
          zoom: 12,
          maxZoom: 20,
        });
      } else {
        map = new maplibregl.Map({
          container: mapref()!,
          attributionControl: false,
          style: GoogleSatStyle,
          center: (() => {
            const countryCoordinates: { [key: string]: [number, number] } = {
              DK: [10.0, 56.0],
              FI: [25.0, 64.0],
              NL: [5.5, 52.0],
              AT: [13.0, 47.5],
              FR: [2.5, 46.5],
            };
            return countryCoordinates[store.country] || [9, 46];
          })(),
          zoom: (() => {
            const countryZoomLevels: { [key: string]: number } = {
              DK: 6,
              FI: 4,
              NL: 6,
              AT: 6,
              FR: 5,
            };
            return countryZoomLevels[store.country] || 6;
          })(),
          maxZoom: 20,
        });
      }

      map.on("load", () => {
        setStyleLoaded(true);
      });
    }
  });

  function getMap() {
    return map;
  }

  const [editedField, setEditedField] = createSignal<Field | null>(null);

  function editField(field: Field) {
    setEditedField(field);
    setMode(modes.editField);
  }

  function addField() {
    setEditedField(null);
    setMode(modes.editField);
  }

  return (
    <>
      <main class="grow flex flex-col">
        <div
          id="map"
          ref={(r) => {
            setMapref(r);
          }}
          class="border-0 w-full h-full"
        />

        <Switch>
          <Match when={mode() === modes.default}>
            <DefaultMode
              addField={addField}
              editField={editField}
              getMap={getMap}
              store={store}
              setMode={setMode}
            />
          </Match>
          <Match when={mode() === modes.editField}>
            <EditFieldMode
              store={store}
              setMode={setMode}
              getMap={getMap}
              field={editedField()!}
            />
          </Match>
        </Switch>
      </main>
    </>
  );
}
