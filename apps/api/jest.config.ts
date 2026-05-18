import { nestConfig } from "@workspace/jest-config"

export default {
  ...nestConfig,
  moduleNameMapper: {
    "^@workspace/api$": "<rootDir>/../../../packages/api/src",
  },
}
