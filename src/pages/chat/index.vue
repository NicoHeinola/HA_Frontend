<script lang="ts" setup>
import TextLabel from "@/components/text-label/TextLabel.vue";
import { useSnackbar } from "@/components/use-snackbar/useSnackbar";
import { TextToActionService } from "@/services/text-to-action/TextToAction.service";
import { useErrorSnackbar } from "@/utils/errorSnackbar";

const availableModels = ref<string[]>([]);
const pickedModel = ref<string>("");
const chatMessage = ref<string>("");
const aiResponse = ref<Record<string, any> | null>(null);

const isSendingMessage = ref(false);
const isLoadingModels = ref(false);

const isLoading = computed(() => {
  return isSendingMessage.value || isLoadingModels.value;
});

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

  const blacklistedActions = ["just_chatting"];
  if (blacklistedActions.includes(action)) {
    return null;
  }

  return action;
});

const getAvailableModels = async () => {
  isLoadingModels.value = true;

  try {
    const models = await TextToActionService().getModels();
    availableModels.value = models["available_models"] || [];

    if (availableModels.value.length > 0) {
      pickedModel.value = availableModels.value[availableModels.value.length - 1] || "";
    } else {
      pickedModel.value = "";
    }
  } catch (error) {
    errorSnackbar(error, openSnackbar);
  } finally {
    isLoadingModels.value = false;
  }
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
  } catch (error) {
    aiResponse.value = {};
    errorSnackbar(error, openSnackbar);
    return;
  } finally {
    isSendingMessage.value = false;
  }
};

onMounted(() => {
  getAvailableModels();
});
</script>

<template>
  <div class="w-100 h-100 d-flex ga-2 align-center justify-center">
    <v-row class="justify-center">
      <v-col cols="12">
        <h1 class="text-center">Hello!</h1>
        <text-label class="text-center text-grey">I'm your AI assistant. How can I help you today?</text-label>
      </v-col>
      <v-col cols="12" class="d-flex align-center justify-center">
        <v-row style="max-width: 600px">
          <v-col cols="12">
            <v-textarea
              @keydown.enter="onEnter"
              density="comfortable"
              label="Type your message here..."
              v-model="chatMessage"
              :loading="isLoading"
              :disabled="isLoading"
            >
              <template #prepend-inner>
                <v-menu>
                  <template #activator="{ props }">
                    <v-icon v-bind="props">mdi-robot-confused</v-icon>
                  </template>
                  <v-list>
                    <v-list-item
                      v-for="(model, index) in availableModels"
                      :key="index"
                      :value="model"
                      :active="pickedModel === model"
                      @click="pickedModel = model"
                    >
                      <v-list-item-title>{{ model }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </template>
            </v-textarea>
          </v-col>
          <v-col cols="12" class="pt-0 d-flex justify-space-between align-center">
            <text-label class="text-grey-darken-3">Picked model: {{ pickedModel }}</text-label>
            <v-slide-x-reverse-transition>
              <v-btn :loading="isLoading" :disabled="isLoading" append-icon="mdi-play" v-if="aiResponseAction">
                {{ aiResponseAction }}
                <v-tooltip activator="parent">
                  <p>Details: {{ aiResponse?.["params"] }}</p>
                </v-tooltip>
              </v-btn>
            </v-slide-x-reverse-transition>
          </v-col>
          <v-col cols="12">
            <div style="height: 250px" class="overflow-y-auto">
              <text-label class="mb-2">AI Response:</text-label>
              <template v-if="!isLoading">
                <div v-for="(part, index) in aiResponseTextParts" :key="index" class="mb-2">
                  <p>{{ part }}</p>
                </div>
                <p v-if="aiResponseTextParts.length === 0">No response yet.</p>
              </template>
              <v-skeleton-loader type="paragraph@1" v-else></v-skeleton-loader>
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>
