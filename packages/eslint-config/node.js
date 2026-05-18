import globals from "globals"

import { config as baseConfig } from "./base.js"

/**
 * A shared ESLint configuration for Node.js-based packages.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export const nodeConfig = [
  ...baseConfig,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
]
