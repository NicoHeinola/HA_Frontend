<script lang="ts" setup>
import { ref, onMounted, watch } from "vue";
import type TextToActionSetting from "@/models/text-to-action/TextToActionSetting";
import { TextToActionSettingType } from "@/models/text-to-action/TextToActionSetting";
import { TextToActionSettingService } from "@/services/text-to-action/TextToActionSetting.service";
import { useSnackbar } from "@/components/use-snackbar/useSnackbar";
import { useErrorSnackbar } from "@/utils/errorSnackbar";
import { useConfirm } from "@/components/use-dialog/confirm/useConfirm";

const texttoactionsettings = ref<TextToActionSetting[]>([]);
const loading = ref(false);
const openSnackbar = useSnackbar();
const { errorSnackbar } = useErrorSnackbar();

const newTextToActionSetting = ref<TextToActionSetting>({
  key: "",
  value: "",
  type: TextToActionSettingType.String,
});

const dialogOpen = ref(false);

const openConfirm = useConfirm();

const seeding = ref<Boolean>(false);

const getTextToActionSettings = async () => {
  loading.value = true;
  try {
    texttoactionsettings.value = await TextToActionSettingService().getSettings();
  } catch (error) {
    errorSnackbar(error, openSnackbar);
    texttoactionsettings.value = [];
  }
  loading.value = false;
};

const resetNewTextToActionSetting = () => {
  newTextToActionSetting.value = { key: "", value: "", type: TextToActionSettingType.String };
};

const seedTextToActionSettings = async () => {
  const ok = await openConfirm({
    props: {
      title: "Seed TTA Settings",
      text: "Are you sure you want to seed TTA settings? This will overwrite existing TTA settings.",
    },
  });

  if (!ok) return;

  seeding.value = true;

  try {
    await TextToActionSettingService().seedSettings({ replace: true });
    openSnackbar({ props: { text: "TTA Settings seeded" } });
    await getTextToActionSettings();
  } catch (error) {
    errorSnackbar(error, openSnackbar);
  }

  seeding.value = false;
};

onMounted(getTextToActionSettings);

watch(dialogOpen, (val) => {
  if (!val) resetNewTextToActionSetting();
});
</script>

<template>
  <v-container class="pa-12">
    <v-row>
      <v-col class="d-flex align-center justify-space-between">
        <h1 class="text-h4">TTA Settings</h1>
        <div class="d-flex align-center ga-2">
          <v-btn color="error" prepend-icon="mdi-seed" @click="seedTextToActionSettings" :loading="!!seeding"
            >Seed TTA Settings</v-btn
          >
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12"> </v-col>
    </v-row>
  </v-container>
</template>
