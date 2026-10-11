import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { fileURLToPath, URL } from "node:url";
export default defineConfig({
  plugins: [
    tanstackRouter({ target: "react", autoCodeSplitting: true }),
    react(),
    {
      name: "app-html-route-fallback",
      configureServer(server) {
        server.middlewares.use((request, _response, next) => {
          const route = request.url?.split("?")[0];
          if (
            route &&
            /^\/(chain-of-command|handbook|hspu_app_new|official_media|srt_app_new|troopers|vehicle-guidelines)\.html$/.test(
              route,
            )
          ) {
            const query = request.url?.slice(route.length) ?? "";
            request.url = `/index.html${query}`;
          }
          next();
        });
      },
    },
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "~components": fileURLToPath(
        new URL("./src/components", import.meta.url),
      ),
      "~features": fileURLToPath(new URL("./src/features", import.meta.url)),
      "~types": fileURLToPath(new URL("./src/types", import.meta.url)),
    },
  },
});
