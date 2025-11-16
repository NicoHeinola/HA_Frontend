<script lang="ts" setup>
import type TextToActionAction from "@/models/text-to-action/TextToActionAction";
import { defineModel, defineProps } from "vue";
import { rules } from "./rules";
import { JSONTextToObject, objectToJSONString } from "@/utils/jsonText";

const props = defineProps<{
  isLoading?: boolean;
}>();

const allRules = rules();
const action = defineModel<TextToActionAction>({ required: true });
const isValid = defineModel<boolean>("isValid", { default: false });
const metaText = ref<string>(action.value.meta ? objectToJSONString(action.value.meta) : "");

watch(metaText, (newVal) => {
  try {
    const parsed = JSONTextToObject(newVal);
    action.value.meta = parsed;
  } catch (e) {}
});
</script>

<template>
  <v-form v-model="isValid">
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
        <code-block-editor
          :rules="allRules.meta"
          label="Meta (JSON)"
          v-model="metaText"
          :loading="props.isLoading"
          rows="10"
          validate-on="invalid-input"
        />
      </v-col>
    </v-row>
  </v-form>
</template>
