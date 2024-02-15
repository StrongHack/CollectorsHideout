import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  dir: './',
})

/** @type {import('jest').Config} */
const config = {
  clearMocks: true,
  coverageProvider: "v8",
  moduleDirectories: ["node_modules", "<rootDir/>"],
  testEnvironment: 'node',
  testMatch: ["<rootDir>/tests/**/*.test.ts"],
  preset: 'ts-jest',
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
  }
};

export default config;
