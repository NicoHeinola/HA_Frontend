/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Composables
import { createVuetify } from "vuetify";

// Styles
// @ts-ignore
import "@mdi/font/css/materialdesignicons.css";

// @ts-ignore
import "vuetify/styles";

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: "SoftBlue",
    themes: {
      SoftContrastDark: {
        dark: true,
        colors: {
          primary: "#0891B2",
          secondary: "#F97316",
          error: "#EF4444",
          success: "#22C55E",
          warning: "#FBBF24",

          surface: "#1C1917",
          background: "#0C0A09",
        },
      },
      GPTDark: {
        dark: true,
        colors: {
          primary: "#0EA5E9",
          secondary: "#FB923C",
          error: "#F87171",
          success: "#4ADE80",
          warning: "#FCD34D",

          surface: "#262626",
          background: "#171717",
        },
      },
      ContrastGPT: {
        dark: true,
        colors: {
          primary: "#FCA311",
          secondary: "#94ace0ff",
          error: "#EF4444",
          success: "#22C55E",
          warning: "#FBBF24",

          surface: "#1f1f1fff",
          background: "#000000",
        },
      },
      SoftBlue: {
        dark: true,
        colors: {
          primary: "#FFA987",
          secondary: "#B2E4DB",
          error: "#EF4444",
          success: "#22C55E",
          warning: "#FBBF24",

          surface: "#2f2f36ff",
          background: "#1E1E24",
        },
      },
    },
  },
  defaults: {
    VBtn: {
      variant: "elevated",
      color: "primary",
    },
    VDialog: {
      width: 800,
      scrim: "rgba(0,0,0,1)",
    },
    VTooltip: {
      location: "bottom",
      maxWidth: 450,
    },
    VTextarea: {
      variant: "outlined",
      color: "secondary",
      density: "compact",
      hideDetails: "auto",
    },
    VNumberInput: {
      variant: "outlined",
      color: "secondary",
      density: "compact",
      hideDetails: "auto",
    },
    VTextField: {
      variant: "outlined",
      color: "secondary",
      density: "compact",
      hideDetails: "auto",
    },
    VSelect: {
      variant: "outlined",
      color: "secondary",
      density: "compact",
      hideDetails: "auto",
    },
    VFileInput: {
      variant: "outlined",
      color: "secondary",
      density: "compact",
      hideDetails: "auto",
    },
    VAutocomplete: {
      variant: "outlined",
      color: "secondary",
      density: "compact",
      hideDetails: "auto",
    },
  },
});
