<script lang="ts" setup>
import { computed, ref } from "vue";
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
  <v-navigation-drawer location="left" :model-value="true">
    <template #prepend>
      <template v-for="link in topLinks" :key="link.text">
        <v-list-item
          class="pa-2"
          :class="{ 'active-link': selectedLink === link.route }"
          :color="getLinkColor(link.route)"
          link
          :to="link.route"
        >
          <template #prepend>
            <v-icon :icon="link.icon" />
          </template>

          <v-list-item-title :text="link.text" />
        </v-list-item>
      </template>
    </template>
    <template #append>
      <template v-for="link in bottomLinks" :key="link.text">
        <v-list-item
          class="pa-2"
          :class="{ 'active-link': selectedLink === link.route }"
          :color="getLinkColor(link.route)"
          link
          :to="link.route"
        >
          <template #prepend>
            <v-icon :icon="link.icon" />
          </template>

          <v-list-item-title :text="link.text" />
        </v-list-item>
      </template>
    </template>
  </v-navigation-drawer>
</template>

<style scoped></style>
