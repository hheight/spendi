import path from "path";
import { defineConfig } from "vitest/config";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, ".env.test") });

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./")
    }
  },
  test: {
    include: ["tests/integration/**"],
    setupFiles: ["tests/helpers/setup-integration.ts"],
    poolOptions: {
      forks: {
        singleFork: true
      }
    }
  }
});
