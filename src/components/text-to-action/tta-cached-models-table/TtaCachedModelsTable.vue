<script lang="ts" setup>
interface CachedModel {
  name: string;
  isDefault: boolean;
}

const props = defineProps<{
  models: CachedModel[];
  isLoading: boolean;
}>();

const emit = defineEmits<{
  (e: "delete", modelName: string): void;
}>();
</script>

<template>
  <v-data-table
    :headers="[
      { title: 'Default', key: 'isDefault', align: 'center', sortable: false, width: '0px' },
      { title: 'Model Name', key: 'name', align: 'start' },
      { title: 'Actions', key: 'actions', align: 'end', sortable: false },
    ]"
    :items="props.models"
    :items-per-page-options="[
      {
        title: 'All',
        value: -1,
      },
    ]"
    :items-per-page="-1"
    :loading="props.isLoading"
  >
    <template #item.isDefault="{ item }">
      <v-icon v-if="item.isDefault" size="small" color="secondary">mdi-star</v-icon>
    </template>

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
