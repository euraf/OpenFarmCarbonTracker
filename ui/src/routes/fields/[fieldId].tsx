import { A, useParams } from "solid-start";
import { store, setStore } from "../../store/store";
import type { Field } from "../../store/store";

import { LPIS_DK } from "~/data/LPIS_DK_2023";
import { MyChart } from "~/components/chart";

export default function FieldView() {
  const params = useParams<{ fieldId: string }>();

  const field: Field | undefined = store.fields.find(
    (field) => field.uuid === params.fieldId
  );

  return (
    <main>
      <A href="/">⬅ Back</A>

      <div style="padding: 10px; margin: 10px 0; background-color: white;">Field name: 
        <input
          type="text"
          onChange={(e) => {
            setStore("fields", (fields) =>
              fields.map((field) =>
                field.uuid === params.fieldId
                  ? { ...field, name: e.target.value }
                  : field
              )
            );
          }}
          value={field?.name}
        />
      </div>


      <div style="padding: 10px; margin: 10px 0; background-color: white;">Field name: 

        <div style={'display: flex; overflow: scroll;'}>
        {[...Array(50)].map((x, idx) => (
          <div style={`min-width: 140px; display: flex; justify-content: center; align-items: center; height: 20px; border: 1px solid black;`}>{idx+1}</div>
        ))}
        </div>
        <br />
      <p>TIMELINE</p>

      </div>



      
      <div style="padding: 10px; margin: 10px 0; background-color: white;">Field name: 
        <select>
          
        <option value={"simple_tier1"}>Simple (Tier 1)</option>
        </select>

        <br /><br /><br />
        <select
          value={field?.LPIS_ID}
          onChange={(e) => {
            setStore("fields", (fields) =>
              fields.map((field) =>
                field.uuid === params.fieldId
                  ? { ...field, LPIS_ID: parseInt(e.target.value) }
                  : field
              )
            );
          }}
        >
          {LPIS_DK.map((species) => {
            return <option value={species[0]}>{species[1]}</option>;
          })}
        </select>
        <br />
        <label for="area">Area (ha)</label>
        <input
          onChange={(e) => {
            setStore("fields", (fields) =>
              fields.map((field) =>
                field.uuid === params.fieldId
                  ? { ...field, area: parseFloat(e.target.value) }
                  : field
              )
            );
          }}
          name="area"
          type="number"
          min={0}
          value={field?.area ?? 1}
        />{" "}
        <br />
        {field?.LPIS_ID ? (
          <>
            <label for="carbon-fixating">Carbon fixating</label>
            <input
              disabled
              name=""
              type="checkbox"
              checked={
                LPIS_DK.find((el) => el[0] === field.LPIS_ID)![2] === "JA"
              }
            />
            <br />
            <label for="legume">Legume</label>
            <input
              disabled
              name="legume"
              type="checkbox"
              checked={
                LPIS_DK.find((el) => el[0] === field.LPIS_ID)![3] === "JA"
              }
            />
            <br />
          </>
        ) : (
          <></>
        )}
      </div>


      <div style="padding: 10px; margin: 10px 0; background-color: white;">Field name: 
      <p>EMISSION GRAPH</p>
      <MyChart />

      </div>



    </main>
  );
}
