import { A, useParams } from "@solidjs/router";
import { store, setStore } from "../../store/store";
import type { Field, SimpleTier1LPISSegment } from "../../store/store";

import { LPIS_DK } from "~/data/LPIS_DK_2023";
import { MyChart } from "~/components/chart";
import { createEffect, createSignal } from "solid-js";
import { calculateFieldEmission } from "~/util/emission";
import { Button } from "~/components/ui/button";
import { TextField, TextFieldInput, TextFieldLabel } from "~/components/ui/text-field";
import { Select, SelectItem } from "~/components/ui/select";

export default function FieldView() {
  const params = useParams<{ fieldId: string }>();

  let [currentField, setCurrentField] = createSignal<Field | undefined>();

  createEffect(() => {
    setCurrentField({
      ...store.fields.find((field) => field.uuid === params.fieldId)!,
    });
  });

  const [activeSegment, setActiveSegment] = createSignal<{
    segmentData: SimpleTier1LPISSegment;
    cropOrTree: "tree" | "crop";
    rotationIdx: number;
    segmentIdx: number;
  } | null>(null);

  return (
    <main class="mx-4 overflow-scroll">
      <div class="p-2 my-2 bg-white">
        <h2 class="font-bold mb-2">Field Information</h2>
        Name: {currentField()?.name}
        <br />
        Area: {currentField()?.area! > 5000
          ? `${(currentField()?.area! * 0.0001).toFixed(2)} ha`
          : `${currentField()?.area!.toFixed(0).replace(".", ",")} m2`}
      </div>

      <div class="p-2 my-2 bg-white">
        <h2 class="font-bold mb-2">Land Use and Land Use Changes:</h2>
        <div class="flex gap-5 overflow-scroll">
          {currentField()?.rotations?.map((rotation, rotationIdx) => (
            <div class="p-2 border border-gray-600">
              <Button
                variant={"destructive"}
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
                <i class="fa-solid fa-x" />
              </Button>

              <br />
              <br />
              Split (Tree area){" "}
              <input
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
                                      e.target.value
                                    ),
                                  }
                                : rotation
                            ),
                          }
                        : field
                    )
                  );
                }}
                type="number"
                min="0"
                max="100"
                value={rotation.splitTreePercent ?? 20}
              />
              %
              <br />
              <br />
              <div class="flex gap-5 justify-start items-center min-h-10">
                <span class="min-w-[120px]">Crop segments:</span>
                {rotation.cropSegments.map(
                  (segment: SimpleTier1LPISSegment, cropSegmentIdx: number) => {
                    return (
                      <div
                        class={`flex gap-2 items-center bg-white p-2 ${
                          activeSegment()?.cropOrTree == "crop" &&
                          cropSegmentIdx == activeSegment()?.segmentIdx &&
                          rotationIdx == activeSegment()?.rotationIdx
                            ? "border-3 border-blue-500"
                            : "border-3 border-white"
                        }`}
                      >
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
                                          rotIdx === rotationIdx
                                            ? {
                                                ...rotation,
                                                cropSegments:
                                                  rotation.cropSegments.filter(
                                                    (_, idx) =>
                                                      idx !== cropSegmentIdx
                                                  ),
                                              }
                                            : rotation
                                      ),
                                    }
                                  : field
                              )
                            );
                          }}
                        >
                          <i class="fa-solid fa-x" />
                        </Button>

                        <div
                          class="cursor-pointer"
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
                                  ([id]) => id === segment.LPIS_ID
                                )?.[1]
                              }`
                            : null}{" "}
                          {segment.years ? `(${segment.years}y)` : null}
                        </div>
                      </div>
                    );
                  }
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
                                    : rotation
                              ),
                            }
                          : field
                      )
                    );
                  }}
                >
                  +
                </Button>
              </div>
              <br />
              <div class="flex gap-5 justify-start items-center min-h-10">
                <span class="min-w-[120px]">Tree segments:</span>
                {rotation.treeSegments.map(
                  (segment: SimpleTier1LPISSegment, treeSegmentIdx: number) => {
                    return (
                      <div
                        class={`flex gap-2 items-center bg-white p-2 ${
                          activeSegment()?.cropOrTree == "tree" &&
                          treeSegmentIdx == activeSegment()?.segmentIdx &&
                          rotationIdx == activeSegment()?.rotationIdx
                            ? "border-3 border-blue-500"
                            : "border-3 border-white"
                        }`}
                      >
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
                                                treeSegments:
                                                  rotation.treeSegments.filter(
                                                    (_, idx) =>
                                                      idx !== treeSegmentIdx
                                                  ),
                                              }
                                            : rotation
                                      ),
                                    }
                                  : field
                              )
                            );
                          }}
                        >
                          Delete
                        </Button>

                        <div
                          class="cursor-pointer"
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
                                  ([id]) => id === segment.LPIS_ID
                                )?.[1]
                              }`
                            : null}{" "}
                          {segment.years ? `(${segment.years}y)` : null}
                        </div>
                      </div>
                    );
                  }
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
                                    : rotation
                              ),
                            }
                          : field
                      )
                    );
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
              class="w-fit"
            >
              Add land use
            </Button>
          </div>
        </div>
        <br />
      </div>

      {activeSegment() ? (
        <div class="p-2 my-2 bg-white">
          Model:
          <select>
            <option value={"simple_tier1"}>Simple (Tier 1)</option>
          </select>
          <br />
          <br />
          <br />
          <select
            value={activeSegment()?.segmentData.LPIS_ID}
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
                                [activeSegment()?.cropOrTree == "crop"
                                  ? "cropSegments"
                                  : "treeSegments"]: rotation[
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
                                [activeSegment()?.cropOrTree == "crop"
                                  ? "cropSegments"
                                  : "treeSegments"]: rotation[
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
                )
              );
            }}
          />
          </TextField>
          <br />
          {activeSegment()?.segmentData.LPIS_ID ? (
            <>
              <label for="carbon-fixating">Carbon fixating</label>
              <input
                disabled
                name=""
                type="checkbox"
                checked={
                  LPIS_DK.find(
                    (el) => el[0] === activeSegment()?.segmentData.LPIS_ID
                  )![2] === "JA"
                }
              />
              <br />
              <label for="legume">Legume</label>
              <input
                disabled
                name="legume"
                type="checkbox"
                checked={
                  LPIS_DK.find(
                    (el) => el[0] === activeSegment()?.segmentData.LPIS_ID
                  )![3] === "JA"
                }
              />
              <br />
            </>
          ) : (
            <></>
          )}
        </div>
      ) : null}

      <div class="p-2 my-2 bg-white">
        <h2 class="font-bold mb-2">Field Emission</h2>

        {currentField() ? (
          <>
            <MyChart data={calculateFieldEmission(currentField()!)} />
          </>
        ) : null}
      </div>
    </main>
  );
}
