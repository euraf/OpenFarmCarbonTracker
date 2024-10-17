
import { useNavigate } from "@solidjs/router";
import { createSignal } from "solid-js";
import { Button } from "~/components/ui/button";
import { setStore, store } from "~/store/store";
import { countries } from "~/util/countries";



export default function Home() {

  if (store.country) {
    const navigate = useNavigate()
    navigate('/fields') 
  }

  const [selectedCountry, setSelectedCountry] = createSignal("");

  function handleCountrySelect() {
    if (selectedCountry()) {
      setStore("country", selectedCountry());
      window.location.href = "/fields";
    }
  }

  return (
    <div class="max-w-xs mt-4 mx-auto bg-white p-5 rounded-lg shadow-md text-center">
      <select
        value={selectedCountry()}
        onChange={(e) => setSelectedCountry(e.target.value)}
        class="w-full p-2 mb-3 rounded border border-gray-300"
      >
        <option value="" disabled>
          Select a country
        </option>
        {countries.map((country) => (
          <option value={country.code}>{country.name}</option>
        ))}
      </select>
      <Button onClick={handleCountrySelect} class="w-full">
        Continue
      </Button>
    </div>
  );
}
