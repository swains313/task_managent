// jest.config.ts

import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "node",
  globals: {
    "ts-jest": {
      isolatedModules: true,
    },
  },
  moduleFileExtensions: ["ts", "js", "json"],
  testMatch: ["**/tests/**/*.test.ts"],
  maxWorkers: 1,  
  globalSetup: "<rootDir>/src/tests/setup/globalSetup.ts",  
  globalTeardown: "<rootDir>/src/tests/setup/globalTeardown.ts", 
  testTimeout: 30000,  
};

export default config;
