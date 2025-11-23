<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { useConfirm } from "@/components/use-dialog/confirm/useConfirm";
import { useSnackbar } from "@/components/use-snackbar/useSnackbar";
import { TextToActionSettingService } from "@/services/text-to-action/TextToActionSetting.service";
import { useSettingStore } from "@/stores/settingStore";
import { useErrorSnackbar } from "@/utils/errorSnackbar";
import { findSettingByKey, updateSettingValue } from "@/utils/settingsHelpers";
import { rules } from "./rules";

const settingStore = useSettingStore();

const isLoadingTTASettings = ref<boolean>(false);
const isSeeding = ref<boolean>(false);
const areTTASettingsValid = ref<boolean>(true);
const { errorSnackbar } = useErrorSnackbar();
const openSnackbar = useSnackbar();
const openConfirm = useConfirm();
const formRef = ref();
const allRules = rules();

const ttaSettings = computed({
  get: () => settingStore.ttaSettings.filter((s) => ["default_model", "prediction_timeout"].includes(s.key)),
  set: (value) => {
    settingStore.ttaSettings = value;
  },
});

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
    await TextToActionSettingService().seedSettings({
      replace: true,
      keys_to_seed: ["default_model", "prediction_timeout"],
    });
    openSnackbar({ props: { text: "TTA Settings seeded" } });
    await settingStore.loadTTASettings();
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

  isLoadingTTASettings.value = true;

  try {
    for (const setting of ttaSettings.value) {
      if (!setting.id) continue;

      await TextToActionSettingService().updateSetting(setting.id, setting);
    }

    openSnackbar({ props: { text: "General TTA Settings saved" } });

    await settingStore.loadTTASettings();
  } catch (error) {
    errorSnackbar(error, openSnackbar);
  }

  isLoadingTTASettings.value = false;
};

onMounted(async () => {
  const isFormValid = (await formRef.value?.validate()) ?? true;
  areTTASettingsValid.value = isFormValid.valid;
});
</script>

<template>
  <v-row>
    <v-col class="d-flex align-center justify-space-between" cols="12">
      <h2>General</h2>
      <div class="d-flex align-center ga-2">
        <v-btn
          color="error"
          :loading="!!isLoadingTTASettings"
          prepend-icon="mdi-seed"
          variant="outlined"
          @click="seedTextToActionSettings"
        >
          Seed
        </v-btn>
      </div>
    </v-col>

    <v-col cols="12">
      <v-form ref="formRef" v-model="areTTASettingsValid">
        <v-row>
          <v-col cols="12">
            <v-select
              :items="settingStore.availableModels"
              label="Default Model"
              :loading="isSeeding || isLoadingTTASettings"
              :model-value="findSettingByKey(ttaSettings, 'default_model')?.value"
              :rules="allRules['default_model']"
              @update:model-value="(update) => updateSettingValue(ttaSettings, 'default_model', update)"
            />
          </v-col>
          <v-col cols="12">
            <v-number-input
              label="Prediction Timeout (seconds)"
              :loading="isSeeding || isLoadingTTASettings"
              :model-value="Number(findSettingByKey(ttaSettings, 'prediction_timeout')?.value)"
              :rules="allRules['prediction_timeout']"
              @update:model-value="(update) => updateSettingValue(ttaSettings, 'prediction_timeout', String(update))"
            />
          </v-col>
        </v-row>
      </v-form>
    </v-col>

    <v-col class="d-flex align-center justify-end" cols="12">
      <v-btn
        color="success"
        prepend-icon="mdi-content-save"
        :disabled="!areTTASettingsValid"
        :loading="!!isLoadingTTASettings"
        @click="saveTextToActionSettings"
      >
        Save
      </v-btn>
    </v-col>
  </v-row>
</template>
