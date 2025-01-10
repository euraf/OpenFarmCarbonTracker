import { store } from "~/store/store";

export const countries = [
  { code: "DK", name: "Denmark" },
  { code: "FI", name: "Finland" },
  { code: "NL", name: "Netherlands" },
  { code: "AT", name: "Austria" },
  { code: "FR", name: "France" },
];

export type CountryCode = "DK" | "FI" | "NL" | "AT" | "FR";



export function getCountryName(code: CountryCode): string | undefined {
  const country = countries.find((country) => country.code === code);
  return country ? country.name : undefined;
}

export function getStoreCountryName(): string | undefined {
  return getCountryName(store.country);
}
