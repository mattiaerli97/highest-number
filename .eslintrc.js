module.exports = {
  root: true,
  env: {
    node: {
      plugins: ['transform-es2015-modules-commonjs'],
    },
  },
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module',
  },
  extends: [
    '@nuxtjs',
    'prettier',
    'plugin:prettier/recommended',
    'plugin:nuxt/recommended',
  ],
  plugins: ['prettier'],
  rules: {
    'no-prototype-builtins': 'off',
    'vue/no-mutating-props': 'off',
    'array-callback-return': 'off',
    'new-cap': 'off',
    'vue/no-v-html': 'off',
    'no-useless-constructor': 'off',
    'no-new': 'off',
  },
}
