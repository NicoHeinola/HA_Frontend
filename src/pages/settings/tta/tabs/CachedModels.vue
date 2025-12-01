<script lang="ts" setup>
import { computed, ref } from "vue";
import TtaCachedModelsTable from "@/components/text-to-action/tta-cached-models-table/TtaCachedModelsTable.vue";
import { useConfirm } from "@/components/use-dialog/confirm/useConfirm";
import { useSnackbar } from "@/components/use-snackbar/useSnackbar";
import { TextToActionCachedModelService } from "@/services/text-to-action/TextToActionCachedModel.service";
import { TextToActionSettingService } from "@/services/text-to-action/TextToActionSetting.service";
import { useSettingStore } from "@/stores/settingStore";
import { useErrorSnackbar } from "@/utils/errorSnackbar";
import { findSettingByKey } from "@/utils/settingsHelpers";
import { TextToActionSettingKey } from "@/models/text-to-action/TextToActionSetting";

const settingStore = useSettingStore();

const defaultModelName = computed(() => {
  return findSettingByKey(settingStore.ttaSettings, TextToActionSettingKey.DefaultModel)?.value;
});

const autoCachedModelsSetting = computed(() => {
  return findSettingByKey(settingStore.ttaSettings, TextToActionSettingKey.AutoCachedModels) || { id: null, value: [] };
});

const isLoadingCachedModels = ref<boolean>(false);
const isLoadingAutoCachedModels = ref<boolean>(false);
const { errorSnackbar } = useErrorSnackbar();
const openSnackbar = useSnackbar();
const openConfirm = useConfirm();

const addAutoCachedModel = async (model: any) => {
  const ok = await openConfirm({
    props: {
      title: "Add to Auto-cache",
      text: `Are you sure you want to add "${model.name}" to auto-cache?`,
    },
  });

  if (!ok) return;

  isLoadingAutoCachedModels.value = true;

  try {
    const updatedModels = [...(autoCachedModelsSetting.value?.value || []), { name: model.name, type: "gguf" }];
    await TextToActionSettingService().updateSetting(autoCachedModelsSetting.value.id, {
      ...autoCachedModelsSetting.value,
      value: updatedModels,
    });

    openSnackbar({ props: { text: `"${model.name}" added to auto-cache` } });
    await settingStore.loadTTASettings();
  } catch (error) {
    errorSnackbar(error, openSnackbar);
  }

  isLoadingAutoCachedModels.value = false;
};

const removeAutoCachedModel = async (model: any) => {
  const ok = await openConfirm({
    props: {
      title: "Remove from Auto-cache",
      text: `Are you sure you want to remove "${model.name}" from auto-cache?`,
    },
  });

  if (!ok) return;

  isLoadingAutoCachedModels.value = true;

  try {
    const updatedModels = (autoCachedModelsSetting.value?.value || []).filter((m: any) => m.name !== model.name);
    await TextToActionSettingService().updateSetting(autoCachedModelsSetting.value.id, {
      ...autoCachedModelsSetting.value,
      value: updatedModels,
    });

    openSnackbar({ props: { text: `"${model.name}" removed from auto-cache` } });
    await settingStore.loadTTASettings();
  } catch (error) {
    errorSnackbar(error, openSnackbar);
  }

  isLoadingAutoCachedModels.value = false;
};

const seedAutoCachedModels = async () => {
  const ok = await openConfirm({
    props: {
      title: "Seed Auto-cache Settings",
      text: "Are you sure you want to seed auto-cache settings? This will overwrite existing auto-cache settings.",
    },
  });

  if (!ok) return;

  isLoadingAutoCachedModels.value = true;

  try {
    await TextToActionSettingService().seedSettings({
      replace: true,
      keys_to_seed: [TextToActionSettingKey.AutoCachedModels],
    });
    openSnackbar({ props: { text: "Auto-cache settings seeded" } });
    await settingStore.loadTTASettings();
  } catch (error) {
    errorSnackbar(error, openSnackbar);
  }

  isLoadingAutoCachedModels.value = false;
};

// --- Currently cached models functions
const deleteCachedModel = async (model: any) => {
  const ok = await openConfirm({
    props: {
      title: "Remove from Cache",
      text: `Are you sure you want to remove "${model.name}" from cache?`,
    },
  });

  if (!ok) return;

  isLoadingCachedModels.value = true;

  try {
    await TextToActionCachedModelService().deleteCachedModel(model.name);
    openSnackbar({ props: { text: `"${model.name}" removed from cache` } });
    await settingStore.loadCachedModels();
  } catch (error) {
    errorSnackbar(error, openSnackbar);
  }

  isLoadingCachedModels.value = false;
};

