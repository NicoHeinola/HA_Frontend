<script lang="ts" setup>
import { onMounted } from "vue";
import DialogProvider from "./components/use-dialog/DialogProvider.vue";
import SnackbarProvider from "./components/use-snackbar/SnackbarProvider.vue";
import { useSettingStore } from "./stores/settingStore";

const settingStore = useSettingStore();

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
