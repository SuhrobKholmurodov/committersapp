import { defineConfig, loadEnv, type ProxyOptions } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "node:path";

const VENDOR_CHUNKS: Record<string, RegExp> = {
  react: /[\\/]node_modules[\\/](react|react-dom|scheduler|react-router|react-router-dom|react-helmet-async)[\\/]/,
  redux: /[\\/]node_modules[\\/](@reduxjs|react-redux|redux|immer|reselect)[\\/]/,
  ui: /[\\/]node_modules[\\/](@radix-ui|@floating-ui|@tippyjs|tippy\.js|@popperjs)[\\/]/,
};

const createApiProxy = (env: Record<string, string>): Record<string, ProxyOptions> => {
  const target = env.API_URL?.trim();
  if (!target) return {};

  return {
    "/api": {
      target,
      changeOrigin: true,
      rewrite: (requestPath) => requestPath.replace(/^\/api/, ""),
      headers: env.API_KEY ? { "x-api-key": env.API_KEY } : undefined,
    },
  };
};

export default defineConfig(({ mode, isSsrBuild }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const proxy = createApiProxy(env);

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    server: { proxy },
    preview: { proxy },
    ssr: {
      noExternal: true,
    },
    build: isSsrBuild
      ? {
          outDir: "dist-ssr",
          emptyOutDir: true,
          copyPublicDir: false,
        }
      : {
          rollupOptions: {
            output: {
              manualChunks: (id: string) =>
                Object.entries(VENDOR_CHUNKS).find(([, pattern]) => pattern.test(id))?.[0],
            },
          },
        },
  };
});
