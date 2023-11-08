import { Title } from "solid-start";
import PredictEnergy from "~/components/PredictEnergy";

import 'ag-grid-community/styles/ag-grid.css'; // grid core CSS
import "ag-grid-community/styles/ag-theme-alpine.css"; // optional theme
import { createSignal } from "solid-js";

import MyEditor from '~/components/editor/App'


export default function Home() {

  
  return (
    <main>
      
      
      {/* <Typography variant="h4" gutterBottom={true} >OpenFarmCarbonPredictor</Typography> */}

      <h5>Energy usage</h5>
      
      <MyEditor />
      <br />
      <PredictEnergy />
      
      <h5>Carbon Stock</h5>
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
