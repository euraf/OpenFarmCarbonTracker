import { A, refetchRouteData, useParams } from "solid-start";
import { store, setStore } from "../../store/store";
import type { Field, SimpleTier1LPISSegment } from "../../store/store";

import { LPIS_DK } from "~/data/LPIS_DK_2023";
import { MyChart } from "~/components/chart";
import { createEffect, createSignal } from "solid-js";

export default function FieldView() {
  const params = useParams<{ fieldId: string }>();

  // let currentField: Field | undefined = store.fields.find(
  //   (field) => field.uuid === params.fieldId
  // );

  let [currentField, setCurrentField] = createSignal<Field | undefined>();
  createEffect(() => {
    setCurrentField(
      store.fields.find((field) => field.uuid === params.fieldId)
    );
  });

  const [activeSegment, setActiveSegment] =
    createSignal<SimpleTier1LPISSegment | null>(null);


  

  return (
    <main>
      <A href="/">⬅ Back</A>

      <div style="padding: 10px; margin: 10px 0; background-color: white;">
        Field name:
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
          value={currentField()?.name}
        />
        <br /> <br />
        <label for="area">Area (ha):</label>
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
          value={currentField()?.area ?? 1}
        />{" "}
      </div>

      <div style="padding: 10px; margin: 10px 0; background-color: white;">
        <h2 style="font-weight: bold; margin-bottom: 10px;">Rotations:</h2>
        <div style={"display: flex; gap: 20px; overflow: scroll;"}>
          {currentField()?.rotations?.map((rotation, rotationIdx) => (
            <div style="padding: 10px; border: 1px solid #555;  background-color: rgb(218, 230, 239);">
              <button
                onClick={(e) => {
                  setStore("fields", (fields) =>
                    fields.map((field) =>
                      field.uuid === params.fieldId
                        ? {
                            ...field,
                            rotations: field.rotations?.filter(
                              (_, rotIdx) => rotIdx !== rotationIdx
                            ),
                          }
                        : field
                    )
                  );
                }}
              >
                X
              </button>{" "}
              Delete rotation
              <br />
              <div style="display: flex; gap: 20px;  justify-content: flex-start; align-items: center; min-height: 40px;">
                <span style="min-width: 120px;">Crop segments:</span>
                {rotation.cropSegments.map((segment: SimpleTier1LPISSegment, cropSegmentIdx:number) => {
                    return <div style={`display: flex; gap: 10px; background-color: white; padding: 10px;  `} >
                      

                      <button onClick={() => {
                        setStore("fields", (fields) =>
                          fields.map((field) =>
                            field.uuid === currentField()?.uuid
                              ? {
                                  ...field,
                                  rotations: field.rotations?.map(
                                    (rotation, rotIdx) =>
                                      rotIdx === rotationIdx
                                        ? {
                                            ...rotation,
                                            cropSegments: rotation.cropSegments.filter(
                                              (_, idx) => idx !== cropSegmentIdx
                                            ),
                                          }
                                        : rotation
                                  ),
                                }
                              : field
                          )
                        );
                      }}>Delete</button>
                      
                      <div style="cursor: pointer;" onClick={()=>{
                          setActiveSegment(segment)
                        }}>
                      {segment.LPIS_ID ? `${LPIS_DK.find(([id]) => id === segment.LPIS_ID)?.[1]}`:null} {segment.years ? `(${segment.years}y)`:null}
                      </div>

                      </div>
                  })}

                <button
                  onClick={() => {
                    setStore("fields", (fields) =>
                      fields.map((field) =>
                        field.uuid === currentField()?.uuid
                          ? {
                              ...field,
                              rotations: field.rotations?.map(
                                (rotation, rotIdx) =>
                                  rotIdx === rotationIdx
                                    ? {
                                        ...rotation,
                                        cropSegments: [
                                          ...rotation.cropSegments,
                                          {  years: 1 },
                                        ],
                                      }
                                    : rotation
                              ),
                            }
                          : field
                      )
                    );
                  }}
                >
                  +
                </button>
              </div>
              <br />
              <div style="display: flex; gap: 20px; justify-content: flex-start; align-items: center;  min-height: 40px;">
                <span style="min-width: 120px; ">Tree segments:</span>
                {rotation.treeSegments.map((segment: SimpleTier1LPISSegment, treeSegmentIdx:number) => {
                    return <div style={`display: flex; gap: 10px; background-color: white; padding: 10px;  `} >
                      

                      <button onClick={() => {
                        setStore("fields", (fields) =>
                          fields.map((field) =>
                            field.uuid === currentField()?.uuid
                              ? {
                                  ...field,
                                  rotations: field.rotations?.map(
                                    (rotation, rotIdx) =>
                                      rotIdx === rotationIdx
                                        ? {
                                            ...rotation,
                                            treeSegments: rotation.treeSegments.filter(
                                              (_, idx) => idx !== treeSegmentIdx
                                            ),
                                          }
                                        : rotation
                                  ),
                                }
                              : field
                          )
                        );
                      }}>Delete</button>
                      
                      
                      <div style="cursor: pointer;" onClick={()=>{
                          setActiveSegment(segment)
                        }}>

                       {segment.LPIS_ID ? `${LPIS_DK.find(([id]) => id === segment.LPIS_ID)?.[1]}`:null} {segment.years ? `(${segment.years}y)`:null}
                      </div>

                      </div>
                  })}

                <button
                  onClick={() => {
                    setStore("fields", (fields) =>
                      fields.map((field) =>
                        field.uuid === currentField()?.uuid
                          ? {
                              ...field,
                              rotations: field.rotations?.map(
                                (rotation, rotIdx) =>
                                rotIdx === rotationIdx
                                    ? {
                                        ...rotation,
                                        treeSegments: [
                                          ...rotation.treeSegments,
                                          {  years: 1 },
                                        ],
                                      }
                                    : rotation
                              ),
                            }
                          : field
                      )
                    );
                  }}
                >
                  +
                </button>
              </div>
            </div>
          ))}
          <div style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
            <button
              onClick={() => {
                currentField()?.rotations;

                setStore("fields", (fields) => [
                  ...fields.map((field) => {
                    if (field.uuid === currentField()?.uuid) {
                      if (!field.rotations) {
                        field.rotations = [];
                      }

                      field.rotations = [
                        ...field.rotations,
                        {
                          cropSegments: [],
                          treeSegments: [],
                          splitTreePercent: 20,
                        },
                      ];
                      return { ...field };
                    }
                    console.log(field);
                    return field;
                  }),
                ]);
              }}
              style="width: fit-content;"
            >
              Add
              <br />
              rotation
            </button>
          </div>

          <div style="margin-left: 20px; display: flex; flex-direction: column; justify-content: center; align-items: center;">
            <span style="text-align: center;">
              Repeat last
              <br />
              rotation
            </span>
            <input type="checkbox" />
          </div>
        </div>
        <br />
      </div>

      <div style="padding: 10px; margin: 10px 0; background-color: white;">
        Model:
        <select>
          <option value={"simple_tier1"}>Simple (Tier 1)</option>
        </select>
        <br />
        <br />
        <br />
        <select
          value={activeSegment()?.LPIS_ID}
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
        <br />
        {activeSegment()?.LPIS_ID ? (
          <>
            <label for="carbon-fixating">Carbon fixating</label>
            <input
              disabled
              name=""
              type="checkbox"
              checked={
                LPIS_DK.find((el) => el[0] === activeSegment()?.LPIS_ID)![2] ===
                "JA"
              }
            />
            <br />
            <label for="legume">Legume</label>
            <input
              disabled
              name="legume"
              type="checkbox"
              checked={
                LPIS_DK.find((el) => el[0] === activeSegment()?.LPIS_ID)![3] ===
                "JA"
              }
            />
            <br />
          </>
        ) : (
          <></>
        )}
      </div>

      <div style="padding: 10px; margin: 10px 0; background-color: white;">
        Field name:
        <p>EMISSION GRAPH</p>
        <MyChart />
      </div>
    </main>
  );
}
