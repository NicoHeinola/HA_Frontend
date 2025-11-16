<script lang="ts" setup>
import { ref, onMounted } from "vue";
import type TextToActionSetting from "@/models/text-to-action/TextToActionSetting";
import { TextToActionSettingService } from "@/services/text-to-action/TextToActionSetting.service";
import { useSnackbar } from "@/components/use-snackbar/useSnackbar";
import { useErrorSnackbar } from "@/utils/errorSnackbar";
import { useConfirm } from "@/components/use-dialog/confirm/useConfirm";

const textToActionSettings = ref<TextToActionSetting[]>([]);
const isLoading = ref(false);
const isSeeding = ref(false);
const openSnackbar = useSnackbar();
const { errorSnackbar } = useErrorSnackbar();
const openConfirm = useConfirm();

const getTextToActionSettings = async () => {
  isLoading.value = true;
  try {
    textToActionSettings.value = await TextToActionSettingService().getSettings();
  } catch (error) {
    errorSnackbar(error, openSnackbar);
    textToActionSettings.value = [];
  }
  isLoading.value = false;
};

const seedTextToActionSettings = async () => {
  isSeeding.value = true;

  try {
    await TextToActionSettingService().seedSettings({ replace: true });
    openSnackbar({ props: { text: "TTA Settings seeded" } });
    await getTextToActionSettings();
  } catch (error) {
    errorSnackbar(error, openSnackbar);
  }

  isSeeding.value = false;
};

const saveTextToActionSettings = async () => {
  isLoading.value = true;

  try {
    for (const setting of textToActionSettings.value) {
      if (!setting.id) continue;

      await TextToActionSettingService().updateSetting(setting.id, setting);
    }

    openSnackbar({ props: { text: "General TTA Settings saved" } });

    await getTextToActionSettings();
  } catch (error) {
    errorSnackbar(error, openSnackbar);
  }

  isLoading.value = false;
};

onMounted(getTextToActionSettings);
</script>

<template>
  <v-container class="pa-12">
    <v-row>
      <v-col cols="12" class="d-flex align-center justify-space-between">
        <h1>TTA Settings</h1>
      </v-col>
    </v-row>
    <text-to-action-settings-form
      @seed:settings="seedTextToActionSettings"
      @save:settings="saveTextToActionSettings"
      v-model:settings="textToActionSettings"
      :isLoading="isSeeding || isLoading"
    />
  </v-container>
</template>
