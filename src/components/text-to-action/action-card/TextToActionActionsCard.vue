<script lang="ts" setup>
import type TextToActionAction from "@/models/text-to-action/TextToActionAction";

const props = defineProps<{}>();

const action = defineModel<TextToActionAction>("action", { required: true });
</script>

<template>
  <v-card>
    <v-card-title>{{ action.name || "Unnamed Action" }}</v-card-title>
    <v-card-text>
      <div v-if="action.description">
        <strong>Description:</strong>
        <p>{{ action.description }}</p>
      </div>
      <div v-if="action.meta">
        <strong>Meta:</strong>
        <p>{{ action.meta }}</p>
      </div>
    </v-card-text>
  </v-card>
</template>
