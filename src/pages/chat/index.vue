<script lang="ts" setup>
import TextLabel from "@/components/text-label/TextLabel.vue";
</script>

<template>
  <div class="w-100 h-100 d-flex ga-2 align-center justify-center">
    <v-row>
      <v-col cols="12">
        <h1 class="text-center">Hello!</h1>
        <text-label class="text-center text-grey">I'm your AI assistant. How can I help you today?</text-label>
      </v-col>
      <v-col cols="12" class="d-flex align-center justify-center">
        <v-textarea density="comfortable" style="max-width: 600px" label="Type your message here..."></v-textarea>
      </v-col>
    </v-row>
  </div>
</template>
