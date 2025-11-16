<script lang="ts" setup>
import type TextToActionAction from "@/models/text-to-action/TextToActionAction";

const props = defineProps<{
  action?: TextToActionAction;
}>();

const action = ref<TextToActionAction>(
  props.action || {
    meta: '{\n\t"params": {\n\t\t"param1": {\n\t\t\t"name": "INSERT_NAME",\n\t\t\t"description": "INSERT_DESCRIPTION",\n\t\t\t"allowed_values": ["VALUE_1", "VALUE_2"]\n\t\t}\n\t}\n}',
  }
);

const isValid = ref(false);

const emit = defineEmits<{
  (e: "resolve", payload: boolean): void;
}>();
</script>

<template>
  <v-card>
    <v-card-title>{{ action.id ? "Edit" : "New" }} Action </v-card-title>
    <v-card-text>
      <text-to-action-action-form v-model="action" v-model:isValid="isValid" />
    </v-card-text>
    <v-card-actions class="d-flex justify-end">
      <v-btn variant="outlined" color="error" @click="emit('resolve', false)">Cancel</v-btn>
      <v-btn variant="elevated" color="success" @click="emit('resolve', true)">Save</v-btn>
    </v-card-actions>
  </v-card>
</template>
