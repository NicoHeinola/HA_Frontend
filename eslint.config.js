import vuetify from "eslint-config-vuetify";
import pluginVue from "eslint-plugin-vue";

export default vuetify(
  pluginVue.configs["flat/recommended"],
  {
    rules: {
      "no-var": "error",
      "prefer-const": "error",
      "@stylistic/quotes": ["error", "double"],
      "@stylistic/semi": ["error", "always"],
      "@stylistic/arrow-parens": "off",
      "antfu/top-level-function": "off",
      "func-style": ["error", "declaration", { allowArrowFunctions: true }],
      "vue/script-indent": "off",
      "vue/attributes-order": "off",
      "semi": "off",
      "vue/max-attributes-per-line": ["error", { singleline: 10 }],
    },
  },
);
