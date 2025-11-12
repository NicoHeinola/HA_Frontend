/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import "@mdi/font/css/materialdesignicons.css";
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
          primary: "#FFD600",
          secondary: "#00CAFF",
          error: "#FF1744",
          success: "#00C853",

          surface: "#121212",
          background: "#0A0A0A",
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
    },
    VTextarea: {
      variant: "outlined",
      color: "secondary",
      density: "compact",
    },
    VTextField: {
      variant: "outlined",
      color: "secondary",
      density: "compact",
    },
    VSelect: {
      variant: "outlined",
      color: "secondary",
      density: "compact",
    },
    VFileInput: {
      variant: "outlined",
      color: "secondary",
      density: "compact",
    },
    VAutocomplete: {
      variant: "outlined",
      color: "secondary",
      density: "compact",
    },
  },
});
