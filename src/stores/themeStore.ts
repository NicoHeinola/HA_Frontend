import { defineStore } from "pinia";
import { ref } from "vue";

export const useThemeStore = defineStore(
  "theme",
  () => {
    const currentTheme = ref<string>("SoftBlue");

    return {
      currentTheme,
    };
  },
  { persist: true },
);
