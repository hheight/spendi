import path from "path";
import dotenv from "dotenv";
import { defineConfig } from "vitest/config";

dotenv.config({ path: ".env.test" });

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./")
    }
  },
  test: {
    include: ["tests/integration/**/*.test.ts"],
    setupFiles: ["tests/helpers/setup-integration.ts"],
    poolOptions: {
      forks: {
        singleFork: true
      }
    }
  }
});
