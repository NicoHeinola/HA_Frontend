<script lang="ts" setup>
import TextLabel from "@/components/text-label/TextLabel.vue";
import { useSnackbar } from "@/components/use-snackbar/useSnackbar";
import { TextToActionService } from "@/services/text-to-action/TextToAction.service";
import { useErrorSnackbar } from "@/utils/errorSnackbar";

const chatMessage = ref<string>("");
const aiResponse = ref<Record<string, any>>({});

const sendingMessage = ref(false);
const openSnackbar = useSnackbar();
const { errorSnackbar } = useErrorSnackbar();

const aiResponseTextParts = computed(() => {
  const responseText = aiResponse.value["ai_answer"] || "";

  return responseText.split("\n").filter((part: string) => part.trim() !== "");
});

const onEnter = async (event: KeyboardEvent) => {
  if (!chatMessage.value.trim()) return;

  if (event.shiftKey) return;

  event.preventDefault();

  sendingMessage.value = true;

  try {
    aiResponse.value = await TextToActionService().textToAction(chatMessage.value);

    if (!aiResponse.value) {
      throw new Error("No response from AI service");
    }
  } catch (error) {
    sendingMessage.value = false;
    errorSnackbar(error, openSnackbar);
    return;
  } finally {
    sendingMessage.value = false;
  }

  chatMessage.value = "";
};
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
              :loading="sendingMessage"
              :disabled="sendingMessage"
            >
              <template #prepend-inner>
                <v-icon>mdi-chat-outline</v-icon>
              </template>
            </v-textarea>
          </v-col>
          <v-col cols="12">
            <div style="height: 250px" class="overflow-y-auto">
              <text-label class="mb-2">AI Response:</text-label>
              <template v-if="!sendingMessage">
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
