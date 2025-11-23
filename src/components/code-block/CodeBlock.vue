<script lang="ts" setup>
const slots = useSlots();

const formattedSlotText = computed(() => {
  const slot: VNode[] = slots.default ? slots.default() : [];
  const slotText = slot
    .map(vnode => {
      if (typeof vnode.children === "string") {
        return vnode.children;
      }
      return "";
    })
    .join("");

  return slotText;
});
</script>

<template>
  <pre class="pa-4 bg-grey-darken-4 rounded overflow-auto">
    {{ formattedSlotText }}
  </pre>
</template>
