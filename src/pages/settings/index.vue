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
const isSeeding = ref<Boolean>(false);
const openSnackbar = useSnackbar();
const { errorSnackbar } = useErrorSnackbar();

const newTextToActionSetting = ref<TextToActionSetting>({
  key: "",
  value: "",
  type: TextToActionSettingType.String,
});

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

const findSettingByKey = (settings: any[], key: string) => {
  return settings.find((s) => s.key === key);
};

const updateSettingValue = async (settings: any[], key: string, value: string) => {
  const setting = settings.find((s) => s.key === key);

  if (!setting) {
    return;
  }

  setting.value = value;
};

onMounted(getTextToActionSettings);
</script>

<template>
  <v-container class="pa-12">
    <v-row>
      <v-col class="d-flex align-center justify-space-between">
        <h1>TTA Settings</h1>
        <div class="d-flex align-center ga-2">
          <v-btn color="error" prepend-icon="mdi-seed" @click="seedTextToActionSettings" :isLoading="!!isSeeding">
            Seed TTA Settings
          </v-btn>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="pb-0">
        <text-label class="text-grey d-flex ga-1">
          <span> Existing keywords: </span>
          <span class="text-secondary">
            {actions}
            <v-tooltip
              activator="parent"
              text="Actions will be replaced with the actual JSON list of actions"
            ></v-tooltip>
          </span>
        </text-label>
      </v-col>
      <v-col cols="12">
        <v-textarea
          :model-value="findSettingByKey(textToActionSettings, 'system_prompt')?.value"
          @update:model-value="(update) => updateSettingValue(textToActionSettings, 'system_prompt', update)"
          :loading="!!isLoading || !!isSeeding"
          label="System prompt"
          rows="25"
        ></v-textarea>
      </v-col>
    </v-row>
  </v-container>
</template>
