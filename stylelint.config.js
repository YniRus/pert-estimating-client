export default {
    extends: [
        'stylelint-config-standard-scss',
        'stylelint-config-standard-vue/scss',
        '@stylistic/stylelint-config',
        'stylelint-config-clean-order',
    ],
    rules: {
        '@stylistic/indentation': 4,
        '@stylistic/string-quotes': 'single',
        'color-function-notation': ['modern', { ignore: ['with-var-inside'] }],
    },
}
