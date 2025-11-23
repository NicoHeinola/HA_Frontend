<script lang="ts" setup>
import { ref } from "vue";
import TtaCachedModelsTable from "@/components/text-to-action/tta-cached-models-table/TtaCachedModelsTable.vue";
import { useConfirm } from "@/components/use-dialog/confirm/useConfirm";
import { useSnackbar } from "@/components/use-snackbar/useSnackbar";
import { TextToActionCachedModelService } from "@/services/text-to-action/TextToActionCachedModel.service";
import { useSettingStore } from "@/stores/settingStore";
import { useErrorSnackbar } from "@/utils/errorSnackbar";

const settingStore = useSettingStore();

const isLoadingCachedModels = ref<boolean>(false);
const { errorSnackbar } = useErrorSnackbar();
const openSnackbar = useSnackbar();
const openConfirm = useConfirm();

const deleteCachedModel = async (modelName: string) => {
  const ok = await openConfirm({
    props: {
      title: "Delete Cached Model",
      text: `Are you sure you want to delete the cached model "${modelName}"?`,
    },
  });

  if (!ok) return;

  isLoadingCachedModels.value = true;

  try {
    await TextToActionCachedModelService().deleteCachedModel(modelName);
    openSnackbar({ props: { text: `Cached model "${modelName}" deleted` } });
    await settingStore.loadCachedModels();
  } catch (error) {
    errorSnackbar(error, openSnackbar);
  }

  isLoadingCachedModels.value = false;
};

const cacheModel = async (modelName: string) => {
  isLoadingCachedModels.value = true;

  try {
    await TextToActionCachedModelService().cacheModel(modelName);
    openSnackbar({ props: { text: `Model "${modelName}" cached successfully` } });
    await settingStore.loadCachedModels();
  } catch (error) {
    errorSnackbar(error, openSnackbar);
  }

  isLoadingCachedModels.value = false;
};

const deleteCachedModels = async () => {
  const ok = await openConfirm({
    props: {
      title: "Delete All Cached Models",
      text: "Are you sure you want to delete all cached models? This action cannot be undone.",
    },
  });

  if (!ok) return;

  isLoadingCachedModels.value = true;

  try {
    await TextToActionCachedModelService().deleteCachedModels();
    openSnackbar({ props: { text: "All cached models deleted" } });
    await settingStore.loadCachedModels();
  } catch (error) {
    errorSnackbar(error, openSnackbar);
  }

  isLoadingCachedModels.value = false;
};
</script>

<template>
  <v-row>
    <v-col class="d-flex align-center justify-space-between" cols="12">
      <h2>Cached Models</h2>
      <div class="d-flex align-center ga-2">
        <v-menu>
          <template #activator="{ props }">
            <v-btn append-icon="mdi-chevron-down" v-bind="props" :loading="isLoadingCachedModels">
              Cache a Model
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="model in settingStore.availableModels"
              :key="model"
              :disabled="settingStore.cachedModels.includes(model)"
              @click="cacheModel(model)"
            >
              <v-list-item-title>{{ model }}</v-list-item-title>
            </v-list-item>
            <v-list-item v-if="settingStore.availableModels.length === 0" disabled>
              <v-list-item-title class="text-disabled">No models available</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        <v-menu>
          <template #activator="{ props }">
            <v-btn append-icon="mdi-chevron-down" v-bind="props" :loading="isLoadingCachedModels" variant="outlined">
              Actions
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="deleteCachedModels" title="Delete All">
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
        :models="settingStore.cachedModels"
        :is-loading="isLoadingCachedModels || settingStore.isLoadingCachedModels"
        @delete="deleteCachedModel"
      />
    </v-col>
  </v-row>
</template>
