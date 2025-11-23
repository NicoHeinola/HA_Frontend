<script lang="ts" setup>
import type TextToActionAction from "@/models/text-to-action/TextToActionAction";
import { useConfirm } from "@/components/use-dialog/confirm/useConfirm";
import { useDialog } from "@/components/use-dialog/useDialog";
import { useSnackbar } from "@/components/use-snackbar/useSnackbar";
import { TextToActionActionService } from "@/services/text-to-action/TextToActionAction.service";
import { useErrorSnackbar } from "@/utils/errorSnackbar";
import TextToActionActionDialog from "../action-dialog/TextToActionActionDialog.vue";

const emit = defineEmits<{
  (e: "delete", payload: TextToActionAction): void
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

const exportAction = async () => {
  // Copy data to clipboard
  const dataStr = JSON.stringify(action.value, null, 2);

  await navigator.clipboard.writeText(dataStr);

  openSnackbar({ props: { text: "Action data copied to clipboard" } });
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
  <v-card class="d-flex flex-column" height="300px">
    <v-card-title class="d-flex justify-space-between align-center">
      <p class="text-truncate">
        {{ action.name || "Unnamed Action" }}
      </p>
      <div class="d-flex align-center ga-2">
        <v-btn
          icon="mdi-pencil"
          :loading="loading"
          size="x-small"
          variant="text"
          @click="openEditDialog"
        />
        <v-menu>
          <template #activator="{ props }">
            <v-btn
              color="white"
              icon="mdi-dots-vertical"
              v-bind="props"
              :loading="loading"
              size="x-small"
              variant="text"
            />
          </template>
          <v-list>
            <v-list-item @click="exportAction">
              <template #prepend>
                <v-icon>mdi-download</v-icon>
              </template>
              <v-list-item-title>Export</v-list-item-title>
            </v-list-item>
            <v-list-item @click="deleteAction">
              <template #prepend>
                <v-icon color="error">mdi-trash-can</v-icon>
              </template>
              <v-list-item-title>Delete</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-card-title>
    <v-card-text style="flex: 1 1 auto; display: flex; flex-direction: column; min-height: 0">
      <div class="mb-5" style="flex: 1 1 auto; min-height: 0; overflow: auto">
        <p>
          {{ getShortenedText(action.description || "No description", 300) }}
          <v-tooltip activator="parent" :text="getShortenedText(action.description, 500)" />
        </p>
      </div>
      <div v-if="action.meta" style="flex: 0 0 150px; height: 150px; min-height: 150px; max-height: 150px">
        <code-block class="h-100">{{ action.meta }}</code-block>
      </div>
    </v-card-text>
  </v-card>
</template>
