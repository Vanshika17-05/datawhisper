import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
  { ignores: ["dist"] },
  js.configs.recommended,
  {
    files: ["**/*.{js,jsx}"],
    plugins: { "react-hooks": reactHooks, "react-refresh": reactRefresh },
    rules: {
      ...reactHooks.configs.flat.recommended.rules,
      "no-unused-vars": ["error", { varsIgnorePattern: "^[A-Z_]|^motion$" }],
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
    },
    languageOptions: { ecmaVersion: 2020, globals: globals.browser, parserOptions: { ecmaVersion: "latest", ecmaFeatures: { jsx: true }, sourceType: "module" } },
  },
];
