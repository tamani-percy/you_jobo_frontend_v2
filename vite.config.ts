import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import ui from '@nuxt/ui/vite'

export default defineConfig({
    plugins: [
        vue(),
        vueDevTools(),
        ui(),
        tailwindcss(),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        },
    },
    build: {
        rollupOptions: {
            external: [
                '@tailwindcss/oxide',
                '@tailwindcss/oxide-win32-x64-msvc',
            ],
        },
    },
    optimizeDeps: {
        exclude: [
            '@tailwindcss/oxide',
            '@tailwindcss/oxide-win32-x64-msvc',
        ],
    },
})