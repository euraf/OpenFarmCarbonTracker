import { A, Title } from "solid-start";
import PredictEnergy from "~/components/PredictEnergy";

// import "ag-grid-community/styles/ag-grid.css"; // grid core CSS
// import "ag-grid-community/styles/ag-theme-alpine.css"; // optional theme
import {
  createComputed,
  createEffect,
  createMemo,
  createSignal,
} from "solid-js";

import { Card, Typography } from "@suid/material";
import { LPIS_DK } from "~/data/LPIS_DK_2023";
import { createStore } from "solid-js/store";
import { v4 as uuidv4 } from "uuid";
import { Field, country, setCountry, setStore, store } from "~/store/store";
import { MyChart } from "~/components/chart";



function FieldView(props: { field: Field; idx: number }) {
  return (
    <Card style="padding: 10px; margin: 10px 0;">
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
    </Card>
  );
}



const totalCO2e = createMemo(() => {
  let total = 0;

  console.log(store);
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
  console.log(total);

  return total;
});
export default function Home() {
  const [newFieldName, setNewFieldName] = createSignal("");

  return (
    <main>
      <Typography variant="h5" gutterBottom={true}>
        Country
      </Typography>
      <select
        value={country()}
        onChange={(e) => {
          setCountry(e.target.value);
        }}
      >
        <option value={"DK"}>Denmark</option>
      </select>
      <br /> <br />
      <Typography variant="h5" gutterBottom={true}>
        Fields
      </Typography>
      <input
        type="text"
        placeholder="Name"
        onChange={(e) => {
          setNewFieldName(e.target.value);
        }}
      />
      <button
        onClick={() => {
          console.log(store.fields);
          setStore("fields", (prevFields) => [
            ...prevFields,
            { uuid: uuidv4(), name: newFieldName(), LPIS_ID: 1, area: 1 },
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

      <Card style="padding: 10px; margin: 10px 0;">
      <p>EMISSION GRAPH</p>
      kg CO2-e / y: {totalCO2e()}
      <MyChart />

      </Card>

      
    </main>
  );
}
