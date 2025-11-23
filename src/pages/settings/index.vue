<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import { TextToActionSettingService } from "@/services/text-to-action/TextToActionSetting.service";
import { useSnackbar } from "@/components/use-snackbar/useSnackbar";
import { useErrorSnackbar } from "@/utils/errorSnackbar";
import { useConfirm } from "@/components/use-dialog/confirm/useConfirm";
import { usePrompt } from "@/components/use-dialog/prompt/usePrompt";
import type TextToActionAction from "@/models/text-to-action/TextToActionAction";
import { useDialog } from "@/components/use-dialog/useDialog";
import TextToActionActionDialog from "@/components/text-to-action/action-dialog/TextToActionActionDialog.vue";
import { TextToActionActionService } from "@/services/text-to-action/TextToActionAction.service";
import { isValidJSON } from "@/utils/jsonText";
import { useSettingStore } from "@/stores/settingStore";

const settingStore = useSettingStore();
const textToActionActions = ref<TextToActionAction[]>([]);

const isLoading = ref<boolean>(false);
const isSeeding = ref<boolean>(false);
const areTTASettingsValid = ref<boolean>(true);
const { errorSnackbar } = useErrorSnackbar();
const openSnackbar = useSnackbar();
const openConfirm = useConfirm();
const { openPrompt } = usePrompt();
const openDialog = useDialog();

const textToActionSettings = computed({
  get: () => settingStore.settings,
  set: (value) => {
    settingStore.settings = value;
  },
});

const getTextToActionActions = async () => {
  isLoading.value = true;
  try {
    textToActionActions.value = await TextToActionActionService().getActions();
  } catch (error) {
    errorSnackbar(error, openSnackbar);
    textToActionActions.value = [];
  }
  isLoading.value = false;
};

const seedTextToActionSettings = async () => {
  const ok = await openConfirm({
    props: {
      title: "Seed General TTA Settings",
      text: "Are you sure you want to seed General TTA settings? This will overwrite existing General TTA settings.",
    },
  });

  if (!ok) return;

  isSeeding.value = true;

  try {
    await TextToActionSettingService().seedSettings({ replace: true });
    openSnackbar({ props: { text: "TTA Settings seeded" } });
    await settingStore.loadSettings();
  } catch (error) {
    errorSnackbar(error, openSnackbar);
  }

  isSeeding.value = false;
};

const saveTextToActionSettings = async () => {
  const ok = await openConfirm({
    props: {
      title: "Save General TTA Settings",
      text: "Are you sure you want to save the General TTA settings?",
    },
  });

  if (!ok) return;

  isLoading.value = true;

  try {
    for (const setting of textToActionSettings.value) {
      if (!setting.id) continue;

      await TextToActionSettingService().updateSetting(setting.id, setting);
    }

    openSnackbar({ props: { text: "General TTA Settings saved" } });

    await settingStore.loadSettings();
  } catch (error) {
    errorSnackbar(error, openSnackbar);
  }

  isLoading.value = false;
};

const openActionDialog = async (action?: TextToActionAction) => {
  const saved = await openDialog({
    component: TextToActionActionDialog,
    props: {
      action: action ? JSON.parse(JSON.stringify(action)) : undefined,
    },
  });

  if (!saved) return;

  await getTextToActionActions();
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

onMounted(async () => {
  await getTextToActionActions();
});
</script>

<template>
  <v-container class="pa-12">
    <v-row>
      <v-col cols="12" class="d-flex align-center justify-space-between">
        <h1>TTA Settings</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="d-flex align-center justify-space-between">
        <h2>General</h2>
        <div class="d-flex align-center ga-2">
          <v-btn
            color="error"
            prepend-icon="mdi-seed"
            variant="outlined"
            @click="seedTextToActionSettings"
            :loading="!!isLoading"
          >
            Seed
          </v-btn>
        </div>
      </v-col>

      <v-col cols="12">
        <text-to-action-settings-form
          v-model:is-valid="areTTASettingsValid"
          v-model="textToActionSettings"
          :isLoading="isSeeding || isLoading"
        />
      </v-col>

      <v-col cols="12" class="d-flex align-center justify-end">
        <v-btn
          color="success"
          @click="saveTextToActionSettings"
          :loading="!!isLoading"
          :disabled="!areTTASettingsValid"
        >
          Save
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="d-flex align-center justify-space-between">
        <h2>Actions</h2>
        <div class="d-flex align-center ga-2">
          <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn variant="outlined" append-icon="mdi-chevron-down" v-bind="props" :loading="!!isLoading">
                Add New
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="openActionDialog()">
                <template v-slot:prepend>
                  <v-icon>mdi-plus</v-icon>
                </template>
                <v-list-item-title>New Action</v-list-item-title>
              </v-list-item>
              <v-list-item @click="importNewAction">
                <template v-slot:prepend>
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
            cols="6"
            lg="4"
            xl="3"
            xxl="2"
            v-for="(action, i) in textToActionActions"
            :key="action.id"
            class="mb-4"
          >
            <text-to-action-actions-card
              @delete="getTextToActionActions"
              v-model="(textToActionActions[i] as TextToActionAction)"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>
