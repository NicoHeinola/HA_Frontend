<script lang="ts" setup>
import { defineModel, defineProps } from "vue";
import TextLabel from "@/components/text-label/TextLabel.vue";
import { rules } from "./rules";
import { TextToActionService } from "@/services/text-to-action/TextToAction.service";
import { useErrorSnackbar } from "@/utils/errorSnackbar";
import { useSnackbar } from "@/components/use-snackbar/useSnackbar";

const props = defineProps<{
  isLoading?: boolean;
}>();

const availableModels = ref<string[]>([]);
const isLoadingModels = ref<boolean>(false);

const settings = defineModel<any[]>({ required: true });
const isValid = defineModel<boolean>("isValid", { required: false, default: true });
const allRules = rules();
const formRef = ref();

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

const getAvailableModels = async () => {
  isLoadingModels.value = true;

  try {
    const models = await TextToActionService().getModels();
    availableModels.value = models["available_models"] || [];
  } catch (error) {
    errorSnackbar(error, openSnackbar);
  } finally {
    isLoadingModels.value = false;
  }
};

onMounted(async () => {
  await getAvailableModels();

  const isFormValid = (await formRef.value?.validate()) ?? true;

  isValid.value = isFormValid.valid;
});
</script>

<template>
  <v-form ref="formRef" v-model="isValid">
    <v-row>
      <v-col cols="12">
        <v-select
          :items="availableModels"
          :model-value="findSettingByKey(settings, 'default_model')?.value"
          :loading="isLoadingModels || props.isLoading"
          label="Default Model"
          @update:model-value="(update) => updateSettingValue(settings, 'default_model', update)"
          :rules="allRules['default_model']"
        ></v-select>
      </v-col>
      <v-col cols="12">
        <v-number-input
          :model-value="Number(findSettingByKey(settings, 'prediction_timeout')?.value)"
          :loading="props.isLoading"
          label="Prediction Timeout (seconds)"
          @update:model-value="(update) => updateSettingValue(settings, 'prediction_timeout', String(update))"
          :rules="allRules['prediction_timeout']"
        ></v-number-input>
      </v-col>
      <v-col cols="12" class="pb-0">
        <text-label class="text-grey d-flex ga-1">
          <span> Keywords: </span>
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
  </v-form>
</template>
