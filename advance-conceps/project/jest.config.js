/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest", { isolatedModules: true }],
  },
  setupFiles: ["./tests/setup.ts"],
  setupFilesAfterEnv: ["./tests/setupEnv.ts"],
  // verbose: true,
  passWithNoTests: true,
  detectLeaks: true,
  detectOpenHandles: true,
  workerIdleMemoryLimit: "512MB",
  logHeapUsage: true,
  // maxWorkers: 1,
  // maxConcurrency: 2,
  globalSetup: "./tests/globalSetup.ts",
};
