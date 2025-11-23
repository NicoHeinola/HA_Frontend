import { defineStore } from "pinia";
import { ref } from "vue";
import vuetify from "@/plugins/vuetify";

export const useThemeStore = defineStore(
  "theme",
  () => {
    const currentTheme = ref<string>("SoftBlue");

    const setTheme = (theme: string) => {
      currentTheme.value = theme;
      vuetify.theme.global.name.value = theme;
    };

    return {
      currentTheme,
      setTheme,
    };
  },
  { persist: true },
);
