import {
  ICellEditorParams,
  ICellEditor,
  ModuleRegistry,
} from "@ag-grid-community/core";
import { Component, createResource, onMount } from "solid-js";
import { createEffect, createSignal } from "solid-js";
import AgGridSolid, { AgGridSolidRef } from "@ag-grid-community/solid";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-alpine.css";
import styles from "./style.module.css";

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

  createEffect(() => {
    refInput.focus();
  });

  return (
    <input
      type="number"
      class={styles["my-editor"]}
      ref={refInput}
      value={value}
      onChange={onValueChanged}
    />
  );
};


const MyEditor: Component = () => {
//   const [rowData] = createResource<any[]>(fetchData);

  const rowData = [
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
  ];

  const columnDefs = [
    {
      field: "use",
      editable: false,
    },
    {
      field: "annual_consumption",
      editable: true,
      cellEditor: MySolidEditor,
    },
    {
      field: "unit",
      editable: false,
    },
  ];

  const defaultColDef = {
    resizable: true,
    filter: true,
    editable: true,
    sortable: true,
    flex: 1,
  };

  let gridRef: AgGridSolidRef;

  return (
    <div
      style={{ height: "400px", display: "flex", "flex-direction": "column" }}
    >
      <div class="ag-theme-alpine" style={{ "flex-grow": 1 }}>
        <AgGridSolid
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
