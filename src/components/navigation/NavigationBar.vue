<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useTheme } from "vuetify";
import { useThemeStore } from "@/stores/themeStore";
import ThemePicker from "./ThemePicker.vue";

const links = ref([
  {
    text: "Chat",
    icon: "mdi-chat",
    route: "/chat",
  },
  {
    text: "TTA Settings",
    icon: "mdi-cog",
    route: "/settings/tta",
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
  <v-navigation-drawer location="left" :mobile="false" :model-value="true">
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

          <v-list-item-title>{{ link.text }}</v-list-item-title>
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

          <v-list-item-title>{{ link.text }}</v-list-item-title>
        </v-list-item>
      </template>
      <theme-picker />
    </template>
  </v-navigation-drawer>
</template>

<style scoped></style>
