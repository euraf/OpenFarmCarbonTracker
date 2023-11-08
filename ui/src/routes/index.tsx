import { Title } from "solid-start";
import PredictEnergy from "~/components/PredictEnergy";

import 'ag-grid-community/styles/ag-grid.css'; // grid core CSS
import "ag-grid-community/styles/ag-theme-alpine.css"; // optional theme
import { createSignal } from "solid-js";

import MyEditor from '~/components/editor/App'
import { Typography } from "@suid/material"

export default function Home() {

  
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
