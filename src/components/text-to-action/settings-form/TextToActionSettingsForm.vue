<script lang="ts" setup>
import { computed, defineModel, defineProps, onMounted, ref } from "vue";
import TextLabel from "@/components/text-label/TextLabel.vue";
import { useSettingStore } from "@/stores/settingStore";
import { rules } from "./rules";

const settingStore = useSettingStore();

const props = defineProps<{
  isLoading?: boolean
}>();

const settings = defineModel<any[]>({ required: true });
const isValid = defineModel<boolean>("isValid", { required: false, default: true });
const allRules = rules();
const formRef = ref();

const availableModels = computed(() => settingStore.availableModels);

const findSettingByKey = (settings: any[], key: string) => {
  return settings.find(s => s.key === key);
};

const updateSettingValue = (settings: any[], key: string, value: string) => {
  const setting = settings.find(s => s.key === key);
  if (!setting) return;
  setting.value = value;
};

onMounted(async () => {
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
          label="Default Model"
          :loading="props.isLoading"
          :model-value="findSettingByKey(settings, 'default_model')?.value"
          :rules="allRules['default_model']"
          @update:model-value="(update) => updateSettingValue(settings, 'default_model', update)"
        />
      </v-col>
      <v-col cols="12">
        <v-number-input
          label="Prediction Timeout (seconds)"
          :loading="props.isLoading"
          :model-value="Number(findSettingByKey(settings, 'prediction_timeout')?.value)"
          :rules="allRules['prediction_timeout']"
          @update:model-value="(update) => updateSettingValue(settings, 'prediction_timeout', String(update))"
        />
      </v-col>
      <v-col class="pb-0" cols="12">
        <text-label class="text-grey d-flex ga-1">
          <span> Keywords: </span>
          <span class="text-secondary">
            {actions}
            <v-tooltip
              activator="parent"
              text="Actions will be replaced with the actual JSON list of actions"
            />
          </span>
        </text-label>
      </v-col>
      <v-col cols="12">
        <v-textarea
          label="System prompt"
          :loading="props.isLoading"
          :model-value="findSettingByKey(settings, 'system_prompt')?.value"
          rows="25"
          @update:model-value="(update) => updateSettingValue(settings, 'system_prompt', update)"
        />
      </v-col>
    </v-row>
  </v-form>
</template>
