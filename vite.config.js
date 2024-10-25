import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import WindiCSS from 'vite-plugin-windicss'
import VueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
// '@': fileURLToPath(new URL('./src', import.meta.url))
export default defineConfig({
  plugins: [
    vue(),
    WindiCSS(),
    VueDevTools(),
  ],
  resolve: {
    alias: {

    },
  },

})
