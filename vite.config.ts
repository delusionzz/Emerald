import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { viteStaticCopy } from "vite-plugin-static-copy";
// @ts-expect-error no types
import { libcurlPath } from "@mercuryworkshop/libcurl-transport";
import path from "path";
const __dirname = path.resolve();
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: `${libcurlPath}/**/*`.replace(/\\/g, "/"),
          dest: "libcurl",
          overwrite: false
        },
      ]
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/w/": {
        target: "http://localhost:4000/",
        rewrite: (path) => path.replace(/^\/w/, ''),
        ws: true
      },
      "/cdn/": {
        target: "https://cdn.delusionz.xyz",
        rewrite: (path) => path.replace(/^\/cdn/, ''),
        changeOrigin: true
      }
    }
  }
})


