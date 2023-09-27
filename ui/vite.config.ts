import fs from 'fs';
import solid from "solid-start/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [solid({
    ssr: false
  })],

});
