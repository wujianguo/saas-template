import type { Config } from "jest"

const config: Config = {
  moduleFileExtensions: ["js", "json", "ts"],
  moduleNameMapper: {
    "^@workspace/api$": "<rootDir>/../../packages/api/src",
  },
  rootDir: ".",
  testEnvironment: "node",
  testRegex: ".*\\.spec\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
}

export default config
