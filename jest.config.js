module.exports = {
  testEnvironment: 'jsdom',
  testMatch: ['**/tests/__tests__/**/*.test.js'],
  collectCoverageFrom: [
    'src/xdlvo-model.js',
    'src/xdlvo-controller.js',
    '!**/node_modules/**',
    '!**/*.min.js'
  ],
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50
    }
  },
  testTimeout: 10000,
  clearMocks: true,
  verbose: true,
  transform: {
    '^.+\\.js$': ['babel-jest', { 
      configFile: require('path').resolve(__dirname, 'babel.config.js')
    }]
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/tests/__mocks__/styleMock.js'
  },
  setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.js'],
  moduleDirectories: ['node_modules']
};
