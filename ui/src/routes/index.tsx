import { Title } from "@solidjs/meta";
import { A } from "@solidjs/router";
import PredictEnergy from "~/components/PredictEnergy";

// import "ag-grid-community/styles/ag-grid.css"; // grid core CSS
// import "ag-grid-community/styles/ag-theme-alpine.css"; // optional theme
import {
  createComputed,
  createEffect,
  createMemo,
  createSignal,
} from "solid-js";

import { LPIS_DK } from "~/data/LPIS_DK_2023";
import { createStore } from "solid-js/store";
import { v4 as uuidv4 } from "uuid";
import { Field, country, setCountry, setStore, store } from "~/store/store";
import { MyChart } from "~/components/chart";
import { calculateFarmEmission } from "~/util/emission";

function FieldView(props: { field: Field; idx: number }) {
  return (
    <div style="padding: 10px; margin: 10px 0; background-color: white;">
      <button
        onClick={() => {
          setStore("fields", (fields) =>
            fields.filter((field) => field.uuid !== props.field.uuid)
          );
        }}
      >
        Delete
      </button>
      <A href={`/fields/${props.field.uuid}`}>
        <button>View</button>
      </A>{" "}
      {props.field.name}
    </div>
  );
}

const totalCO2e = createMemo(() => {
  let total = 0;

  for (let i = 0; i < store.fields?.length; i++) {
    if (store.fields[i].LPIS_ID && store.fields[i].area) {
      let LPIS = LPIS_DK.find((el) => el[0] === store.fields[i].LPIS_ID)!;

      total += 2300 * store.fields[i].area!;

      // Kvælstoffikserende
      if (LPIS[2] === "JA") {
        total -= 3000 * store.fields[i].area!;
      }
      // Bælgplante
      if (LPIS[3] === "JA") {
        total -= 1000 * store.fields[i].area!;
      }
    }
  }
  
  return total;
});

export default function Home() {
  const [newFieldName, setNewFieldName] = createSignal("");

  return (
    <main>
      <h5>Country</h5>
      <select
        value={country()}
        onChange={(e) => {
          setCountry(e.target.value);
        }}
      >
        <option value={"DK"}>Denmark</option>
      </select>
      <br /> <br />
      <h5>Fields</h5>
      <input
        type="text"
        placeholder="Name"
        onChange={(e) => {
          setNewFieldName(e.target.value);
        }}
      />
      <button
        onClick={() => {
          setStore("fields", (prevFields) => [
            ...prevFields,
            { uuid: uuidv4(), name: newFieldName(), area: 1, rotations:[], repeatLastRotation: false },
          ]);
          setNewFieldName("");
        }}
      >
        Add field
      </button>
      <br /> <br />
      {store.fields.map((elem, idx) => (
        <FieldView field={elem} idx={idx} />
      ))}
      <br />
      <hr />
      <br />
      
      <div style="padding: 10px; margin: 10px 0;background-color:white;">
        <h2 style="font-weight: bold; margin-bottom: 10px;">Farm Emission</h2>
        <MyChart data={calculateFarmEmission(store.fields)} />
      </div>
      
    </main>
  );
}
