<script lang="ts" setup></script>

<template>
  <div class="w-100 h-100 d-flex ga-2 align-center justify-center">
    <v-row>
      <v-col cols="12">
        <h1 class="text-center">Hello!</h1>
        <p class="text-center text-medium-emphasis text-subtitle-2">I'm your AI assistant. How can I help you today?</p>
      </v-col>
      <v-col cols="12" class="d-flex align-center justify-center">
        <v-text-field density="comfortable" style="max-width: 600px" label="How can I help?"></v-text-field>
      </v-col>
    </v-row>
  </div>
</template>
