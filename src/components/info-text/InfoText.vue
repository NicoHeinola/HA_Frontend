<script setup lang="ts">
defineProps<{
  tooltip?: string;
}>();
</script>

<template>
  <div class="d-flex ga-2 align-center" v-bind="$attrs">
    <slot />
    <v-tooltip v-if="tooltip" :text="tooltip">
      <template #activator="{ props }">
        <v-icon color="secondary" v-bind="props">mdi-information</v-icon>
      </template>
    </v-tooltip>
  </div>
</template>
