<script lang="ts" setup>
import { computed, ref } from "vue";
import TextLabel from "@/components/text-label/TextLabel.vue";
import { useConfirm } from "@/components/use-dialog/confirm/useConfirm";
import { useSnackbar } from "@/components/use-snackbar/useSnackbar";
import { TextToActionSettingService } from "@/services/text-to-action/TextToActionSetting.service";
import { useSettingStore } from "@/stores/settingStore";
import { useErrorSnackbar } from "@/utils/errorSnackbar";
import { findSettingByKey, updateSettingValue } from "@/utils/settingsHelpers";

const settingStore = useSettingStore();

const isLoadingTTASettings = ref<boolean>(false);
const isSeeding = ref<boolean>(false);
const { errorSnackbar } = useErrorSnackbar();
const openSnackbar = useSnackbar();
const openConfirm = useConfirm();

const systemPromptSetting = computed({
  get: () => findSettingByKey(settingStore.ttaSettings, "system_prompt")?.value || "",
  set: (value) => {
    updateSettingValue(settingStore.ttaSettings, "system_prompt", value);
  },
});

const seedSystemPrompt = async () => {
  const ok = await openConfirm({
    props: {
      title: "Seed System Prompt",
      text: "Are you sure you want to seed the system prompt? This will overwrite the existing system prompt.",
    },
  });

  if (!ok) return;

  isSeeding.value = true;

  try {
    await TextToActionSettingService().seedSettings({
      replace: true,
      keys_to_seed: ["system_prompt"],
    });
    openSnackbar({ props: { text: "System prompt seeded" } });
    await settingStore.loadTTASettings();
  } catch (error) {
    errorSnackbar(error, openSnackbar);
  }

  isSeeding.value = false;
};

const saveSystemPrompt = async () => {
  const ok = await openConfirm({
    props: {
      title: "Save System Prompt",
      text: "Are you sure you want to save the system prompt?",
    },
  });

  if (!ok) return;

  isLoadingTTASettings.value = true;

  try {
    const setting = findSettingByKey(settingStore.ttaSettings, "system_prompt");
    if (setting && setting.id) {
      await TextToActionSettingService().updateSetting(setting.id, setting);
    }

    openSnackbar({ props: { text: "System prompt saved" } });
    await settingStore.loadTTASettings();
  } catch (error) {
    errorSnackbar(error, openSnackbar);
  }

  isLoadingTTASettings.value = false;
};
</script>

<template>
  <v-row>
    <v-col class="d-flex align-center justify-space-between" cols="12">
      <h2>System Prompt</h2>
      <div class="d-flex align-center ga-2">
        <v-btn
          color="error"
          :loading="!!isSeeding"
          prepend-icon="mdi-seed"
          variant="outlined"
          @click="seedSystemPrompt"
        >
          Seed
        </v-btn>
      </div>
    </v-col>

    <v-col class="pb-0" cols="12">
      <text-label class="text-grey d-flex ga-1">
        <span> Keywords: </span>
        <span class="text-secondary">
          {actions}
          <v-tooltip activator="parent" text="Actions will be replaced with the actual JSON list of actions" />
        </span>
      </text-label>
    </v-col>

    <v-col cols="12">
      <v-textarea
        v-model="systemPromptSetting"
        label="System prompt"
        :loading="isSeeding || isLoadingTTASettings"
        rows="25"
      />
    </v-col>

    <v-col class="d-flex align-center justify-end" cols="12">
      <v-btn color="success" prepend-icon="mdi-content-save" :loading="isLoadingTTASettings" @click="saveSystemPrompt">
        Save
      </v-btn>
    </v-col>
  </v-row>
</template>
