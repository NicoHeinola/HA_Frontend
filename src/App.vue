<script lang="ts" setup>
import DialogProvider from "./components/use-dialog/DialogProvider.vue";
import SnackbarProvider from "./components/use-snackbar/SnackbarProvider.vue";
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
