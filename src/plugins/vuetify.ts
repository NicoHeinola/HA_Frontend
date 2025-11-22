/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
//@ts-ignore
import "@mdi/font/css/materialdesignicons.css";

//@ts-ignore
import "vuetify/styles";

// Composables
import { createVuetify } from "vuetify";

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: "dark",
    themes: {
      dark: {
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
