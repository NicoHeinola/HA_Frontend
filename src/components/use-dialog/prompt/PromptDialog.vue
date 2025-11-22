<script lang="ts" setup>
import { ref } from "vue";
import { VTextarea, VTextField } from "vuetify/components";

const props = withDefaults(
  defineProps<{
    title?: string;
    text?: string;
    label?: string;
    inputType?: string;
  }>(),
  {
    title: "Enter text",
    text: "",
    label: "Input",
    inputType: "text",
  }
);

const emit = defineEmits<{
  (e: "resolve", payload: string | null): void;
}>();

const inputValue = ref<string>("");

const inputComponent = computed(() => {
  return props.inputType === "textarea" ? VTextarea : VTextField;
});

const handleConfirm = () => {
  emit("resolve", inputValue.value);
};

const handleCancel = () => {
  emit("resolve", null);
};
</script>

<template>
  <v-card>
    <v-card-title v-if="title">{{ title }}</v-card-title>
    <v-card-text>
      <p v-if="text" class="mb-4">{{ text }}</p>
      <component :is="inputComponent" v-model="inputValue" :label="label" @keyup.enter="handleConfirm" />
    </v-card-text>
    <v-card-actions class="d-flex justify-end">
      <v-btn variant="outlined" color="error" @click="handleCancel">Cancel</v-btn>
      <v-btn variant="elevated" color="success" @click="handleConfirm">OK</v-btn>
    </v-card-actions>
  </v-card>
</template>
