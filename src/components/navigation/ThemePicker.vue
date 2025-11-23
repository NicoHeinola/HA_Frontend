<script lang="ts" setup>
import { computed } from "vue";
import { useTheme } from "vuetify";
import { useThemeStore } from "@/stores/themeStore";

const theme = useTheme();
const themeStore = useThemeStore();

const availableThemes = computed(() => Object.keys(theme.themes.value));

const changeTheme = (themeName: string) => {
  themeStore.setTheme(themeName);
};
</script>

<template>
  <v-menu>
    <template #activator="{ props }">
      <v-list-item class="pa-2" v-bind="props" prepend-icon="mdi-palette" @click.stop>
        <v-list-item-title>Theme</v-list-item-title>
        <template #append>
          <v-icon>mdi-chevron-down</v-icon>
        </template>
      </v-list-item>
    </template>
    <v-list>
      <v-list-item v-for="availableTheme in availableThemes" :key="availableTheme" @click="changeTheme(availableTheme)">
        <template #prepend>
          <v-icon :style="{ opacity: themeStore.currentTheme === availableTheme ? 1 : 0 }" icon="mdi-check" />
        </template>
        <v-list-item-title>{{ availableTheme }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<style scoped></style>
