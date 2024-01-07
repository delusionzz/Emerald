import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from "path"
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
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
      }
    }
  }
})
