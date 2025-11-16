<script lang="ts" setup>
import { defineModel, defineProps } from "vue";
import TextLabel from "@/components/text-label/TextLabel.vue";

const props = defineProps<{
  isLoading?: boolean;
}>();

const settings = defineModel<any[]>({ required: true });

const findSettingByKey = (settings: any[], key: string) => {
  return settings.find((s) => s.key === key);
};

const updateSettingValue = (settings: any[], key: string, value: string) => {
  const setting = settings.find((s) => s.key === key);
  if (!setting) return;
  setting.value = value;
};
</script>

<template>
  <v-form>
    <v-row>
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
