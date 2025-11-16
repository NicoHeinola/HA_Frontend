<script lang="ts" setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";

const links = ref([
  {
    text: "Chat",
    icon: "mdi-chat",
    route: "/chat",
  },
  {
    text: "Settings",
    icon: "mdi-cog",
    route: "/settings",
    bottom: true,
  },
]);

const route = useRoute();
const selectedLink = computed(() => route.path);

const topLinks = computed(() => links.value.filter((link) => !link.bottom));

const bottomLinks = computed(() => links.value.filter((link) => link.bottom));

const getLinkColor = (route: string) => {
  return selectedLink.value === route ? "secondary" : "";
};
</script>

<template>
  <v-navigation-drawer :model-value="true" location="left">
    <template #prepend>
      <template v-for="link in topLinks" :key="link.text">
        <v-list-item
          class="pa-2"
          link
          :class="{ 'active-link': selectedLink === link.route }"
          :to="link.route"
          :color="getLinkColor(link.route)"
        >
          <template v-slot:prepend>
            <v-icon :icon="link.icon"></v-icon>
          </template>

          <v-list-item-title v-text="link.text"></v-list-item-title>
        </v-list-item>
      </template>
    </template>
    <template #append>
      <template v-for="link in bottomLinks" :key="link.text">
        <v-list-item
          class="pa-2"
          link
          :class="{ 'active-link': selectedLink === link.route }"
          :to="link.route"
          :color="getLinkColor(link.route)"
        >
          <template v-slot:prepend>
            <v-icon :icon="link.icon"></v-icon>
          </template>

          <v-list-item-title v-text="link.text"></v-list-item-title>
        </v-list-item>
      </template>
    </template>
  </v-navigation-drawer>
</template>

<style scoped></style>
