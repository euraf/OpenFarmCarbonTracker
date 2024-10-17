import { A, Navigate, useNavigate, useParams } from "@solidjs/router";
import { setStore, store } from "../../store/store";
import type { Field, SimpleTier1LPISSegment } from "../../store/store";

import { LPIS_DK } from "~/data/LPIS_DK_2023";
import { MyChart } from "~/components/chart";
import { createEffect, createSignal, Show } from "solid-js";
import { calculateFieldEmission } from "~/util/emission";
import { Button } from "~/components/ui/button";
import {
  TextField,
  TextFieldInput,
  TextFieldLabel,
} from "~/components/ui/text-field";
import { Select, SelectItem } from "~/components/ui/select";

export default function FieldView() {

  
  const params = useParams<{ fieldId: string }>();

  let [currentField, setCurrentField] = createSignal<Field | undefined>();

  createEffect(() => {
    setCurrentField({
      ...store.fields.find((field) => field.uuid === params.fieldId)!,
    });
  });

  const [activeSegment, setActiveSegment] = createSignal<
    {
      segmentData: SimpleTier1LPISSegment;
      cropOrTree: "tree" | "crop";
      rotationIdx: number;
      segmentIdx: number;
    } | null
  >(null);

  return (
    <Show when={store.country} fallback={<Navigate href={"/"} />}>
    <main class="mx-4 overflow-scroll">
      <div class="p-2 my-2 bg-white rounded-md">
        <h2 class="font-bold mb-2">Field Information</h2>
        Name: {currentField()?.name}
        <br />
        Area: {currentField()?.area! > 5000
          ? `${(currentField()?.area! * 0.0001).toFixed(2)} ha`
          : `${currentField()?.area!.toFixed(0).replace(".", ",")} m2`}
      </div>

      <div class="p-2 my-2 bg-white rounded-md">
        <h2 class="font-bold mb-2">Land Use and Land Use Changes:</h2>
        <div class="flex gap-5 overflow-scroll">
          {currentField()?.rotations?.map((rotation, rotationIdx) => (
            <div class="p-4 border border-gray-300 rounded-lg shadow-md bg-gray-50 group relative ">
              <Button
                variant={"destructive"}
                class="invisible group-hover:visible"
                title="Delete land use"
                onClick={(e) => {
                  setStore("fields", (fields) =>
                    fields.map((field) =>
                      field.uuid === params.fieldId
                        ? {
                          ...field,
                          rotations: field.rotations?.filter(
                            (_, rotIdx) =>
                              rotIdx !== rotationIdx,
                          ),
                        }
                        : field
                    ));
                }}
              >
                <i class="fa-solid fa-x" />
              </Button>

              <br />
              <br />
              <TextField>
                <TextFieldLabel for="splitTreePercent">
                  Split (% Area with trees)
                </TextFieldLabel>
                <TextFieldInput
                  name="splitTreePercent"
                  type="number"
                  min="0"
                  max="100"
                  value={rotation.splitTreePercent ?? 20}
                  onChange={(e) => {
                    setStore("fields", (fields) =>
                      fields.map((field) =>
                        field.uuid === currentField()?.uuid
                          ? {
                            ...field,
                            rotations: field.rotations?.map((rotation, index) =>
                              index === rotationIdx
                                ? {
                                  ...rotation,
                                  splitTreePercent: parseFloat(
                                    e.target.value,
                                  ),
                                }
                                : rotation
                            ),
                          }
                          : field
                      ));
                  }}
                />
              </TextField>

              <br />
              <br />
              <p class="min-w-[200px] font-bold mb-2">Segments: <span class="bg-blue-500 text-white text-xs font-bold rounded-full px-2 py-1" >
                {Math.max(rotation.cropSegments.reduce((sum, segment) => sum + (segment.years || 0), 0), rotation.treeSegments.reduce((sum, segment) => sum + (segment.years || 0), 0))}y cycle
              </span></p>

              


              <div class=" flex gap-5 justify-start items-center min-h-10" >
                <span class="min-w-[60px]">Crops:</span>

                
                
                      
                {rotation.cropSegments.map(
                  (segment: SimpleTier1LPISSegment, cropSegmentIdx: number) => {
                    return (
                      <div class="relative">
                      <span class="absolute top-[-10px] right-[-10px] z-20 bg-blue-500 text-white text-xs font-bold rounded-full px-2 py-1" >
                            {segment.years ? `${segment.years}y` : null}
                      </span>
                      <div
                        class={`hover:border-slate-600 bg-white cursor-pointer flex gap-2 min-w-[120px] border-2 border-slate-400 h-[100px] w-[200px] overflow-scroll rounded-md p-2 relative group/segment  ${
                          activeSegment()?.cropOrTree == "crop" &&
                            cropSegmentIdx == activeSegment()?.segmentIdx &&
                            rotationIdx == activeSegment()?.rotationIdx
                            ? "border-3 border-blue-500"
                            : "border-3 border-white"
                        }`}
                        onClick={() => {
                          setActiveSegment({
                            segmentData: segment,
                            cropOrTree: "crop",
                            rotationIdx: rotationIdx,
                            segmentIdx: cropSegmentIdx,
                          });
                        }}
                      >
                       
                          {segment.LPIS_ID
                            ? `${
                              LPIS_DK.find(
                                ([id]) => id === segment.LPIS_ID,
                              )?.[1]
                            }`
                            : null}
                          
                        
                      </div>
                      </div>
                    );
                  },
                )}

                <Button
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
                                      { years: 1 },
                                    ],
                                  }
                                  : rotation,
                            ),
                          }
                          : field
                      ));
                  }}
                >
                  +
                </Button>
              </div>
              <br />
              <div class="flex gap-5 justify-start items-center min-h-10">
                <span class="min-w-[60px]">Trees:</span>
                {rotation.treeSegments.map(
                  (segment: SimpleTier1LPISSegment, treeSegmentIdx: number) => {
                    return (
                      <div class="relative">
                      <span class="absolute top-[-10px] right-[-10px] z-20 bg-blue-500 text-white text-xs font-bold rounded-full px-2 py-1" >
                            {segment.years ? `${segment.years}y` : null}
                      </span>

                      <div
                        class={`hover:border-slate-600 cursor-pointer bg-white  flex gap-2 overflow-scroll border-2 border-slate-400 h-[100px] w-[200px] rounded-md p-2 ${
                          activeSegment()?.cropOrTree == "tree" &&
                            treeSegmentIdx == activeSegment()?.segmentIdx &&
                            rotationIdx == activeSegment()?.rotationIdx
                            ? "border-3 border-blue-500"
                            : "border-3 border-white"
                        }`}
                        onClick={() => {
                          setActiveSegment({
                            segmentData: segment,
                            cropOrTree: "tree",
                            rotationIdx: rotationIdx,
                            segmentIdx: treeSegmentIdx,
                          });
                        }}
                      >
                        
                          

                          {segment.LPIS_ID
                            ? `${
                              LPIS_DK.find(
                                ([id]) => id === segment.LPIS_ID,
                              )?.[1]
                            }`
                            : null}
                          
                        </div>
                        </div>
                      
                    );
                  },
                )}

                <Button
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
                                      { years: 1 },
                                    ],
                                  }
                                  : rotation,
                            ),
                          }
                          : field
                      ));
                  }}
                >
                  +
                </Button>
              </div>
            </div>
          ))}
          <div class="flex flex-col justify-center items-center">
            <Button
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
                    return field;
                  }),
                ]);
              }}
              class="w-[100px] h-[50px]"
            >
              Add land use
            </Button>
          </div>
        </div>
        <br />
      </div>

      {activeSegment()
        ? (
          <div class="p-2 my-2 bg-white rounded-md">
            <Button
              variant={"destructive"}
              onClick={() => {
                setStore("fields", (fields) =>
                  fields.map((field) =>
                    field.uuid === currentField()?.uuid
                      ? {
                        ...field,
                        rotations: field.rotations?.map(
                          (rotation, rotIdx) =>
                            rotIdx === activeSegment()?.rotationIdx
                              ? {
                                ...rotation,

                                cropSegments:
                                  activeSegment()?.cropOrTree === "crop"
                                    ? rotation.cropSegments
                                      .filter(
                                        (_, idx) =>
                                          idx !== activeSegment()?.segmentIdx,
                                      )
                                    : rotation.cropSegments,
                                treeSegments:
                                  activeSegment()?.cropOrTree === "tree"
                                    ? rotation.treeSegments
                                      .filter(
                                        (_, idx) =>
                                          idx !== activeSegment()?.segmentIdx,
                                      )
                                    : rotation.treeSegments,
                              }
                              : rotation,
                        ),
                      }
                      : field
                  ));
                  setActiveSegment(null)
              }}
            >
              <i class="fa-solid fa-x" />
            </Button>

            <br />
            <br />
            Model:
            <select>
              <option value={"simple_tier1"}>Simple (Tier 1)</option>
            </select>
            <br />
            <br />
            <TextField>
              <TextFieldLabel for="years">Years</TextFieldLabel>
              <TextFieldInput
                name="years"
                type="number"
                value={activeSegment()?.segmentData.years}
                min={1}
                onChange={(e) => {
                  setStore("fields", (fields) =>
                    fields.map((field) =>
                      field.uuid === params.fieldId
                        ? {
                          ...field,
                          rotations: field.rotations?.map((rotation, index) =>
                            index === activeSegment()?.rotationIdx
                              ? {
                                ...rotation,
                                [
                                  activeSegment()?.cropOrTree == "crop"
                                    ? "cropSegments"
                                    : "treeSegments"
                                ]: rotation[
                                  activeSegment()?.cropOrTree == "crop"
                                    ? "cropSegments"
                                    : "treeSegments"
                                ].map((segment, index) =>
                                  index === activeSegment()?.segmentIdx
                                    ? {
                                      ...segment,
                                      years: parseInt(e.target.value),
                                    }
                                    : segment
                                ),
                              }
                              : rotation
                          ),
                        }
                        : field
                    ));
                }}
              />
            </TextField>

            <br />

            <label
              class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              for="crop"
            >
              Crop
            </label>
            <select
              name="crop"
              class="block w-full mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              value={activeSegment()?.segmentData.LPIS_ID}
              onChange={(e) => {
                setActiveSegment((prevSegment) => {
                  if (!prevSegment) return null;
                  return {
                    ...prevSegment,
                    segmentData: {
                      ...prevSegment.segmentData,
                      LPIS_ID: parseInt(e.target.value),
                    },
                  };
                });

                setStore("fields", (fields) =>
                  fields.map((field) =>
                    field.uuid === params.fieldId
                      ? {
                        ...field,
                        rotations: field.rotations?.map((rotation, index) =>
                          index === activeSegment()?.rotationIdx
                            ? {
                              ...rotation,
                              [
                                activeSegment()?.cropOrTree == "crop"
                                  ? "cropSegments"
                                  : "treeSegments"
                              ]: rotation[
                                activeSegment()?.cropOrTree == "crop"
                                  ? "cropSegments"
                                  : "treeSegments"
                              ].map((segment, index) =>
                                index === activeSegment()?.segmentIdx
                                  ? {
                                    ...segment,
                                    LPIS_ID: parseInt(e.target.value),
                                  }
                                  : segment
                              ),
                            }
                            : rotation
                        ),
                      }
                      : field
                  ));
              }}
            >
              {LPIS_DK.map((species) => {
                return <option value={species[0]}>{species[1]}</option>;
              })}
            </select>
            <br />

            
            {/* <br /> */}
            {/* {activeSegment()?.segmentData.LPIS_ID
              ? (
                <>
                  <span class="gap-2 flex align-middle">
                    {LPIS_DK.find(
                        (el) => el[0] === activeSegment()?.segmentData.LPIS_ID,
                      )?.[2] === "JA"
                      ? (
                        <i class="fa-solid fa-check text-green-600 self-center" />
                      )
                      : 
                      <i class="fa-solid fa-minus text-red-400 self-center" />}
                    Carbon fixating
                  </span>
                  <span class="gap-2 flex">
                    {LPIS_DK.find(
                        (el) => el[0] === activeSegment()?.segmentData.LPIS_ID,
                      )?.[3] === "JA"
                      ? (
                        <i class="fa-solid fa-check text-green-600 self-center" />
                      )
                      : 
                      <i class="fa-solid fa-minus text-red-400 self-center" />}
                    Legume
                  </span>
                  <br />
                </>
              )
              : <></>} */}
          </div>
        )
        : null}

      <div class="p-2 my-2 bg-white rounded-md">
        <h2 class="font-bold mb-2">Field Emission</h2>

        {currentField()
          ? (
            <>
              <MyChart data={calculateFieldEmission(currentField()!)} />
            </>
          )
          : null}
      </div>
    </main>
    </Show>
  );
}
