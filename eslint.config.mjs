import tsPlugin from "@typescript-eslint/eslint-plugin";

export default [
  ...tsPlugin.configs["flat/recommended"],
  {
    files: ["src/**/*.ts"],
    rules: {
      // the card talks to untyped Home Assistant internals
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];
