import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Served from the custom domain root (www.johndyates.com), so base stays "/".
export default defineConfig({
  plugins: [react()],
  base: "/",
});
