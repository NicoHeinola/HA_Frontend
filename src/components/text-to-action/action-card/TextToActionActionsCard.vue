<script lang="ts" setup>
import { useDialog } from "@/components/use-dialog/useDialog";
import type TextToActionAction from "@/models/text-to-action/TextToActionAction";
import TextToActionActionDialog from "../action-dialog/TextToActionActionDialog.vue";
import { TextToActionActionService } from "@/services/text-to-action/TextToActionAction.service";
import { useErrorSnackbar } from "@/utils/errorSnackbar";
import { useSnackbar } from "@/components/use-snackbar/useSnackbar";
import { useConfirm } from "@/components/use-dialog/confirm/useConfirm";

const emit = defineEmits<{
  (e: "delete", payload: TextToActionAction): void;
}>();

const action = defineModel<TextToActionAction>({ required: true });
const openDialog = useDialog();
const openSnackbar = useSnackbar();
const openConfirm = useConfirm();
const { errorSnackbar } = useErrorSnackbar();

const loading = ref(false);

const getShortenedText = (text: any, maxLength: number) => {
  if (!text) return "";

  if (text.length > maxLength) {
    return text.slice(0, maxLength) + "...";
  }

  return text;
};

const openEditDialog = async () => {
  const editedAction = await openDialog({
    component: TextToActionActionDialog,
    props: {
      action: JSON.parse(JSON.stringify(action.value)),
    },
  });

  if (!editedAction) return;

  action.value = editedAction;
};

const deleteAction = async () => {
  const ok = await openConfirm({
    props: {
      title: "Delete Action",
      text: `Are you sure you want to delete the action "${
        action.value.name || "Unnamed Action"
      }"? This action cannot be undone.`,
    },
  });

  if (!ok) return;

  loading.value = true;

  try {
    await TextToActionActionService().deleteAction(action.value.id!);

    openSnackbar({ props: { text: "Action deleted successfully" } });

    emit("delete", action.value);
  } catch (error) {
    errorSnackbar(error, openSnackbar);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <v-card height="300px" class="d-flex flex-column">
    <v-card-title class="d-flex justify-space-between align-center">
      <p class="text-truncate">
        {{ action.name || "Unnamed Action" }}
      </p>
      <div class="d-flex align-center ga-2">
        <v-btn variant="text" icon="mdi-pencil" size="x-small" @click="openEditDialog" :loading="loading"> </v-btn>
        <v-btn
          color="error"
          variant="text"
          icon="mdi-trash-can"
          size="x-small"
          @click="deleteAction"
          :loading="loading"
        >
        </v-btn>
      </div>
    </v-card-title>
    <v-card-text style="flex: 1 1 auto; display: flex; flex-direction: column; min-height: 0">
      <div style="flex: 1 1 auto; min-height: 0; overflow: auto" class="mb-5">
        <p>
          {{ getShortenedText(action.description || "No description", 300) }}
          <v-tooltip :text="getShortenedText(action.description, 500)" activator="parent"></v-tooltip>
        </p>
      </div>
      <div style="flex: 0 0 150px; height: 150px; min-height: 150px; max-height: 150px" v-if="action.meta">
        <code-block class="h-100">{{ action.meta }}</code-block>
      </div>
    </v-card-text>
  </v-card>
</template>
