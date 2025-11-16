<script lang="ts" setup>
import type TextToActionAction from "@/models/text-to-action/TextToActionAction";

const props = defineProps<{}>();

const action = defineModel<TextToActionAction>({ required: true });
</script>

<template>
  <v-card>
    <v-card-title>{{ action.name || "Unnamed Action" }}</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <p>{{ action.description || "No description provided" }}</p>
        </v-col>
        <v-col cols="12">
          <code-block>{{ action.meta }}</code-block>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
