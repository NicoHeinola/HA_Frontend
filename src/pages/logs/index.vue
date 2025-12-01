<script lang="ts" setup>
import { LogService } from "@/services/log/log.service";
import { useErrorSnackbar } from "@/utils/errorSnackbar";
import { useSnackbar } from "@/components/use-snackbar/useSnackbar";

const logs = ref<Array<string>>([]);
const isLoading = ref<boolean>(false);

const openSnackbar = useSnackbar();
const { errorSnackbar } = useErrorSnackbar();

const logServices = ref({
  tta: { value: "tta", fn: LogService().getTextToActionLogs, title: "TTA Logs" },
});
const selectedLogService = ref(logServices.value.tta);

const fetchLogs = async () => {
  isLoading.value = true;
  try {
    const response = await LogService().getTextToActionLogs();
    logs.value = response
      .toSorted((a: any, b: any) => b.timestamp.localeCompare(a.timestamp))
      .map((log: any) => `${log.timestamp} [${log.level}]:\t${log.message}`.trim());
  } catch (error) {
    errorSnackbar(error, openSnackbar);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchLogs();
});
</script>

<template>
  <v-container class="d-flex flex-column pa-12 overflow-hidden" style="height: 100vh">
    <v-row class="flex-0-0">
      <v-col class="d-flex align-center justify-space-between" cols="12">
        <h1>Logs</h1>
        <div class="d-flex ga-2 align-center">
          <v-select label="Log Type" :items="Object.values(logServices)" v-model="selectedLogService" return-object />
          <v-btn color="primary" @click="fetchLogs" :loading="isLoading"> Refresh Logs </v-btn>
        </div>
      </v-col>
    </v-row>

    <v-row class="d-flex overflow-hidden">
      <v-col cols="12" v-if="isLoading">
        <v-skeleton-loader type="paragraph" />
      </v-col>
      <v-col cols="12" class="h-100 w-100" v-else>
        <code-block>
          {{ logs.join("\n") }}
        </code-block>
      </v-col>
    </v-row>
  </v-container>
</template>
