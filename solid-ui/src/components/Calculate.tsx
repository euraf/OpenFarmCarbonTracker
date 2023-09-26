import { createSignal } from "solid-js";
import server$, { createServerAction$ } from "solid-start/server";

export default function Calculate() {



  const [temperatures, setTemperatures] = createSignal(0);

   const apiFetchOptions: () => RequestInit = () => {
    return {
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url}
    };
  };

  const callPython = async (message:string) => {
    console.log("call python script");  

    let response = await fetch('/api/energy/', {
      method: "GET",
      ...apiFetchOptions,
    })

    const data = await response.json();
    console.log(data)

    setTemperatures(data)


  };


  const [count, setCount] = createSignal(0);
  return (
    <button onClick={async () => {
      let data = await callPython('my message')
      console.log("on clieint:", data)

    }}>
      Calculate energy: {temperatures()? temperatures(): "no data"}
    </button>
  );
  
}
