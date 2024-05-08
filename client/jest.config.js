module.exports = {
  collectCoverage: true,
  coverageProvider: 'v8',
  coverageReporters: ['json', 'html', 'lcovonly', 'text-summary'],
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};