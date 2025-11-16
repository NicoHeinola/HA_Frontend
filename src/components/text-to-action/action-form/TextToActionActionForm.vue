<script lang="ts" setup>
import type TextToActionAction from "@/models/text-to-action/TextToActionAction";
import { defineModel, defineProps } from "vue";
import { rules } from "./rules";
import { ref } from "vue";

const props = defineProps<{
  isLoading?: boolean;
}>();

const allRules = rules();

const action = defineModel<TextToActionAction>({ required: true });

const metaTextarea = ref();

function handleMetaTab(event: KeyboardEvent) {
  if (event.key === "Tab") {
    event.preventDefault();

    const textarea = metaTextarea.value?.$el?.querySelector("textarea");
    if (!textarea) return;

    // Insert a tab
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = textarea.value;
    textarea.value = value.substring(0, start) + "\t" + value.substring(end);
    textarea.selectionStart = textarea.selectionEnd = start + 1;

    // Update v-model
    action.value.meta = textarea.value;
  }
}
</script>

<template>
  <v-form>
    <v-row>
      <v-col cols="12">
        <v-text-field
          label="Name"
          v-model="action.name"
          :loading="props.isLoading"
          :rules="allRules.name"
          class="required"
        />
      </v-col>
      <v-col cols="12">
        <v-textarea label="Description" v-model="action.description" :loading="props.isLoading" />
      </v-col>
      <v-col cols="12">
        <v-textarea
          label="Meta (JSON)"
          v-model="action.meta"
          :loading="props.isLoading"
          ref="metaTextarea"
          rows="10"
          @keydown="handleMetaTab"
        />
      </v-col>
    </v-row>
  </v-form>
</template>
