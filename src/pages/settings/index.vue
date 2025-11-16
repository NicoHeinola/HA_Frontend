<script lang="ts" setup>
import { ref, onMounted } from "vue";
import type TextToActionSetting from "@/models/text-to-action/TextToActionSetting";
import { TextToActionSettingService } from "@/services/text-to-action/TextToActionSetting.service";
import { useSnackbar } from "@/components/use-snackbar/useSnackbar";
import { useErrorSnackbar } from "@/utils/errorSnackbar";
import { useConfirm } from "@/components/use-dialog/confirm/useConfirm";
import type TextToActionAction from "@/models/text-to-action/TextToActionAction";

const textToActionSettings = ref<TextToActionSetting[]>([]);
const textToActionActions = ref<TextToActionAction[]>([]);

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
      title: "Seed General TTA Settings",
      text: "Are you sure you want to seed General TTA settings? This will overwrite existing General TTA settings.",
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
          v-model:settings="textToActionSettings"
          v-model:actions="textToActionActions"
          :isLoading="isSeeding || isLoading"
        />
      </v-col>

      <v-col cols="12" class="d-flex align-center justify-end">
        <v-btn @click="saveTextToActionSettings" :loading="!!isLoading"> Save </v-btn>
      </v-col>
    </v-row>
    <v-row></v-row>
  </v-container>
</template>
