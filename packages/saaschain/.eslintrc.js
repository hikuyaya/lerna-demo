module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['plugin:vue/essential', 'eslint:recommended'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    "arrow-parens": [2, "as-needed"],
   // "semi": [2, "always"]
  },
  globals: {
    // 尽量避免使用全局变量
    $peace: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
