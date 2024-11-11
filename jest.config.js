module.exports = {
  transform: {
    "^.+\\.jsx?$": "babel-jest"
  },
  testMatch: [
    "**/__tests__/**/*.[jt]s?(x)",
    "**/?(*.)+(spec|test).[tj]s?(x)"
  ],
  testPathIgnorePatterns: [
    "\\\\node_modules\\\\"
  ],
  testEnvironment: 'jest-environment-jsdom',
};