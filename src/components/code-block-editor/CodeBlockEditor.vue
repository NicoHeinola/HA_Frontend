<script lang="ts" setup>
const inputRef = ref();

const model = defineModel<any>({ required: false });

const handleTabKey = (event: KeyboardEvent) => {
  if (event.key === "Tab") {
    event.preventDefault();

    const textarea = inputRef.value?.$el?.querySelector("textarea");
    if (!textarea) return;

    // Insert a tab
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = textarea.value;
    textarea.value = value.substring(0, start) + "\t" + value.substring(end);
    textarea.selectionStart = textarea.selectionEnd = start + 1;

    // Update v-model
    model.value = textarea.value;
  }
};
</script>

<template>
  <v-textarea ref="inputRef" v-model="model" @keydown="handleTabKey" v-bind="$attrs" />
</template>
