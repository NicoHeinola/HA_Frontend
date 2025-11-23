<script lang="ts" setup>
import { ref } from "vue";
import Actions from "./tabs/Actions.vue";
import General from "./tabs/General.vue";
import SystemPrompt from "./tabs/SystemPrompt.vue";

const activeTab = ref<"general" | "system_prompt" | "actions">("general");

const tabs = [
  { id: "general", label: "General", component: General },
  { id: "system_prompt", label: "System Prompt", component: SystemPrompt },
  { id: "actions", label: "Actions", component: Actions },
];
</script>

<template>
  <v-container class="pa-12">
    <v-row>
      <v-col class="d-flex align-center justify-space-between" cols="12">
        <h1>TTA Settings</h1>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-tabs v-model="activeTab" class="mb-5">
          <v-tab v-for="tab in tabs" :key="tab.id" :value="tab.id">
            {{ tab.label }}
          </v-tab>
        </v-tabs>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <component :is="tabs.find((tab) => tab.id === activeTab)?.component" />
      </v-col>
    </v-row>
  </v-container>
</template>
