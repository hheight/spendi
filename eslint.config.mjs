import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript", "prettier"),
  {
    rules: {
      "no-console": ["error", { allow: ["warn", "error"] }]
    }
  },
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "app/generated"
    ]
  },
  {
    files: ["tests/e2e/**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    rules: {
      "react-hooks/rules-of-hooks": "off"
    }
  }
];

export default eslintConfig;
