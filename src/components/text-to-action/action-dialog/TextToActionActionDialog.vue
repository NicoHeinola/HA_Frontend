<script lang="ts" setup>
import type TextToActionAction from "@/models/text-to-action/TextToActionAction";
import { useSnackbar } from "@/components/use-snackbar/useSnackbar";
import { TextToActionActionService } from "@/services/text-to-action/TextToActionAction.service";
import { useErrorSnackbar } from "@/utils/errorSnackbar";

const props = defineProps<{
  action?: TextToActionAction;
}>();

const emit = defineEmits<{
  (e: "resolve", payload: TextToActionAction | false): void;
}>();

const action = ref<TextToActionAction>(
  props.action || {
    meta: {
      params: {
        param1: {
          name: "INSERT_NAME",
          description: "INSERT_DESCRIPTION",
          allowed_values: ["VALUE_1", "VALUE_2"],
        },
      },
    },
  },
);

const isValid = ref(false);
const isLoading = ref(false);
const openSnackbar = useSnackbar();
const { errorSnackbar } = useErrorSnackbar();

const save = async () => {
  if (!isValid.value) return;

  isLoading.value = true;

  try {
    action.value = await (action.value.id
      ? TextToActionActionService().updateAction(action.value.id, action.value)
      : TextToActionActionService().createAction(action.value));

    openSnackbar({ props: { text: "Action saved successfully" } });

    emit("resolve", action.value);
  } catch (error) {
    errorSnackbar(error, openSnackbar);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <v-card>
    <v-card-title>{{ action.id ? "Edit" : "New" }} Action </v-card-title>
    <v-card-text>
      <text-to-action-action-form v-model="action" v-model:is-valid="isValid" :is-loading="isLoading" />
    </v-card-text>
    <v-card-actions class="d-flex justify-end">
      <v-btn color="error" variant="outlined" @click="emit('resolve', false)">Cancel</v-btn>
      <v-btn
        color="success"
        :disabled="!isValid"
        variant="elevated"
        prepend-icon="mdi-content-save"
        @click="save"
      >
        Save
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
