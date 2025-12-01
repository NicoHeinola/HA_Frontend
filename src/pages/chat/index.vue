<script lang="ts" setup>
import { useDisplay } from "vuetify";
import TextLabel from "@/components/text-label/TextLabel.vue";
import { useSnackbar } from "@/components/use-snackbar/useSnackbar";
import { BackendService } from "@/services/backend/TextToAction.service";
import { TextToActionService } from "@/services/text-to-action/TextToAction.service";
import { useSettingStore } from "@/stores/settingStore";
import { useErrorSnackbar } from "@/utils/errorSnackbar";
import { findSettingByKey } from "@/utils/settingsHelpers";
import { TextToActionSettingKey } from "@/models/text-to-action/TextToActionSetting";

const settingStore = useSettingStore();

const selectedModel = ref<string>("");
const chatMessage = ref<string>("");

const sentChatMessages = ref<string[]>([]);
const aiResponses = ref<Record<string, any>[]>([]);

const isSendingMessage = ref(false);
const isPlaybackEnabled = ref(false);
const runningAction = ref(false);

const display = useDisplay();

const isLoading = computed(() => {
  return isSendingMessage.value || settingStore.isLoadingTTAActions;
});

const width = computed(() => {
  if (display.xs.value) {
    return "100%";
  } else if (display.sm.value) {
    return "90%";
  } else if (display.md.value) {
    return "700px";
  }

  return "800px";
});

const openSnackbar = useSnackbar();
const { errorSnackbar } = useErrorSnackbar();

const getAIResponseTextParts = (AIResponse: Record<string, any> | null | undefined) => {
  const responseText = AIResponse?.["ai_answer"] || "";

  if (!responseText) return ["AI didn't provide an answer."];
  else if (!responseText) return ["Send a message to get a response."];

  return responseText.split("\n").filter((part: string) => part.trim() !== "");
};

const getAIResponseAction = (AIResponse: Record<string, any> | null) => {
  const action = AIResponse?.["action"] || null;

  const isValidAction = settingStore.ttaActions.find((a) => a.name === action);
  if (!isValidAction) return null;

  const blacklistedActions = ["do_nothing", "ask_question", "answer_question"];
  if (blacklistedActions.includes(action)) return null;

  return action;
};

const onEnter = async (event: KeyboardEvent) => {
  if (!chatMessage.value.trim()) return;

  if (event.shiftKey) return;

  event.preventDefault();

  isSendingMessage.value = true;
  sentChatMessages.value.push(chatMessage.value);

  try {
    const response = await TextToActionService().textToAction(chatMessage.value, {
      model: selectedModel.value,
    });

    aiResponses.value.push(response);

    if (response && Object.keys(response).length > 0) {
      chatMessage.value = "";
    }

    await nextTick();

    playbackAIAnswer();
  } catch (error) {
    errorSnackbar(error, openSnackbar);
    sentChatMessages.value.pop();
    return;
  } finally {
    isSendingMessage.value = false;
  }
};

const playbackAIAnswer = async () => {
  if (aiResponses.value.length === 0) return;

  // Playback AI answer if enabled
  const aiAnswer = aiResponses.value[aiResponses.value?.length - 1]?.["ai_answer"];
  if (aiAnswer && isPlaybackEnabled.value) {
    try {
      await BackendService().playbackAnswer(aiAnswer);
      openSnackbar({ props: { text: "Action was performed successfully" } });
    } catch {}
  }
};

const runActionFromAIResponse = async (aiResponse: Record<string, any>) => {
  const action = getAIResponseAction(aiResponse);
  if (!action) return;

  runningAction.value = true;

  // Run the action
  try {
    await BackendService().runAction(action, aiResponse["params"] || {});
    openSnackbar({ props: { text: "Action was performed successfully" } });
  } catch (error) {
    errorSnackbar(error, openSnackbar);
    return;
  } finally {
    runningAction.value = false;
  }
};

watch(
  () => settingStore.ttaSettings,
  (newSettings) => {
    const defaultModel = findSettingByKey(newSettings, TextToActionSettingKey.DefaultModel)?.value as string;
    if (defaultModel) {
      selectedModel.value = defaultModel;
    }
  },
  { immediate: true },
);
</script>

<template>
  <v-container
    class="d-flex align-space-between align-center flex-column px-0 overflow-y-hidden"
    height="100vh"
    max-height="100vh"
  >
    <v-row class="pt-10 w-100 flex-0-1-100 d-flex align-center justify-center overflow-y-auto">
      <v-col cols="12" class="d-flex h-100" :style="{ width, maxWidth: width }">
        <!-- Welcome message -->
        <v-row class="flex-1-1-100 d-flex align-center" v-if="sentChatMessages.length === 0">
          <v-col cols="12">
            <h1 class="text-center">Hello!</h1>
            <text-label class="text-center text-grey">I'm your AI assistant. How can I help you today?</text-label>
          </v-col>
        </v-row>

        <!-- Message history -->
        <v-row class="flex-column flex-1-1-100 flex-sm-nowrap pb-10" v-else>
          <v-slide-x-reverse-transition group>
            <v-col cols="12" class="flex-0-0" v-for="(message, index) in sentChatMessages" :key="index">
              <v-row>
                <v-col cols="12" class="d-flex align-center justify-end">
                  <v-card style="width: min-content" class="text-break">
                    <v-card-text>
                      <p class="text-truncate">{{ message }}</p>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
              <v-row v-if="aiResponses.length > index && aiResponses[index]">
                <v-col cols="12" class="d-flex flex-column align-start ga-2">
                  <div>
                    <p v-for="(part, partIndex) in getAIResponseTextParts(aiResponses[index])" :key="partIndex">
                      {{ part }}
                    </p>
                  </div>
                  <v-btn
                    v-if="getAIResponseAction(aiResponses[index])"
                    append-icon="mdi-play"
                    :loading="runningAction"
                    variant="outlined"
                    @click="runActionFromAIResponse(aiResponses[index])"
                  >
                    {{ getAIResponseAction(aiResponses[index]) }}
                    <v-tooltip activator="parent" v-if="aiResponses[index]?.['params']">
                      <p>Details: {{ aiResponses[index]?.["params"] }}</p>
                    </v-tooltip>
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-slide-x-reverse-transition>
          <template v-if="isLoading">
            <v-col cols="12" class="flex-0-0 py-0" style="height: min-content">
              <v-skeleton-loader type="text@1" />
            </v-col>
          </template>
        </v-row>
      </v-col>
    </v-row>

    <!-- Chat input box -->
    <v-row class="flex-0-1 d-flex justify-center align-center w-100" cols="12">
      <v-col cols="12" class="d-flex flex-column ga-2" :style="{ width, maxWidth: width }">
        <v-textarea
          v-model="chatMessage"
          density="comfortable"
          :disabled="isLoading"
          label="Type your message here..."
          :loading="isLoading"
          @keydown.enter="onEnter"
        >
          <template #prepend-inner>
            <div class="d-flex flex-column align-center ga-2">
              <v-menu>
                <template #activator="{ props }">
                  <v-icon v-bind="props">mdi-robot</v-icon>
                </template>
                <v-list>
                  <v-list-item
                    v-for="(model, index) in settingStore.availableModels"
                    :key="index"
                    :active="selectedModel === model"
                    :value="model"
                    @click="selectedModel = model"
                  >
                    <v-list-item-title>{{ model }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
              <v-icon
                :aria-pressed="isPlaybackEnabled"
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
        <text-label class="text-grey-darken-3">Selected model: {{ selectedModel }}</text-label>
      </v-col>
    </v-row>
  </v-container>
</template>
