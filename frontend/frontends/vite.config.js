/* eslint-env node */
/* eslint-env node */
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");   // load all envs, then read VITE_*
  const port = Number(env.VITE_PORT) || 5174;

  return {
    plugins: [react()],
    server: {
      port,
      watch: { usePolling: true },
    },
  };
});
