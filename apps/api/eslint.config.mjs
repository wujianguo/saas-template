import globals from "globals"

import { nodeConfig } from "@workspace/eslint-config/node"

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...nodeConfig,
  {
    files: ["**/*.spec.ts", "test/**/*.ts"],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
]
