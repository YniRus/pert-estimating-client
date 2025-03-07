import js from '@eslint/js'
import ts from 'typescript-eslint'
import vue from 'eslint-plugin-vue'
import stylistic from '@stylistic/eslint-plugin'
import vitest from '@vitest/eslint-plugin'

import { includeIgnoreFile } from '@eslint/compat'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const gitignorePath = path.resolve(__dirname, '.gitignore')

export default ts.config(
    {
        files: ['**/*.{js,ts}'],
    },
    includeIgnoreFile(gitignorePath),
    js.configs.recommended,
    ...ts.configs.recommended,
    {
        files: ['**/*.{ts,vue}'],
        rules: {
            '@typescript-eslint/no-empty-object-type': ['error', {
                allowInterfaces: 'always',
            }],
            '@typescript-eslint/no-unused-expressions': ['error', {
                allowTernary: true,
                allowShortCircuit: true,
            }],
        },
    },
    ...vue.configs['flat/recommended'],
    {
        files: ['*.vue', '**/*.vue'],
        languageOptions: {
            parserOptions: {
                parser: '@typescript-eslint/parser',
            },
        },
        rules: {
            'vue/html-indent': ['warn', 4],
            'vue/max-attributes-per-line': ['warn', {
                singleline: {
                    max: 2,
                },
                multiline: {
                    max: 1,
                },
            }],
        },
    },
    stylistic.configs.customize({
        indent: 4,
        quotes: 'single',
        semi: false,
        braceStyle: '1tbs',
        commaDangle: 'always-multiline',
        arrowParens: true,
    }),
    {
        files: ['src/tests/**/*.test.{js,ts}'],
        plugins: {
            vitest,
        },
        rules: {
            ...vitest.configs.recommended.rules,
        },
    },
)
