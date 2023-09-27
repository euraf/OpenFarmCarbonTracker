import { createSignal } from "solid-js";
import server$, { createServerAction$ } from "solid-start/server";
// import { Button } from "@kobalte/core";
import { Button, Typography } from "@suid/material"

export default function PredictEnergy() {



  const [contributions, setContributions] = createSignal(0);

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

    setContributions(data)


  };

  const [count, setCount] = createSignal(0);
  return (
    <>
    <Button variant="contained" onClick={async () => {
      let data = await callPython('my message')
      console.log("on clieint:", data)

    }}>
      {"Predict"}
    </Button >
    <br /><br />
    <Typography variant="body1" gutterBottom={true} >{contributions()? `Energy usage: ${parseFloat(contributions().toString()).toFixed(2)} tCO2e/year`: ""}</Typography>

    
      
      </>
  );
  
}
