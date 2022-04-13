module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/test/**/*.spec.ts'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/types/**/*.ts',
  ],
  "transform": {
    "\\.[jt]sx?$": [
      "babel-jest",
      {
        "babelrc": false,
        "presets": ["@babel/preset-typescript"],
        "plugins": [
          "@babel/plugin-proposal-optional-chaining",
          "@babel/plugin-transform-modules-commonjs"
        ]
      }
    ]
  },
  globals: {
    'ts-jest': {
      diagnostics: false,
      isolatedModules: true,
    },
  },
};
