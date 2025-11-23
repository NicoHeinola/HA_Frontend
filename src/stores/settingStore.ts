import type TextToActionSetting from '@/models/text-to-action/TextToActionSetting'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { TextToActionService } from '@/services/text-to-action/TextToAction.service'
import { TextToActionSettingService } from '@/services/text-to-action/TextToActionSetting.service'

export const useSettingStore = defineStore('settings', () => {
  const settings = ref<TextToActionSetting[]>([])
  const availableModels = ref<string[]>([])
  const isLoadingSettings = ref(false)
  const isLoadingModels = ref(false)

  const loadSettings = async () => {
    isLoadingSettings.value = true

    try {
      settings.value = await TextToActionSettingService().getSettings()
    } catch (error) {
      console.error('Failed to load settings:', error)
      settings.value = []
      throw error
    } finally {
      isLoadingSettings.value = false
    }
  }

  const loadModels = async () => {
    isLoadingModels.value = true
    try {
      const models = await TextToActionService().getModels()
      availableModels.value = models['available_models'] || []
    } catch (error) {
      console.error('Failed to load models:', error)
      availableModels.value = []
      throw error
    } finally {
      isLoadingModels.value = false
    }
  }

  const loadAll = async () => {
    await Promise.all([loadSettings(), loadModels()])
  }

  return {
    settings,
    availableModels,
    isLoadingSettings,
    isLoadingModels,
    loadSettings,
    loadModels,
    loadAll,
  }
})
