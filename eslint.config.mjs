import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  // 1. Apply base JavaScript recommended rules globally
  js.configs.recommended,
  
  // 2. Apply TypeScript recommended rules to TS files
  ...tseslint.configs.recommended,

  // 3. Customize environment settings and language options
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node, // Optional: Adds support for 'process', 'module', etc.
      },
    },
  },
  
  // 4. Force specific files to parse as CommonJS if necessary
  {
    files: ["**/*.cjs"],
    languageOptions: {
      sourceType: "commonjs",
    },
  }
);
