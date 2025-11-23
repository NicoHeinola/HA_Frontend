<script lang="ts" setup>
const props = defineProps<{
  models: string[];
  isLoading: boolean;
}>();

const emit = defineEmits<{
  (e: "delete", modelName: string): void;
}>();
</script>

<template>
  <v-data-table
    :headers="[
      { title: 'Model Name', key: 'name', align: 'start' },
      { title: 'Actions', key: 'actions', align: 'end', sortable: false },
    ]"
    :items="props.models.map((model) => ({ name: model }))"
    :items-per-page-options="[
      {
        title: 'All',
        value: -1,
      },
    ]"
    :items-per-page="-1"
    :loading="props.isLoading"
  >
    <template #item.actions="{ item }">
      <v-btn
        icon="mdi-delete"
        size="small"
        variant="text"
        color="error"
        :loading="props.isLoading"
        @click="emit('delete', item.name)"
      />
    </template>

    <template #no-data>
      <p>No cached models</p>
    </template>
  </v-data-table>
</template>
