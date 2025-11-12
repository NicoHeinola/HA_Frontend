<script lang="ts" setup>
import { ref, onMounted, watch } from "vue";
import type Setting from "@/models/setting";
import { SettingType } from "@/models/setting";
import { SettingService } from "@/services/setting.service";
import { useSnackbar } from "@/components/use-snackbar/useSnackbar";
import { useErrorSnackbar } from "@/utils/errorSnackbar";
import { useConfirm } from "@/components/use-dialog/confirm/useConfirm";

const settings = ref<Setting[]>([]);
const loading = ref(false);
const openSnackbar = useSnackbar();
const { errorSnackbar } = useErrorSnackbar();

const newSetting = ref<Setting>({
  key: "",
  value: "",
  type: SettingType.String,
});

const dialogOpen = ref(false);

const openConfirm = useConfirm();

const seeding = ref<Boolean>(false);
const cleaningShowsUp = ref<Boolean>(false);
const deleting = ref<Boolean>(false);

const getSettings = async () => {
  loading.value = true;
  try {
    settings.value = await SettingService().getSettings();
  } catch (error) {
    errorSnackbar(error, openSnackbar);
    settings.value = [];
  }
  loading.value = false;
};

const editSetting = (setting: Setting) => {
  newSetting.value = { ...setting };
  dialogOpen.value = true;
};

const deleteSetting = async (id: number) => {
  const ok = await openConfirm({
    props: {
      title: "Delete Setting",
      text: "Are you sure you want to delete this setting?",
    },
  });

  if (!ok) return;

  deleting.value = true;

  try {
    await SettingService().deleteSetting(id);
    openSnackbar({ props: { text: "Setting deleted" } });
    await getSettings();
  } catch (error) {
    errorSnackbar(error, openSnackbar);
  }

  deleting.value = false;
};

const resetNewSetting = () => {
  newSetting.value = { key: "", value: "", type: SettingType.String };
};

const seedSettings = async () => {
  const ok = await openConfirm({
    props: {
      title: "Seed Settings",
      text: "Are you sure you want to seed settings? This will overwrite existing settings.",
    },
  });

  if (!ok) return;

  seeding.value = true;

  try {
    await SettingService().seedSettings({ replace: true });
    openSnackbar({ props: { text: "Settings seeded" } });
    await getSettings();
  } catch (error) {
    errorSnackbar(error, openSnackbar);
  }

  seeding.value = false;
};

onMounted(getSettings);

watch(dialogOpen, (val) => {
  if (!val) resetNewSetting();
});
</script>

<template>
  <v-container class="pa-12">
    <v-row>
      <v-col class="d-flex align-center justify-space-between">
        <h1 class="text-h4">Settings</h1>
        <div class="d-flex align-center ga-2">
          <v-btn color="error" prepend-icon="mdi-seed" @click="seedSettings" :loading="!!seeding">Seed Settings</v-btn>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12"> </v-col>
    </v-row>
  </v-container>
</template>
