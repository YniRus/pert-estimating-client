import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        vuetify({
            styles: {
                configFile: 'src/plugins/vuetify/vuetify-settings.scss',
            },
        }),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    server: {
        watch: {
            ignored: ['**/coverage/**'],
        },
    },
})
