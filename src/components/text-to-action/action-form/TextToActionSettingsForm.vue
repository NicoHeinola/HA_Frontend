<script lang="ts" setup>
import { defineModel, defineProps } from "vue";
import TextLabel from "@/components/text-label/TextLabel.vue";
import { useConfirm } from "@/components/use-dialog/confirm/useConfirm";
import { TextToActionSettingService } from "@/services/text-to-action/TextToActionSetting.service";
import { useSnackbar } from "@/components/use-snackbar/useSnackbar";
import { useErrorSnackbar } from "@/utils/errorSnackbar";

const props = defineProps<{
  isLoading?: boolean;
}>();

const emit = defineEmits<{
  (e: "seeded"): void;
}>();

const settings = defineModel<any[]>("settings", { required: true });
const openConfirm = useConfirm();

const isSeeding = ref(false);
const openSnackbar = useSnackbar();
const { errorSnackbar } = useErrorSnackbar();

const findSettingByKey = (settings: any[], key: string) => {
  return settings.find((s) => s.key === key);
};

const updateSettingValue = (settings: any[], key: string, value: string) => {
  const setting = settings.find((s) => s.key === key);
  if (!setting) return;
  setting.value = value;
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
    emit("seeded");
  } catch (error) {
    errorSnackbar(error, openSnackbar);
  }

  isSeeding.value = false;
};
</script>

<template>
  <v-row>
    <v-col cols="12" class="d-flex align-center justify-space-between">
      <h2>General</h2>
      <div class="d-flex align-center ga-2">
        <v-btn color="error" prepend-icon="mdi-seed" @click="seedTextToActionSettings" :isLoading="!!isSeeding">
          Seed
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
        :model-value="findSettingByKey(settings, 'system_prompt')?.value"
        @update:model-value="(update) => updateSettingValue(settings, 'system_prompt', update)"
        :loading="props.isLoading"
        label="System prompt"
        rows="25"
      ></v-textarea>
    </v-col>
  </v-row>
  <v-row>
    <v-col class="d-flex align-center justify-space-between">
      <h2>Actions</h2>
    </v-col>
  </v-row>
</template>
