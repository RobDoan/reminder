// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  transform: {
    '^.+\\.[t|j]sx?$': 'babel-jest'
  },
  coveragePathIgnorePatterns: ['/node_modules/', 'jest.setup.js'],
  collectCoverage: true,
  coverageProvider: 'v8',
  coverageReporters: ['clover'],
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/jest-setup/test-setup.js'],
  setupFilesAfterEnv: ['<rootDir>/jest-setup/test-setup.after.js'],

  // The glob patterns Jest uses to detect test files
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],
  // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
  testPathIgnorePatterns: ['/node_modules/']
}
