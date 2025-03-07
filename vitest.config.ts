import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
    viteConfig,
    defineConfig({
        test: {
            globals: true,
            environment: 'jsdom',
            root: fileURLToPath(new URL('./', import.meta.url)),
            exclude: configDefaults.exclude,
            coverage: {
                provider: 'v8',
                reporter: ['text'],
            },
            server: {
                deps: {
                    inline: ['vuetify'],
                },
            },
        },
    }),
)
