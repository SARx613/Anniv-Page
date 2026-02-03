import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const base = process.env.BASE_URL || "/Anniv-Page/";

export default defineConfig({
  plugins: [react()],
  base,
});
 