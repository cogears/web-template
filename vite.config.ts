import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

const host = '0.0.0.0'
const port = 5173

export default defineConfig({
    base: './',
    plugins: [vue()],
    server: { host, port },
    preview: { host, port },
    build: {
        minify: false,
    },
})
