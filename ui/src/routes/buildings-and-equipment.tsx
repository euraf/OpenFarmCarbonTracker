import { Navigate } from "@solidjs/router";
import { Show, For } from "solid-js";
import {
  TextField,
  TextFieldInput,
  TextFieldLabel,
} from "~/components/ui/text-field";
import { setStore, store, BuildingOrEquipment } from "~/store/store";

export default function BuildingsAndEquipment() {
  function handleInputChange(
    section: "buildings" | "equipment",
    index: number,
    field: keyof BuildingOrEquipment,
    value: string | number
  ) {
    setStore(section, index, field, value);
  }

  function addRow(section: "buildings" | "equipment") {
    setStore(section, (items: BuildingOrEquipment[] = []) => [
      ...items,
      { name: "", year: 0, emission: 0 },
    ]);
  }

  function removeRow(section: "buildings" | "equipment", index: number) {
    setStore(section, (items: BuildingOrEquipment[] = []) =>
      items.filter((_, i) => i !== index)
    );
  }

  return (
    <Show when={store.country?.length == 2} fallback={<Navigate href={"/"} />}>
      <div class="card bg-white shadow-md rounded-lg m-4 p-4 grid grid-cols-1 gap-4">
        <div class="buildings-section">
          <h3 class="text-lg font-semibold">Buildings</h3>
          <For each={store.buildings}>
            {(building, index) => (
              <div class="grid grid-cols-3 gap-2 mb-2">
                <TextField>
                  <TextFieldLabel>Name</TextFieldLabel>
                  <TextFieldInput
                    type="text"
                    value={building.name}
                    onInput={(e) =>
                      handleInputChange(
                        "buildings",
                        index(),
                        "name",
                        e.currentTarget.value
                      )
                    }
                  />
                </TextField>
                <TextField>
                  <TextFieldLabel>Year</TextFieldLabel>
                  <TextFieldInput
                    type="number"
                    value={building.year}
                    onInput={(e) =>
                      handleInputChange(
                        "buildings",
                        index(),
                        "year",
                        parseInt(e.currentTarget.value)
                      )
                    }
                  />
                </TextField>
                <TextField>
                  <TextFieldLabel>Emission (kg CO2e)</TextFieldLabel>
                  <TextFieldInput
                    type="number"
                    value={building.emission}
                    onInput={(e) =>
                      handleInputChange(
                        "buildings",
                        index(),
                        "emission",
                        parseFloat(e.currentTarget.value)
                      )
                    }
                  />
                </TextField>
                <button onClick={() => removeRow("buildings", index())}>
                  Remove
                </button>
              </div>
            )}
          </For>
          <button onClick={() => addRow("buildings")}>Add Building</button>
        </div>

        <div class="equipment-section">
          <h3 class="text-lg font-semibold">Equipment</h3>
          <For each={store.equipment}>
            {(equipment, index) => (
              <div class="grid grid-cols-3 gap-2 mb-2">
                <TextField>
                  <TextFieldLabel>Name</TextFieldLabel>
                  <TextFieldInput
                    type="text"
                    value={equipment.name}
                    onInput={(e) =>
                      handleInputChange(
                        "equipment",
                        index(),
                        "name",
                        e.currentTarget.value
                      )
                    }
                  />
                </TextField>
                <TextField>
                  <TextFieldLabel>Year</TextFieldLabel>
                  <TextFieldInput
                    type="number"
                    value={equipment.year}
                    onInput={(e) =>
                      handleInputChange(
                        "equipment",
                        index(),
                        "year",
                        parseInt(e.currentTarget.value)
                      )
                    }
                  />
                </TextField>
                <TextField>
                  <TextFieldLabel>Emission (kg CO2e)</TextFieldLabel>
                  <TextFieldInput
                    type="number"
                    value={equipment.emission}
                    onInput={(e) =>
                      handleInputChange(
                        "equipment",
                        index(),
                        "emission",
                        parseFloat(e.currentTarget.value)
                      )
                    }
                  />
                </TextField>
                <button onClick={() => removeRow("equipment", index())}>
                  Remove
                </button>
              </div>
            )}
          </For>
          <button onClick={() => addRow("equipment")}>Add Equipment</button>
        </div>
      </div>
    </Show>
  );
}
