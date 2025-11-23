<script lang="ts" setup>
import type TextToActionAction from "@/models/text-to-action/TextToActionAction";
import { defineModel, defineProps } from "vue";
import { JSONTextToObject, objectToJSONString } from "@/utils/jsonText";
import { rules } from "./rules";

const props = defineProps<{
  isLoading?: boolean;
}>();

const allRules = rules();
const action = defineModel<TextToActionAction>({ required: true });
const isValid = defineModel<boolean>("isValid", { default: false });
const metaText = ref<string>(action.value.meta ? objectToJSONString(action.value.meta) : "");

watch(metaText, newVal => {
  try {
    const parsed = JSONTextToObject(newVal);
    action.value.meta = parsed;
  } catch {}
});
</script>

<template>
  <v-form v-model="isValid">
    <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="action.name"
          class="required"
          label="Name"
          :loading="props.isLoading"
          :rules="allRules.name"
        />
      </v-col>
      <v-col cols="12">
        <v-textarea v-model="action.description" label="Description" :loading="props.isLoading" />
      </v-col>
      <v-col cols="12">
        <code-block-editor
          v-model="metaText"
          label="Meta (JSON)"
          :loading="props.isLoading"
          rows="10"
          :rules="allRules.meta"
          validate-on="invalid-input"
        />
      </v-col>
    </v-row>
  </v-form>
</template>
