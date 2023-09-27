import { Title } from "solid-start";
import PredictEnergy from "~/components/PredictEnergy";

import 'ag-grid-community/styles/ag-grid.css'; // grid core CSS
import "ag-grid-community/styles/ag-theme-alpine.css"; // optional theme
import { createSignal } from "solid-js";

import MyEditor from '~/components/editor/App'
import { Typography } from "@suid/material"

export default function Home() {

  // use signal, as row data will change
  const [rowData, setRowData] = createSignal<undefined>();

  // if columns will change, best use a signal, however if column definitions
  // are static, we don't need to use a signal
  const columnDefs = [
      {field: 'name'},
      {field: 'age'}
  ];

  // event listener
  const selectionChangedCallback = (e:any) => {
    console.log('selection has changed', e);
};

  return (
    <main>
      
      
      {/* <Typography variant="h4" gutterBottom={true} >OpenFarmCarbonPredictor</Typography> */}

      <Typography variant="h5" gutterBottom={true} >Energy usage</Typography>
      
      <MyEditor />
      <br />
      <PredictEnergy />
      
      <Typography variant="h5" gutterBottom={true} >Carbon Stock</Typography>
      {/* <div style={{height: '500px'}} class="ag-theme-alpine">

            <AgGridSolid
                rowData={rowData()} // use signal
                columnDefs={columnDefs} // no signal
                rowSelection="single" // no signal, inline
                onSelectionChanged={selectionChangedCallback} // listen for grid event
            />
        </div> */}

    </main>
  );
}
