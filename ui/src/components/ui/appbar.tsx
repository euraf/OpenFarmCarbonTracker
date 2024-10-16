import { Component } from "solid-js";
import { ModeToggle } from "./mode-toggle";

const AppBar: Component = () => {
  return (
    <div class="text-white bg-slate-700 flex justify-between items-center p-[15px]">
      <h1 class="text-white text-[25px] m-0">Open Farm Carbon Tracker</h1>
      <div class="flex items-center space-x-2">
        {/* <ModeToggle /> */}
        <a href="https://github.com/euraf/OpenFarmCarbonTracker">
          <img width="25" src="/github-mark/github-mark-white.png" />
        </a>
      </div>
    </div>
  );
};

export { AppBar };
