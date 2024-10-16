import { MyChart } from "~/components/chart";
import { calculateFarmEmission } from "~/util/emission";
import { country, Field, setCountry, setStore, store } from "~/store/store";
import { createMemo } from "solid-js";
import { NavBar } from "~/components/ui/navbar";

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
  return (
    <>
      <main class="p-4 grow flex flex-col">
        
        <div class=" p-3 bg-white rounded-lg">
          <h2 class="text-black ">Farm Emission</h2>
          <MyChart data={calculateFarmEmission(store.fields)} />
        </div>
      </main>
    </>
  );
}
