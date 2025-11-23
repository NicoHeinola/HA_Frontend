<script lang="ts" setup>
import { onMounted } from "vue";
import { useTheme } from "vuetify";
import DialogProvider from "./components/use-dialog/DialogProvider.vue";
import SnackbarProvider from "./components/use-snackbar/SnackbarProvider.vue";
import { useSettingStore } from "./stores/settingStore";
import { useThemeStore } from "./stores/themeStore";

const settingStore = useSettingStore();
const themeStore = useThemeStore();
const theme = useTheme();

watch(
  () => themeStore.currentTheme,
  (newTheme) => {
    theme.global.name.value = newTheme;
  },
  { immediate: true },
);

onMounted(async () => {
  await settingStore.loadAll();
});
</script>

<template>
  <v-app>
    <snackbar-provider>
      <dialog-provider>
        <router-view />
      </dialog-provider>
    </snackbar-provider>
  </v-app>
</template>
