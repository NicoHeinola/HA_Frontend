<script lang="ts" setup>
import type TextToActionAction from "@/models/text-to-action/TextToActionAction";

const action = defineModel<TextToActionAction>({ required: true });

const getShortenedText = (text: any, maxLength: number) => {
  if (!text) return "";

  if (text.length > maxLength) {
    return text.slice(0, maxLength) + "...";
  }

  return text;
};
</script>

<template>
  <v-card height="300px" class="d-flex flex-column">
    <v-card-title class="d-flex justify-space-between align-center">
      <p class="text-truncate">
        {{ action.name || "Unnamed Action" }}
      </p>
      <div class="d-flex align-center ga-2">
        <v-btn variant="text" icon="mdi-pencil" size="x-small"> </v-btn>
        <v-btn color="error" variant="text" icon="mdi-trash-can" size="x-small"> </v-btn>
      </div>
    </v-card-title>
    <v-card-text style="flex: 1 1 auto; display: flex; flex-direction: column; min-height: 0">
      <div style="flex: 1 1 auto; min-height: 0; overflow: auto" class="mb-5">
        <p>
          {{ getShortenedText(action.description || "No description", 300) }}
          <v-tooltip :text="getShortenedText(action.description, 500)" activator="parent"></v-tooltip>
        </p>
      </div>
      <div style="flex: 0 0 150px; height: 150px; min-height: 150px; max-height: 150px">
        <code-block class="h-100">{{ action.meta }}</code-block>
      </div>
    </v-card-text>
  </v-card>
</template>
