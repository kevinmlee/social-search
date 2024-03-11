module.exports = {
    env: {
      browser: true,
      node: true
    },
    extends: ['standard'],
    overrides: [
      {
        files: ['*.jsx'],
        excludedFiles: ['*.stories.jsx'],
        extends: ['plugin:react/recommended'],
        settings: {
          react: {
            version: 'detect'
          }
        }
      },
      {
        files: ['*.spec.{js,jsx}', '**/__mocks__/**', 'jest.*.js'],
        extends: ['plugin:jest/recommended'],
        env: {
          'jest/globals': true
        },
        rules: {
          'jest/expect-expect': ['error', {
            // Support for the HTTP assertions library SuperTest
            assertFunctionNames: ['expect', 'request.*.expect']
          }]
        }
      }
    ],
    rules: {
      'arrow-body-style': ['error', 'as-needed'],
      'arrow-parens': ['error', 'as-needed']
    },
    plugins: [
      'jest'
    ]
  }