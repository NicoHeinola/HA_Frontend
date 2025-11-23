import type TextToActionAction from "@/models/text-to-action/TextToActionAction";
import type TextToActionSetting from "@/models/text-to-action/TextToActionSetting";
import { defineStore } from "pinia";
import { ref } from "vue";
import { TextToActionService } from "@/services/text-to-action/TextToAction.service";
import { TextToActionActionService } from "@/services/text-to-action/TextToActionAction.service";
import { TextToActionSettingService } from "@/services/text-to-action/TextToActionSetting.service";

export const useSettingStore = defineStore("settings", () => {
  const ttaSettings = ref<TextToActionSetting[]>([]);
  const ttaActions = ref<TextToActionAction[]>([]);
  const availableModels = ref<string[]>([]);
  const isLoadingTTASettings = ref(false);
  const isLoadingTTAActions = ref(false);
  const isLoadingModels = ref(false);

  const loadTTASettings = async () => {
    isLoadingTTASettings.value = true;

    try {
      ttaSettings.value = await TextToActionSettingService().getSettings();
    } catch (error) {
      console.error("Failed to load TTA settings:", error);
      ttaSettings.value = [];
      throw error;
    } finally {
      isLoadingTTASettings.value = false;
    }
  };

  const loadTTAActions = async () => {
    isLoadingTTAActions.value = true;

    try {
      ttaActions.value = await TextToActionActionService().getActions();
    } catch (error) {
      console.error("Failed to load TTA actions:", error);
      ttaActions.value = [];
      throw error;
    } finally {
      isLoadingTTAActions.value = false;
    }
  };

  const loadModels = async () => {
    isLoadingModels.value = true;
    try {
      const models = await TextToActionService().getModels();
      availableModels.value = models || [];
    } catch (error) {
      console.error("Failed to load models:", error);
      availableModels.value = [];
      throw error;
    } finally {
      isLoadingModels.value = false;
    }
  };

  const loadAll = async () => {
    await Promise.all([loadTTASettings(), loadTTAActions(), loadModels()]);
  };

  return {
    ttaSettings,
    ttaActions,
    availableModels,
    isLoadingTTASettings,
    isLoadingTTAActions,
    isLoadingModels,
    loadTTASettings,
    loadTTAActions,
    loadModels,
    loadAll,
  };
});
