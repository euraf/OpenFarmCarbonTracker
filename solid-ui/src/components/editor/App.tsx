import {ICellEditorParams, ICellEditor, ModuleRegistry} from '@ag-grid-community/core';
import {Component, createResource, onMount} from 'solid-js';
import {createEffect, createSignal} from "solid-js";
import AgGridSolid, {AgGridSolidRef} from '@ag-grid-community/solid';
import {ClientSideRowModelModule} from '@ag-grid-community/client-side-row-model';

ModuleRegistry.registerModules([ClientSideRowModelModule]);

import '@ag-grid-community/styles/ag-grid.css';
import "@ag-grid-community/styles/ag-theme-alpine.css";
import styles from "./style.module.css"

export const MySolidEditor = (props: ICellEditorParams) => {
    let value = props.value;
    let refInput: any;

    const api: ICellEditor = {
        getValue: () => value
    };

    (props as any).ref(api);

    const onValueChanged = (event: any) => {
        value = Number(event.target.value);
    };

    createEffect(() => {
        refInput.focus();
    })


    return (
        <input type="number" class={styles["my-editor"]}
               ref={refInput}
               value={value}
               onChange={onValueChanged}
        />    );
}

const fetchData = async () => {

    console.log("Try fetch")

    let response = await fetch(`https://www.ag-grid.com/example-assets/olympic-winners.json`)
    
    
    console.log('response', response)
    let data = await response.json()
    console.log('data', data)

    return data;
}
const MyEditor: Component = () => {
    
    const [rowData] = createResource<any[]>(fetchData);

    const columnDefs = [
        {
            field: 'country'
        },
        {
            field: 'athlete',
        },
        {
            field: 'gold',
            editable: true,
            cellEditor: MySolidEditor
        },
        {
            field: 'silver',
            cellEditor: MySolidEditor,
            cellEditorPopup: true
        }
    ];

    const defaultColDef = {
        resizable: true,
        filter: true,
        editable: true,
        sortable: true,
        flex: 1
    };

    let gridRef: AgGridSolidRef;

    return (
        <div style={{height: '400px', display: 'flex', "flex-direction": 'column'}}>
            <div class="ag-theme-alpine" style={{"flex-grow": 1}}>
                <AgGridSolid
                    columnDefs={columnDefs}
                    rowData={rowData()}
                    defaultColDef={defaultColDef}
                    ref={gridRef!}
                />
            </div>
        </div>
    );
};

export default MyEditor;
