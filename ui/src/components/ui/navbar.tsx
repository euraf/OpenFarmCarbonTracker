import { A } from "@solidjs/router";
import { JSX } from "solid-js";

export function Link(params:{ href:any, children:JSX.Element }) {
  return (
    <A
      end={false}
      class=" hover:bg-slate-700 hover:text-white hover:dark:bg-slate-700 hover:dark:text-white transition-colors duration-200 px-3 py-2 rounded-md"
      inactiveClass="bg-gray-400 text-white  dark:bg-gray-800  dark:text-gray-400"
      activeClass="bg-slate-700 text-white dark:bg-slate-700 dark:text-white"
      href={params.href}
    >
      {params.children}
    </A>
  );
}

export function NavBar () {
  return <div class="flex gap-2 m-4 bg-white p-2 rounded-lg">
  <Link href="/land-use">
   Land use
  </Link>
  <Link href="/energy-and-fuel">
    Energy and fuel
  </Link>
  <Link href="/livestock">
    Livestock
  </Link>
  <Link href="/buildings-and-equipment">
    Buildings and equipment
  </Link>
  
  
  <Link href="/farm-emission">
    Accumulated emission
  </Link>
</div>
}