<script lang="ts" setup>
const slots = useSlots();

const formattedSlotText = computed(() => {
  const slot: VNode[] = slots.default ? slots.default() : [];
  const slotText = slot
    .map((vnode) => {
      if (typeof vnode.children === "string") {
        return vnode.children;
      }
      return "";
    })
    .join("");

  return slotText.trim();
});
</script>

<template>
  <div class="h-100 bg-background overflow-y-auto">
    <pre class="pa-4 rounded">{{ formattedSlotText }}</pre>
  </div>
</template>
