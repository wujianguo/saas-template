import { nodeConfig } from "@workspace/eslint-config/node"

const jestGlobals = {
  afterEach: "readonly",
  beforeEach: "readonly",
  describe: "readonly",
  expect: "readonly",
  it: "readonly",
}

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...nodeConfig,
  {
    files: ["**/*.spec.ts", "test/**/*.ts"],
    languageOptions: {
      globals: jestGlobals,
    },
  },
]