const cacheModel = async (model: any) => {
  const ok = await openConfirm({
    props: {
      title: "Cache Model",
      text: `Are you sure you want to cache the model "${model.name}"?`,
    },
  });

  if (!ok) return;

  isLoadingCachedModels.value = true;

  try {
    await TextToActionCachedModelService().cacheModel(model.name);
    openSnackbar({ props: { text: `Model "${model.name}" cached successfully` } });
    await settingStore.loadCachedModels();
  } catch (error) {
    errorSnackbar(error, openSnackbar);
  }

  isLoadingCachedModels.value = false;
};

const deleteCachedModels = async () => {
  const ok = await openConfirm({
    props: {
      title: "Clear Cache",
      text: "Are you sure you want to remove all models from cache?",
    },
  });

  if (!ok) return;

  isLoadingCachedModels.value = true;

  try {
    await TextToActionCachedModelService().deleteCachedModels();
    openSnackbar({ props: { text: "All models removed from cache" } });
    await settingStore.loadCachedModels();
  } catch (error) {
    errorSnackbar(error, openSnackbar);
  }

  isLoadingCachedModels.value = false;
};
</script>

<template>
  <v-row>
    <!-- Auto-cached models -->
    <v-col class="d-flex align-center justify-space-between" cols="12">
      <info-text tooltip="Models that are automatically cached when the server starts up.">
        <h2>Auto-cached Models</h2>
      </info-text>

      <div class="d-flex align-center ga-2">
        <v-menu>
          <template #activator="{ props }">
            <v-btn append-icon="mdi-chevron-down" v-bind="props" :loading="isLoadingAutoCachedModels">
              Add to Auto-cache
            </v-btn>
          </template>
          <model-list
            :models="
              settingStore.availableModels.map((modelName: string) => ({
                name: modelName,
                isDefault: modelName === defaultModelName,
                disabled: (autoCachedModelsSetting?.value || []).find((m: Record<string, any>) => m.name === modelName),
              }))
            "
            @on-model-click="addAutoCachedModel"
          />
        </v-menu>
        <v-menu>
          <template #activator="{ props }">
            <v-btn
              append-icon="mdi-chevron-down"
              v-bind="props"
              :loading="isLoadingAutoCachedModels"
              variant="outlined"
            >
              Actions
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="seedAutoCachedModels" title="Seed">
              <template #prepend>
                <v-icon size="small" color="error">mdi-seed</v-icon>
              </template>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-col>

    <v-col cols="12">
      <TtaCachedModelsTable
        id="auto-cached-models-table"
        :models="
          (autoCachedModelsSetting?.value || []).map((model: any) => ({
            name: model.name,
            isDefault: model.name === defaultModelName,
          }))
        "
        :is-loading="isLoadingAutoCachedModels || settingStore.isLoadingTTASettings"
        @delete="(modelName: string) => removeAutoCachedModel({ name: modelName })"
      />
    </v-col>

    <!-- Currently cached models -->
    <v-col class="d-flex align-center justify-space-between" cols="12">
      <info-text
        tooltip="Currently loaded models. They never unload so using them is a lot faster. However, they do take up a lot of VRAM."
      >
        <h2>Cached Models</h2>
      </info-text>
      <div class="d-flex align-center ga-2">
        <v-menu>
          <template #activator="{ props }">
            <v-btn append-icon="mdi-chevron-down" v-bind="props" :loading="isLoadingCachedModels">
              Cache a Model
            </v-btn>
          </template>
          <model-list
            :models="
              settingStore.availableModels.map((modelName: string) => ({
                name: modelName,
                isDefault: modelName === defaultModelName,
                disabled: settingStore.cachedModels.includes(modelName),
              }))
            "
            @on-model-click="cacheModel"
          />
        </v-menu>

        <v-menu>
          <template #activator="{ props }">
            <v-btn append-icon="mdi-chevron-down" v-bind="props" :loading="isLoadingCachedModels" variant="outlined">
              Actions
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="deleteCachedModels" title="Clear cache">
              <template #prepend>
                <v-icon size="small" color="error">mdi-trash-can</v-icon>
              </template>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-col>
    <v-col cols="12">
      <TtaCachedModelsTable
        id="cached-models-table"
        :models="
          settingStore.cachedModels.map((model) => ({
            name: model,
            isDefault: model === defaultModelName,
          }))
        "
        :is-loading="isLoadingCachedModels || settingStore.isLoadingCachedModels"
        @delete="(modelName: string) => deleteCachedModel({ name: modelName })"
      />
    </v-col>
  </v-row>
</template>
