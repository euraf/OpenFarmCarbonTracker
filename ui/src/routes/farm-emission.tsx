import { FarmEmissionCharts } from "~/components/chart";
import { Accessor, createMemo, createSignal, Setter, Show } from "solid-js";
import { Button } from "~/components/ui/button";
import { Navigate } from "@solidjs/router";
import { store } from "~/store/store";
import { LPIS_DK } from "~/data/crops/LPIS_DK_2023";

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

export default function FarmEmission() {

  
  
  const [includedFields, setIncludedFields] = createSignal(
    store.fields.map(() => true)
  );


  const [endYear, setEndYear] = createSignal(store.startYear+10);
  // const [startYear, setStartYear] = createSignal(store.startYear);


  return (
    <>
        <Show when={store.country} fallback={<Navigate href={"/"} />}>

      <main class="p-4 grow flex flex-col ">
        

        <div class="p-3 bg-white rounded-lg">
          
          <div class="flex gap-4 items-center mb-4 flex">
            <span>View year</span>
            <input
              type="number"
              class="p-2 border rounded w-30"
              min={store.startYear}
              value={store.startYear}
              disabled
            />
            <span>to</span>
            <input
              type="number"
              class="p-2 border rounded w-30"
              min={store.startYear}
              
              value={endYear()}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (value >= store.startYear) {
                  setEndYear(value);
                }
              }}
            />
          </div>
          <hr class="mb-10" />
          
          <FarmEmissionCharts
            startYear={()=>store.startYear}
            endYear={endYear}
          />
        </div>

        {/* <FieldToggle includedFields={includedFields} setIncludedFields={setIncludedFields} /> */}
      </main>
      </Show>
    </>
  );
}



const FieldToggle = (params:{includedFields:Accessor<boolean[]>, setIncludedFields: Setter<boolean[]>}) => {
  return  <div class="bg-white rounded-lg p-4 mt-2">
      <h2 class="text-black">Select which fields to include in the farm emissoin calculation</h2>

      <div class="flex gap-2 my-4">
        <Button
          onClick={() => {
            params.setIncludedFields(store.fields.map(() => true));
          }}
        >
          All
        </Button>
        <Button
          onClick={() => {
            params.setIncludedFields(store.fields.map(() => false));
          }}
        >
          None
        </Button>
      </div>

      {store.fields.map((field, index) => (
        <div  class="flex items-center mb-2">
          <input
            type="checkbox"
            id={`field-${index}`}
            checked={params.includedFields()[index]}
            onChange={(e) => {
              params.setIncludedFields((prev) =>
                prev.map((included, idx) =>
                  idx === index ? e.target.checked : included
                )
              );
            }}
          />
          <label for={`field-${index}`} class="ml-2">
            {field.name}
          </label>
        </div>
      ))}
    </div>
}
