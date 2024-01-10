import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { viteStaticCopy } from "vite-plugin-static-copy";
import path from "path";
const __dirname = path.resolve();
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: `${__dirname}/node_modules/localforage/dist/localforage.*.js`.replace(
            /\\/g,
            "/"
          ),
          dest: "localforage",
          overwrite: false
        }
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
      "/bare/": {
        target: "http://localhost:3000",
        rewrite: (path) => path.replace(/^\/bare/, ''),
        ws: true
      },
    }
  }
})
