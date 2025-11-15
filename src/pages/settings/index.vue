<script lang="ts" setup>
import { ref, onMounted, watch } from "vue";
import type TextToActionSetting from "@/models/text-to-action/TextToActionSetting";
import { TextToActionSettingType } from "@/models/text-to-action/TextToActionSetting";
import { TextToActionSettingService } from "@/services/text-to-action/TextToActionSetting.service";
import { useSnackbar } from "@/components/use-snackbar/useSnackbar";
import { useErrorSnackbar } from "@/utils/errorSnackbar";
import { useConfirm } from "@/components/use-dialog/confirm/useConfirm";
import TextLabel from "@/components/text-label/TextLabel.vue";

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
  const ok = await openConfirm({
    props: {
      title: "Seed TTA Settings",
      text: "Are you sure you want to seed TTA settings? This will overwrite existing TTA settings.",
    },
  });

  if (!ok) return;

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

onMounted(getTextToActionSettings);
</script>

<template>
  <v-container class="pa-12">
    <v-row>
      <v-col cols="12" class="d-flex align-center justify-space-between">
        <h1>TTA Settings</h1>
        <div class="d-flex align-center ga-2">
          <v-btn color="error" prepend-icon="mdi-seed" @click="seedTextToActionSettings" :isLoading="!!isSeeding">
            Seed TTA Settings
          </v-btn>
        </div>
      </v-col>
    </v-row>
    <TextToActionSettingsForm v-model:settings="textToActionSettings" :isLoading="isSeeding || isLoading" />
  </v-container>
</template>
