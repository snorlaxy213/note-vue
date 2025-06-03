module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es6: true
  },
  extends: [
    'plugin:vue/essential',
    'eslint:recommended',
    'plugin:prettier/recommended'
  ],
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  plugins: [
    'vue',
    'prettier'
  ],
  rules: {
    // 基础规则
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-unused-vars': 'warn',
    'no-undef': 'error',
    
    // Prettier集成
    'prettier/prettier': 'error',
    
    // 移除与Prettier冲突的规则
    // 'indent': 'off', // 由Prettier处理
    // 'quotes': 'off', // 由Prettier处理
    // 'semi': 'off', // 由Prettier处理
    // 'comma-dangle': 'off', // 由Prettier处理
    // 'no-trailing-spaces': 'off', // 由Prettier处理
    // 'eol-last': 'off', // 由Prettier处理
    // 'space-before-function-paren': 'off', // 由Prettier处理
    // 'object-curly-spacing': 'off', // 由Prettier处理
    // 'array-bracket-spacing': 'off', // 由Prettier处理
    
    // Vue 特定规则
    'vue/no-unused-components': 'warn',
    'vue/no-unused-vars': 'warn',
    'vue/component-name-in-template-casing': ['error', 'kebab-case'],
    'vue/prop-name-casing': ['error', 'camelCase'],
    'vue/attribute-hyphenation': ['error', 'always'],
    'vue/v-bind-style': ['error', 'shorthand'],
    'vue/v-on-style': ['error', 'shorthand'],
    'vue/order-in-components': ['error', {
      'order': [
        'el',
        'name',
        'parent',
        'functional',
        ['delimiters', 'comments'],
        ['components', 'directives', 'filters'],
        'extends',
        'mixins',
        'inheritAttrs',
        'model',
        ['props', 'propsData'],
        'data',
        'computed',
        'watch',
        'LIFECYCLE_HOOKS',
        'methods',
        ['template', 'render'],
        'renderError'
      ]
    }],
    
    // ES6+ 规则
    'prefer-const': 'error',
    'no-var': 'error',
    'arrow-spacing': 'off', // 由Prettier处理
    'template-curly-spacing': 'off', // 由Prettier处理
    'object-shorthand': 'error',
    
    // 新增规则
    'no-multiple-empty-lines': 'off', // 由Prettier处理
    'no-multi-spaces': 'off', // 由Prettier处理
    'key-spacing': 'off', // 由Prettier处理
    'comma-spacing': 'off' // 由Prettier处理
  },
  
  // 忽略特定文件的规则
  overrides: [
    {
      files: ['*.vue'],
      rules: {
        'indent': 'off'
      }
    },
    {
      files: ['*.config.js', 'vue.config.js'],
      rules: {
        'no-console': 'off'
      }
    }
  ]
};
