
import { defineConfig, ConfigEnv, UserConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv): UserConfig => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react({
      // Disable browser feature policy checks which are causing warnings
      jsxImportSource: '@emotion/react',
      plugins: [[
        'disable-feature-policy-warnings',
        {
          enforce: 'post',
          configResolved() {
            // This is a no-op plugin that gets applied to disable certain browser warnings
          }
        }
      ]]
    }),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  worker: {
    format: "es"
  }
}));
