import vuetify from "eslint-config-vuetify";

export default vuetify(
  {},
  {
    rules: {
      "no-var": "error",
      "prefer-const": "error",
      "@stylistic/quotes": ["error", "double"],
      "@stylistic/semi": ["error", "always"],
      "antfu/top-level-function": "off",
      "func-style": ["error", "declaration", { allowArrowFunctions: true }],
      "vue/script-indent": "off",
    },
  },
);
