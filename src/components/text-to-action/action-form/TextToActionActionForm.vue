<script lang="ts" setup>
import type TextToActionAction from "@/models/text-to-action/TextToActionAction";
import { defineModel, defineProps } from "vue";

const props = defineProps<{
  isLoading?: boolean;
}>();

const action = defineModel<TextToActionAction>({ required: true });
</script>

<template>
  <v-form>
    <v-row>
      <v-col cols="12"> </v-col>
    </v-row>
  </v-form>
</template>
