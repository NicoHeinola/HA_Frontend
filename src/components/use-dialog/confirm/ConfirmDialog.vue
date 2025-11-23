<script lang="ts" setup>
withDefaults(
  defineProps<{
    title?: string
    text?: string
  }>(),
  {
    title: "Are you sure?",
    text: "This action cannot be undone.",
  },
);

const emit = defineEmits<{
  (e: "resolve", payload: boolean): void
}>();
</script>

<template>
  <v-card>
    <v-card-title v-if="title">{{ title }} </v-card-title>
    <v-card-text>
      {{ text }}
    </v-card-text>
    <v-card-actions class="d-flex justify-end">
      <v-btn color="error" variant="outlined" @click="emit('resolve', false)">Cancel</v-btn>
      <v-btn color="success" variant="elevated" @click="emit('resolve', true)">OK</v-btn>
    </v-card-actions>
  </v-card>
</template>
