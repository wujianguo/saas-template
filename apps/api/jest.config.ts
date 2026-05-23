import { nestConfig } from "@workspace/jest-config"

export default {
  ...nestConfig,
  moduleNameMapper: {
    "^@workspace/api$": "<rootDir>/../../../packages/api/src",
  },
  transformIgnorePatterns: [
    "node_modules/(?!\\.pnpm|@better-auth|better-auth|better-call|resend)",
  ],
}
