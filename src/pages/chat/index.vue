<script lang="ts" setup>
import type TextToActionAction from "@/models/text-to-action/TextToActionAction";
import TextLabel from "@/components/text-label/TextLabel.vue";
import { useSnackbar } from "@/components/use-snackbar/useSnackbar";
import { BackendService } from "@/services/backend/TextToAction.service";
import { TextToActionService } from "@/services/text-to-action/TextToAction.service";
import { TextToActionActionService } from "@/services/text-to-action/TextToActionAction.service";
import { useSettingStore } from "@/stores/settingStore";
import { useErrorSnackbar } from "@/utils/errorSnackbar";

const settingStore = useSettingStore();
const pickedModel = ref<string>("");
const chatMessage = ref<string>("");
const aiResponse = ref<Record<string, any> | null>(null);

// List of all valid actions that the AI can suggest
const allActions = ref<TextToActionAction[]>([]);

const isSendingMessage = ref(false);
const isLoadingActions = ref(false);

const isPlaybackEnabled = ref(false);

const isLoading = computed(() => {
  return isSendingMessage.value || isLoadingActions.value;
});

const availableModels = computed(() => settingStore.availableModels);

const openSnackbar = useSnackbar();
const { errorSnackbar } = useErrorSnackbar();

const aiResponseTextParts = computed(() => {
  const responseText = aiResponse.value?.["ai_answer"] || "";

  if (!responseText && aiResponse.value) return ["AI didn't provide an answer."];
  else if (!responseText && !aiResponse.value) return ["Send a message to get a response."];

  return responseText.split("\n").filter((part: string) => part.trim() !== "");
});

const aiResponseAction = computed(() => {
  const action = aiResponse.value?.["action"] || null;

  const isValidAction = allActions.value.find(a => a.name === action);
  if (!isValidAction) return null;

  return action;
});

const getTextToActionActions = async () => {
  isLoadingActions.value = true;
  try {
    allActions.value = await TextToActionActionService().getActions();
  } catch (error) {
    errorSnackbar(error, openSnackbar);
    allActions.value = [];
  }
  isLoadingActions.value = false;
};

const onEnter = async (event: KeyboardEvent) => {
  if (!chatMessage.value.trim()) return;

  if (event.shiftKey) return;

  event.preventDefault();

  isSendingMessage.value = true;

  try {
    const response = await TextToActionService().textToAction(chatMessage.value, {
      model: pickedModel.value,
    });

    aiResponse.value = response;

    if (response && Object.keys(response).length > 0) {
      chatMessage.value = "";
    }

    await nextTick();

    playbackAIAnswer();
  } catch (error) {
    aiResponse.value = {};
    errorSnackbar(error, openSnackbar);
    return;
  } finally {
    isSendingMessage.value = false;
  }
};

const playbackAIAnswer = async () => {
  if (!aiResponse.value) return;

  // Playback AI answer if enabled
  const aiAnswer = aiResponse.value["ai_answer"];
  if (aiAnswer && isPlaybackEnabled.value) {
    try {
      await BackendService().playbackAnswer(aiResponse.value["ai_answer"]);
      openSnackbar({ props: { text: "Action was performed successfully" } });
    } catch {}
  }
};

const onPressRunAction = async () => {
  if (!aiResponse.value) return;

  // Run the action
  try {
    await BackendService().runAction(aiResponse.value["action"], aiResponse.value["params"] || {});
    openSnackbar({ props: { text: "Action was performed successfully" } });
  } catch (error) {
    errorSnackbar(error, openSnackbar);
    return;
  }
};

onMounted(() => {
  // Set initial picked model from store
  if (availableModels.value.length > 0) {
    pickedModel.value = availableModels.value.at(-1) || "";
  }

  getTextToActionActions();
});
</script>

<template>
  <div class="w-100 h-100 d-flex ga-2 align-center justify-center">
    <v-row class="justify-center">
      <v-col cols="12">
        <h1 class="text-center">Hello!</h1>
        <text-label class="text-center text-grey">I'm your AI assistant. How can I help you today?</text-label>
      </v-col>
      <v-col class="d-flex align-center justify-center" cols="12">
        <v-row style="max-width: 600px">
          <v-col cols="12">
            <v-textarea
              v-model="chatMessage"
              density="comfortable"
              :disabled="isLoading"
              label="Type your message here..."
              :loading="isLoading"
              @keydown.enter="onEnter"
            >
              <template #prepend-inner>
                <div class="d-flex flex-column align-center">
                  <v-menu>
                    <template #activator="{ props }">
                      <v-icon v-bind="props">mdi-robot-confused</v-icon>
                    </template>
                    <v-list>
                      <v-list-item
                        v-for="(model, index) in availableModels"
                        :key="index"
                        :active="pickedModel === model"
                        :value="model"
                        @click="pickedModel = model"
                      >
                        <v-list-item-title>{{ model }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                  <v-icon
                    :aria-pressed="isPlaybackEnabled"
                    class="mt-1"
                    :color="isPlaybackEnabled ? 'primary' : 'grey'"
                    style="cursor: pointer"
                    title="Toggle AI answer playback"
                    @click="isPlaybackEnabled = !isPlaybackEnabled"
                  >
                    {{ isPlaybackEnabled ? "mdi-headphones" : "mdi-headphones-off" }}
                  </v-icon>
                </div>
              </template>
            </v-textarea>
          </v-col>
          <v-col class="pt-0 d-flex justify-space-between align-center" cols="12">
            <text-label class="text-grey-darken-3">Picked model: {{ pickedModel }}</text-label>
            <v-slide-x-reverse-transition>
              <v-btn
                v-if="aiResponseAction"
                append-icon="mdi-play"
                :disabled="isLoading"
                :loading="isLoading"
                @click="onPressRunAction"
              >
                {{ aiResponseAction }}
                <v-tooltip activator="parent">
                  <p>Details: {{ aiResponse?.["params"] }}</p>
                </v-tooltip>
              </v-btn>
            </v-slide-x-reverse-transition>
          </v-col>
          <v-col cols="12">
            <div class="overflow-y-auto" style="height: 250px">
              <text-label class="mb-2">AI Response:</text-label>
              <template v-if="!isLoading">
                <div v-for="(part, index) in aiResponseTextParts" :key="index" class="mb-2">
                  <p>{{ part }}</p>
                </div>
                <p v-if="aiResponseTextParts.length === 0">No response yet.</p>
              </template>
              <v-skeleton-loader v-else type="paragraph@1" />
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>
