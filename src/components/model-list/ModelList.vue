<script lang="ts" setup>
const props = defineProps<{
  models: Array<Record<string, any>>;
}>();

const emit = defineEmits<{
  "on-model-click": [model: any];
}>();
</script>

<template>
  <v-list>
    <v-list-item
      v-for="model in props.models"
      :key="model.name"
      :disabled="!!model.disabled"
      @click="emit('on-model-click', model)"
    >
      <template #prepend>
        <slot name="prepend-item" :model="model">
          <v-icon v-if="model.isDefault" size="small" color="secondary">mdi-star</v-icon>
          <v-icon v-else size="small" class="opacity-0">mdi-star</v-icon>
        </slot>
      </template>
      <v-list-item-title>{{ model.name }}</v-list-item-title>
    </v-list-item>
    <v-list-item v-if="props.models?.length === 0" disabled>
      <v-list-item-title class="text-disabled">No models available</v-list-item-title>
    </v-list-item>
  </v-list>
</template>
