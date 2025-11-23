<script setup lang="ts">
import { provide, ref } from "vue";

const isOpen = ref(false);
const snackbarProps = ref<Record<string, any>>({});
let resolvePromise: ((value: any) => void) | null = null;

const openSnackbar = ({ props }: any) => {
  snackbarProps.value = props || {};
  isOpen.value = true;

  return new Promise((resolve) => {
    resolvePromise = resolve;
  });
};

const handleClose = () => {
  if (resolvePromise) resolvePromise(null);
  resolvePromise = null;
};

provide("openSnackbar", openSnackbar);
</script>

<template>
  <slot />
  <v-snackbar v-model="isOpen" color="success" v-bind="snackbarProps" :timeout="5000" @update:model-value="handleClose">
    <template #actions>
      <v-btn text @click="isOpen = false" color="text">OK</v-btn>
    </template>
  </v-snackbar>
</template>
