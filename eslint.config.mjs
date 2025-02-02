// @ts-check
import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

// Run `npx @eslint/config-inspector` to inspect the resolved config interactively
export default createConfigForNuxt({
  features: {
    // Rules for module authors
    tooling: true,
    // Rules for formatting
    stylistic: true,
  },
  dirs: {
    src: [
      './playground',
    ],
  },
})
  .append({
    rules: {
      // General
      'semi': ['error', 'never'],
      'quotes': ['error', 'single'],
      'comma-dangle': ['error', 'always-multiline'],
      'comma-spacing': ['error', { before: false, after: true }],
      'keyword-spacing': ['error', { before: true, after: true }],
      'space-before-function-paren': ['error', 'always'],
      'object-curly-spacing': ['error', 'always'],
      'arrow-spacing': ['error', { before: true, after: true }],
      'key-spacing': ['error', { beforeColon: false, afterColon: true, mode: 'strict' }],
      'space-before-blocks': ['error', 'always'],
      'space-infix-ops': ['error', { int32Hint: false }],
      'no-multi-spaces': ['error', { ignoreEOLComments: true }],
      'no-trailing-spaces': ['error'],

      // Typescript
      '@stylistic/type-annotation-spacing': 'error',
      '@stylistic/no-tabs': 'off',
      '@stylistic/indent': 'off',

      // Vuejs
      'vue/multi-word-component-names': 0,
      'vue/html-indent': ['off'],
      'vue/first-attribute-linebreak': ['off'],
      'vue/comma-spacing': ['error', { before: false, after: true }],
      'vue/script-indent': 'off', // Vueスクリプト内のインデントルールを無効化
      'vue/keyword-spacing': ['error', { before: true, after: true }],
      'vue/object-curly-spacing': ['error', 'always'],
      'vue/key-spacing': ['error', { beforeColon: false, afterColon: true, mode: 'strict' }],
      'vue/arrow-spacing': ['error', { before: true, after: true }],
      'vue/array-bracket-spacing': ['error', 'never'],
      'vue/block-spacing': ['error', 'always'],
      'vue/brace-style': ['error', 'stroustrup', { allowSingleLine: true }],
      'vue/space-infix-ops': ['error', { int32Hint: false }],
      'vue/max-attributes-per-line': 'off',
      'vue/padding-line-between-blocks': ['error', 'always'],
      'vue/html-closing-bracket-newline': 'off', // この行を追加
    },
  })
