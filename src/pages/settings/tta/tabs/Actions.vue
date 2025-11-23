<script lang="ts" setup>
import type TextToActionAction from "@/models/text-to-action/TextToActionAction";
import { ref } from "vue";
import TextToActionActionDialog from "@/components/text-to-action/action-dialog/TextToActionActionDialog.vue";
import { usePrompt } from "@/components/use-dialog/prompt/usePrompt";
import { useDialog } from "@/components/use-dialog/useDialog";
import { useSnackbar } from "@/components/use-snackbar/useSnackbar";
import { useSettingStore } from "@/stores/settingStore";
import { isValidJSON } from "@/utils/jsonText";

const settingStore = useSettingStore();

const isLoadingTTASettings = ref<boolean>(false);
const openSnackbar = useSnackbar();
const { openPrompt } = usePrompt();
const openDialog = useDialog();

const openActionDialog = async (action?: TextToActionAction) => {
  const saved = await openDialog({
    component: TextToActionActionDialog,
    props: {
      action: action ? structuredClone(action) : undefined,
    },
  });

  if (!saved) return;

  await settingStore.loadTTAActions();
};

const importNewAction = async () => {
  const dataStr = await openPrompt({
    props: {
      title: "Import Action",
      text: "Paste the action JSON data:",
      label: "Action JSON",
      inputType: "textarea",
    },
  });

  if (!dataStr) {
    return;
  }

  const importedAction: TextToActionAction = isValidJSON(dataStr);
  if (!importedAction) {
    openSnackbar({ props: { color: "warning", text: "Invalid action data format" } });
    return;
  }

  // Clear id to create new action
  importedAction.id = undefined;

  openActionDialog(importedAction);
};
</script>

<template>
  <v-row>
    <v-col class="d-flex align-center justify-space-between" cols="12">
      <h2>Actions</h2>
      <div class="d-flex align-center ga-2">
        <v-menu>
          <template #activator="{ props }">
            <v-btn append-icon="mdi-chevron-down" v-bind="props" :loading="!!isLoadingTTASettings"> Add New </v-btn>
          </template>
          <v-list>
            <v-list-item @click="openActionDialog()">
              <template #prepend>
                <v-icon>mdi-plus</v-icon>
              </template>
              <v-list-item-title>New Action</v-list-item-title>
            </v-list-item>
            <v-list-item @click="importNewAction">
              <template #prepend>
                <v-icon>mdi-upload</v-icon>
              </template>
              <v-list-item-title>Import Action</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-col>
    <v-col cols="12">
      <v-row>
        <v-col
          v-for="(action, i) in settingStore.ttaActions"
          :key="action.id"
          class="mb-4"
          cols="6"
          lg="4"
          xl="3"
          xxl="2"
        >
          <text-to-action-actions-card
            v-model="(settingStore.ttaActions[i] as TextToActionAction)"
            @delete="settingStore.loadTTAActions"
          />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>
