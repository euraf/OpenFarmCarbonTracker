'use client';

import {
  
  ModuleRegistry,
  type ColDef,
  type ColGroupDef,
  type ICellEditor,
  type ICellEditorParams,
} from "@ag-grid-community/core";

// import { createEffect, createSignal } from "solid-js";
import { AgGridReact } from "ag-grid-react";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-alpine.css";
// import styles from "./style.module.css";
import { useEffect, useState } from "react";

export const MySolidEditor = (props: ICellEditorParams) => {
  let value = props.value;
  let refInput: any;

  const api: ICellEditor = {
    getValue: () => value,
  };

  (props as any).ref(api);

  const onValueChanged = (event: any) => {
    value = Number(event.target.value);
  };

  useEffect(() => {
    refInput.focus();
  },[refInput]);

  return (
    <input
      type="number"
      className={styles["my-editor"]}
      ref={refInput}
      value={value}
      onChange={onValueChanged}
    />
  );
};

const fetchData = async () => {
  console.log("Try fetch");

  let response = await fetch(
    `https://www.ag-grid.com/example-assets/olympic-winners.json`
  );

  console.log("response", response);
  let data = await response.json();
  console.log("data", data);

  return data;
};
const MyEditor = () => {
//   const [rowData] = createResource<any[]>(fetchData);

  const [rowData, setRowData] = useState([
    { use: "Diesel", annual_consumption: 0.0, unit: "L" },
    { use: "Petrol/Gasoline, regular", annual_consumption: 0.0, unit: "L" },
    {
      use: "Propane gas / butane gas (bottle, tank)",
      annual_consumption: 0.0,
      unit: "kg",
    },
    { use: "Natural gas", annual_consumption: 0.0, unit: "m3" },
    { use: "Coal", annual_consumption: 0.0, unit: "kg" },
    { use: "Wood", annual_consumption: 0.0, unit: "tonnes" },
    { use: "Biofuels", annual_consumption: 0.0, unit: "L" },
    { use: "Biogas", annual_consumption: 0.0, unit: "m3 CH4" },
    { use: "Irrigation Water", annual_consumption: 0.0, unit: "m3" },
    { use: "Drinking Water", annual_consumption: 0.0, unit: "m3" },
  ]);

  const [columnDefs, setColumnDefs]: (ColDef | ColGroupDef)[] = useState([
    {
      field: "use",
      editable: false,
    },
    {
      field: "annual_consumption",
      editable: true,
      // cellEditor: MySolidEditor,
    },
    {
      field: "unit",
      editable: false,
    },
  ]) as (ColDef | ColGroupDef)[];

  const defaultColDef = {
    resizable: true,
    filter: true,
    editable: true,
    sortable: true,
    flex: 1,
  };

  let gridRef: any;

  return (
    <div
      style={{ height: "400px", display: "flex", "flexDirection": "column" }}
    >
      <div className="ag-theme-alpine" style={{ "flexGrow": 1 }}>
        <AgGridReact
          columnDefs={columnDefs}
          rowData={rowData}
          defaultColDef={defaultColDef}
          ref={gridRef!}
        />
      </div>
    </div>
  );
};

export default MyEditor;
