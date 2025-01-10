import { Navigate } from "@solidjs/router";
import { Show, For } from "solid-js";
import { IconTrash } from "~/components/ui/icons";
import {
  TextField,
  TextFieldInput,
  TextFieldLabel,
} from "~/components/ui/text-field";
import { setStore, store, BuildingOrEquipment } from "~/store/store";

function ListSection({
  section,
  title,
}: {
  section: "buildings" | "equipment";
  title: string;
}) {
  function handleInputChange(
    index: number,
    field: keyof BuildingOrEquipment,
    value: string | number
  ) {
    setStore(section, index, field, value);
  }

  function addRow() {
    const currentYear = new Date().getFullYear();
    setStore(section, (items: BuildingOrEquipment[] = []) => [
      ...items,
      { name: "", year: currentYear, emission: 0 },
    ]);
  }

  function removeRow(index: number) {
    setStore(section, (items: BuildingOrEquipment[] = []) =>
      items.filter((_, i) => i !== index)
    );
  }

  return (
    <div class={`${section}-section`}>
      <h3 class="text-lg font-semibold mb-4">{title}</h3>
      <For each={store[section]}>
        {(item, index) => (
          <div class="flex gap-2   items-center">
            <button
              class="bg-gray-700 hover:bg-red-500 hover:text-white  text-white p-1 rounded-md flex mt-5 items-center justify-center w-8 h-8"
              onClick={() => removeRow(index())}
            >
              <IconTrash />
            </button>
            <TextField class="flex-1">
              <TextFieldLabel>Name</TextFieldLabel>
              <TextFieldInput
                type="text"
                value={item.name}
                onInput={(e) =>
                  handleInputChange(index(), "name", e.currentTarget.value)
                }
              />
            </TextField>
            <TextField class="w-24">
              <TextFieldLabel>Year</TextFieldLabel>
              <TextFieldInput
                type="number"
                min="1900"
                value={item.year}
                onInput={(e) => {
                  handleInputChange(
                    index(),
                    "year",
                    parseInt(e.currentTarget.value)
                  );
                }}
              />
            </TextField>
            <TextField class="w-50">
              <TextFieldLabel>Emission (kg CO2e)</TextFieldLabel>
              <TextFieldInput
                type="number"
                value={item.emission}
                onInput={(e) =>
                  handleInputChange(
                    index(),
                    "emission",
                    parseFloat(e.currentTarget.value)
                  )
                }
              />
            </TextField>
          </div>
        )}
      </For>
      <button
        class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md mt-2"
        onClick={addRow}
      >
        Add {title}
      </button>
    </div>
  );
}

export default function BuildingsAndEquipment() {
  return (
    <Show when={store.country?.length == 2} fallback={<Navigate href={"/"} />}>
      <div class="card bg-slate-100 shadow-md rounded-lg m-4 p-4 grid grid-cols-1 gap-4">

      <div class="border rounded-lg p-6 bg-white shadow-md">

        <ListSection section="buildings" title="Buildings" />
      </div>
      <div class="border rounded-lg p-6 bg-white shadow-md">
        <ListSection section="equipment" title="Equipment" />
      </div>
      </div>
    </Show>
  );
}
