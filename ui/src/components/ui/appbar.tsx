import { Component } from "solid-js";
import { ModeToggle } from "./mode-toggle";
import { initStore, setStore, store } from "~/store/store";

const AppBar: Component = () => {
  return (
    <div class="text-white bg-slate-700 flex justify-between items-center p-[15px]">
      <h1 class="text-white text-[25px] m-0">Open Farm Carbon Tracker</h1>
      <div class="flex items-center space-x-2">
        {/* <ModeToggle /> */}


        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            const dataStr = JSON.stringify(store);
            const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

            const exportFileDefaultName = 'open-farm-carbon-tracker.json';

            let linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
          }}
        >
          Save
        </button>
        <button
          class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            const inputElement = document.createElement('input');
            inputElement.type = 'file';
            inputElement.accept = 'application/json';
            inputElement.onchange = (event) => {
              const file = (event.target as HTMLInputElement).files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                  const content = e.target?.result as string;
                  const parsedData = JSON.parse(content);
                  setStore(parsedData);
                };
                reader.readAsText(file);
              }
            };
            inputElement.click();
          }}
        >
          Load
        </button>

        <button
          class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            setStore(initStore());
          }}
        >
          Reset
        </button>


        <a href="https://github.com/euraf/OpenFarmCarbonTracker">
          <img width="25" src="/github-mark/github-mark-white.png" />
        </a>
      </div>
    </div>
  );
};

export { AppBar };
