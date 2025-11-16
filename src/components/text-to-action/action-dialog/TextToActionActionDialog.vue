<script lang="ts" setup>
import type TextToActionAction from "@/models/text-to-action/TextToActionAction";

const props = withDefaults(defineProps<{}>(), {});

defineModel<TextToActionAction>("action", { required: true, default: () => ({}) });

const emit = defineEmits<{
  (e: "resolve", payload: boolean): void;
}>();
</script>

<template>
  <v-card>
    <v-card-title>Edit Action </v-card-title>
    <v-card-text>
      <text-to-action-action-form v-model="action" />
    </v-card-text>
    <v-card-actions class="d-flex justify-end">
      <v-btn variant="outlined" color="error" @click="emit('resolve', false)">Cancel</v-btn>
      <v-btn variant="elevated" color="success" @click="emit('resolve', true)">OK</v-btn>
    </v-card-actions>
  </v-card>
</template>
