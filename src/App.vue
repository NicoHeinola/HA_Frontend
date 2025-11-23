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
  <v-app class="app-background">
    <snackbar-provider>
      <dialog-provider>
        <router-view />
      </dialog-provider>
    </snackbar-provider>
  </v-app>
</template>

<style scoped>
.app-background {
  position: relative;
}

.app-background::before {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("@/assets/backgrounds/cartographer.png");
  background-repeat: repeat;
  background-attachment: fixed;
  opacity: 0.5;
  pointer-events: none;
}
</style>
