import { A } from "@solidjs/router";

function Link({ href, children }) {
  return (
    <A
      end={true}
      class=" hover:bg-slate-700 hover:text-white hover:dark:bg-slate-700 hover:dark:text-white transition-colors duration-200 px-3 py-2 rounded-md"
      inactiveClass="bg-gray-400 text-white  dark:bg-gray-800  dark:text-gray-400"
      activeClass="bg-slate-700 text-white dark:bg-slate-700 dark:text-white"
      href={href}
    >
      {children}
    </A>
  );
}

export function NavBar () {
  return <div class="flex gap-2 m-4 bg-white p-2 rounded-lg">
  <Link href="/fields">
    Fields
  </Link>
  <Link href="/energy-and-fuel">
    Energy and Fuel
  </Link>
  <Link href="/animals">
    Animals
  </Link>
  <Link href="/machines-and-buildings">
    Machines and Buildings
  </Link>
  
  <Link href="/farm-emission">
    Accumulated Emission
  </Link>
</div>
}